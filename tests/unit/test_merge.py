import pytest
from backend.merge.merger import merge_facts
from backend.models.facts import DocumentEvidence, ExtractedField, Provenance


def test_merge_provenance_precedence():
    """Document evidence (>= 0.75) outranks self-declared narrative."""
    narrative_facts = {"land_holding_acres": 1.5}
    doc_evidence = [
        DocumentEvidence(
            document_id="doc_1",
            document_name="khasra.jpg",
            detected_type="land_ownership_record",
            confidence=0.95,
            extracted_fields=[
                ExtractedField(
                    fact_key="land_holding_acres",
                    raw_value=2.0,
                    verbatim_snippet="Area: 2.00 Acres",
                    confidence=0.95,
                    source_image_id="khasra.jpg",
                    provenance=Provenance.DOCUMENT_PROVEN,
                )
            ],
        )
    ]

    merged = merge_facts(narrative_facts, doc_evidence)
    assert merged.land_holding_acres is not None
    assert merged.land_holding_acres.provenance == Provenance.DOCUMENT_PROVEN


def test_conflict_detection_and_preservation():
    """When narrative and document significantly differ, flag a conflict and do not silently hide it."""
    narrative_facts = {"annual_family_income": 180000.0}
    doc_evidence = [
        DocumentEvidence(
            document_id="doc_1",
            document_name="income_cert.jpg",
            detected_type="income_certificate",
            confidence=0.95,
            extracted_fields=[
                ExtractedField(
                    fact_key="annual_family_income",
                    raw_value=210000.0,
                    verbatim_snippet="Income: ₹2,10,000",
                    confidence=0.95,
                    source_image_id="income_cert.jpg",
                    provenance=Provenance.DOCUMENT_PROVEN,
                )
            ],
        )
    ]

    merged = merge_facts(narrative_facts, doc_evidence)
    assert len(merged.conflicts) == 1
    conflict = merged.conflicts[0]
    assert conflict.field == "annual_family_income"
    assert conflict.narrative_value == 180000.0
    assert conflict.document_value == 210000.0


def test_conflict_resolution():
    """User confirmed resolution overrides both and clears active conflict."""
    narrative_facts = {"annual_family_income": 180000.0}
    doc_evidence = [
        DocumentEvidence(
            document_id="doc_1",
            document_name="income_cert.jpg",
            detected_type="income_certificate",
            confidence=0.95,
            extracted_fields=[
                ExtractedField(
                    fact_key="annual_family_income",
                    raw_value=210000.0,
                    verbatim_snippet="Income: ₹2,10,000",
                    confidence=0.95,
                    source_image_id="income_cert.jpg",
                    provenance=Provenance.DOCUMENT_PROVEN,
                )
            ],
        )
    ]

    merged = merge_facts(
        narrative_facts,
        doc_evidence,
        conflict_resolutions={"annual_family_income": 210000.0},
    )
    assert len(merged.conflicts) == 0
    assert merged.annual_family_income.raw_value == 210000.0
