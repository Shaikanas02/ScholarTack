import pytest
from backend.models.facts import ExtractedField, HouseholdFacts, Provenance
from backend.models.scheme import CriterionStatus, Predicate, RuleDefinition, SchemePack, SchemeVerdict


def test_extracted_field_defaults():
    field = ExtractedField(fact_key="land_holding_acres", raw_value=2.5)
    assert field.fact_key == "land_holding_acres"
    assert field.raw_value == 2.5
    assert field.provenance == Provenance.UNKNOWN
    assert field.confidence == 1.0


def test_provenance_enum_values():
    assert Provenance.DOCUMENT_PROVEN == "DOCUMENT_PROVEN"
    assert Provenance.SELF_DECLARED == "SELF_DECLARED"
    assert Provenance.DERIVED == "DERIVED"
    assert Provenance.UNKNOWN == "UNKNOWN"


def test_rule_definition_validation():
    rule = RuleDefinition(
        rule_id="RULE_01",
        label="Land holding check",
        plain_description="Must own land",
        required_fact="land_holding_acres",
        predicate=Predicate(operator="gt", value=0),
        accepted_proof=["land_ownership_record"],
        source_clause="Clause 2.1",
        source_url="https://example.gov.in",
    )
    assert rule.predicate.operator == "gt"
    assert rule.predicate.value == 0
