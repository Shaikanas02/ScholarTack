import pytest
from backend.engine.loader import load_scheme_packs
from backend.models.facts import ExtractedField, HouseholdFacts, Provenance
from backend.pdf.generator import generate_application_pdf, generate_printable_ledger_pdf

SCHEME_PACKS = load_scheme_packs()


def test_generate_application_pdf():
    scheme = SCHEME_PACKS["pm_kisan"]
    facts = HouseholdFacts(
        applicant_name=ExtractedField(fact_key="applicant_name", raw_value="Ramesh Kumar", provenance=Provenance.DOCUMENT_PROVEN),
        applicant_age=ExtractedField(fact_key="applicant_age", raw_value=45, provenance=Provenance.DOCUMENT_PROVEN),
        land_holding_acres=ExtractedField(fact_key="land_holding_acres", raw_value=2.0, provenance=Provenance.DOCUMENT_PROVEN),
        annual_family_income=ExtractedField(fact_key="annual_family_income", raw_value=120000.0, provenance=Provenance.DOCUMENT_PROVEN),
    )

    pdf_bytes = generate_application_pdf(scheme, facts)
    assert isinstance(pdf_bytes, bytes)
    assert len(pdf_bytes) > 500
    assert pdf_bytes.startswith(b"%PDF-")


def test_generate_printable_ledger_pdf():
    scheme = SCHEME_PACKS["pm_kisan"]
    facts = HouseholdFacts(
        applicant_name=ExtractedField(fact_key="applicant_name", raw_value="Ramesh Kumar", provenance=Provenance.DOCUMENT_PROVEN),
    )

    pdf_bytes = generate_printable_ledger_pdf(scheme, facts)
    assert isinstance(pdf_bytes, bytes)
    assert len(pdf_bytes) > 500
    assert pdf_bytes.startswith(b"%PDF-")
