import json
import os
from unittest.mock import MagicMock, patch
import pytest

from backend.config import GEMINI_MODEL, get_gemini_client, is_gemini_available
from backend.extraction.extractor import extract_documents_batched, extract_narrative_facts
from backend.extraction.schemas import RawBatchDocumentResponse, RawNarrativeExtraction
from backend.models.facts import Provenance


def test_gemini_config_defaults():
    """Verify centralized Gemini configuration."""
    assert GEMINI_MODEL == os.getenv("GEMINI_MODEL", "gemini-2.5-flash")
    # In test environment without key, is_gemini_available returns False
    if not os.getenv("GEMINI_API_KEY"):
        assert not is_gemini_available()
        assert get_gemini_client() is None


def test_gemini_narrative_extraction_success():
    """Verify that when Gemini returns structured JSON, it is parsed and validated into canonical facts."""
    mock_response_data = {
        "applicant_name": "Ramesh Kumar",
        "applicant_age": 45,
        "gender": "male",
        "social_category": "OBC",
        "annual_family_income": 120000.0,
        "land_holding_acres": 2.0,
        "is_institutional_landholder": False,
        "is_income_tax_payer": False,
        "has_bpl_or_secc_eligibility": True,
        "aadhaar_present": True,
        "bank_account_present": True,
    }

    mock_response = MagicMock()
    mock_response.text = json.dumps(mock_response_data)

    mock_client = MagicMock()
    mock_client.models.generate_content.return_value = mock_response

    with patch("backend.extraction.extractor.get_gemini_client", return_value=mock_client):
        facts = extract_narrative_facts("My name is Ramesh Kumar, 45 years old farmer with 2 acres land.")
        assert facts["applicant_name"] == "Ramesh Kumar"
        assert facts["applicant_age"] == 45
        assert facts["annual_family_income"] == 120000.0
        assert facts["land_holding_acres"] == 2.0
        assert facts["has_bpl_or_secc_eligibility"] is True


def test_gemini_narrative_extraction_error_fallback():
    """If Gemini API raises an exception (e.g. rate limit / network), fall back gracefully to heuristic."""
    mock_client = MagicMock()
    mock_client.models.generate_content.side_effect = RuntimeError("API Quota Exceeded")

    with patch("backend.extraction.extractor.get_gemini_client", return_value=mock_client):
        # Should NOT raise, but return heuristic parsed facts
        facts = extract_narrative_facts("My name is Ramesh Kumar, age 45, farming 2 acres with income of 1.2 lakh.")
        assert facts.get("applicant_name") == "Ramesh Kumar"
        assert facts.get("applicant_age") == 45
        assert facts.get("land_holding_acres") == 2.0


def test_gemini_multimodal_document_extraction_success():
    """Verify multimodal document extraction parses structured batch JSON and sets provenance."""
    mock_batch_data = {
        "documents": [
            {
                "detected_type": "land_ownership_record",
                "document_name": "khasra.jpg",
                "confidence": 0.96,
                "retake_hint": None,
                "fields": [
                    {
                        "fact_key": "land_holding_acres",
                        "raw_value": 2.5,
                        "verbatim_snippet": "Area: 1.01 Hectares (2.50 Acres)",
                        "confidence": 0.98,
                    },
                    {
                        "fact_key": "is_institutional_landholder",
                        "raw_value": False,
                        "verbatim_snippet": "Individual Cultivator",
                        "confidence": 0.92,
                    },
                ],
            }
        ]
    }

    mock_response = MagicMock()
    mock_response.text = json.dumps(mock_batch_data)

    mock_client = MagicMock()
    mock_client.models.generate_content.return_value = mock_response

    fake_files = [("khasra.jpg", b"\xff\xd8\xff\xe0JFIFmockbytes", "image/jpeg")]

    with patch("backend.extraction.extractor.get_gemini_client", return_value=mock_client):
        evidences = extract_documents_batched(fake_files)
        assert len(evidences) == 1
        doc = evidences[0]
        assert doc.detected_type == "land_ownership_record"
        assert doc.confidence == 0.96
        assert len(doc.extracted_fields) == 2

        field = next(f for f in doc.extracted_fields if f.fact_key == "land_holding_acres")
        assert field.raw_value == 2.5
        assert field.confidence == 0.98
        assert field.provenance == Provenance.DOCUMENT_PROVEN
        assert "2.50 Acres" in field.verbatim_snippet


def test_gemini_document_extraction_malformed_json_fallback():
    """If Gemini returns malformed response text, fall back to heuristic without crash."""
    mock_response = MagicMock()
    mock_response.text = "NOT VALID JSON <html>Error 500</html>"

    mock_client = MagicMock()
    mock_client.models.generate_content.return_value = mock_response

    fake_files = [("land_record.jpg", b"\xff\xd8\xff\xe0JFIFmockbytes", "image/jpeg")]

    with patch("backend.extraction.extractor.get_gemini_client", return_value=mock_client):
        evidences = extract_documents_batched(fake_files)
        # Should gracefully fall back to heuristic
        assert len(evidences) == 1
        assert evidences[0].detected_type == "land_ownership_record"
