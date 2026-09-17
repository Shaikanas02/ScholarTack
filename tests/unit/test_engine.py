import pytest
from backend.engine.evaluator import evaluate_scheme
from backend.engine.loader import load_scheme_packs
from backend.models.facts import ExtractedField, HouseholdFacts, Provenance
from backend.models.scheme import CriterionStatus, SchemeVerdict

# Load verified scheme packs
SCHEME_PACKS = load_scheme_packs()
PM_KISAN = SCHEME_PACKS["pm_kisan"]
AYUSHMAN = SCHEME_PACKS["ayushman_bharat"]
POST_MATRIC = SCHEME_PACKS["post_matric_sc"]


def test_golden_matrix_clearly_eligible():
    """Case 1: Small farmer with valid land record, non-institutional, Aadhaar, non-taxpayer -> PM-KISAN ELIGIBLE."""
    facts = HouseholdFacts(
        land_holding_acres=ExtractedField(
            fact_key="land_holding_acres",
            raw_value=2.0,
            provenance=Provenance.DOCUMENT_PROVEN,
            source_image_id="land_ownership_record",
        ),
        is_institutional_landholder=ExtractedField(
            fact_key="is_institutional_landholder",
            raw_value=False,
            provenance=Provenance.DOCUMENT_PROVEN,
            source_image_id="land_ownership_record",
        ),
        aadhaar_present=ExtractedField(
            fact_key="aadhaar_present",
            raw_value=True,
            provenance=Provenance.DOCUMENT_PROVEN,
            source_image_id="aadhaar_card",
        ),
        is_income_tax_payer=ExtractedField(
            fact_key="is_income_tax_payer",
            raw_value=False,
            provenance=Provenance.DERIVED,
        ),
        uploaded_document_types=["land_ownership_record", "aadhaar_card", "bank_passbook"],
    )

    evaluation = evaluate_scheme(PM_KISAN, facts)
    assert evaluation.verdict == SchemeVerdict.ELIGIBLE
    assert len(evaluation.missing_documents) == 0
    assert all(cr.status == CriterionStatus.PASS for cr in evaluation.criteria_results)


def test_golden_matrix_clearly_ineligible():
    """Case 2: Institutional landholder or landholding <= 0 -> PM-KISAN NOT_ELIGIBLE."""
    facts = HouseholdFacts(
        land_holding_acres=ExtractedField(
            fact_key="land_holding_acres",
            raw_value=0.0,
            provenance=Provenance.DOCUMENT_PROVEN,
            source_image_id="land_record",
        ),
        is_institutional_landholder=ExtractedField(
            fact_key="is_institutional_landholder",
            raw_value=True,
            provenance=Provenance.DOCUMENT_PROVEN,
            source_image_id="land_record",
        ),
        aadhaar_present=ExtractedField(
            fact_key="aadhaar_present",
            raw_value=True,
            provenance=Provenance.DOCUMENT_PROVEN,
            source_image_id="aadhaar_card",
        ),
        uploaded_document_types=["land_ownership_record", "aadhaar_card", "bank_passbook"],
    )

    evaluation = evaluate_scheme(PM_KISAN, facts)
    assert evaluation.verdict == SchemeVerdict.NOT_ELIGIBLE
    assert any(cr.status == CriterionStatus.FAIL for cr in evaluation.criteria_results)


def test_golden_matrix_missing_evidence():
    """Case 3: Self-declared landholding without documentary proof -> INCOMPLETE with MISSING_PROOF."""
    facts = HouseholdFacts(
        land_holding_acres=ExtractedField(
            fact_key="land_holding_acres",
            raw_value=3.5,
            provenance=Provenance.SELF_DECLARED,  # Not documented!
        ),
        is_institutional_landholder=ExtractedField(
            fact_key="is_institutional_landholder",
            raw_value=False,
            provenance=Provenance.SELF_DECLARED,
        ),
        aadhaar_present=ExtractedField(
            fact_key="aadhaar_present",
            raw_value=True,
            provenance=Provenance.DOCUMENT_PROVEN,
            source_image_id="aadhaar_card",
        ),
        uploaded_document_types=["aadhaar_card"],
    )

    evaluation = evaluate_scheme(PM_KISAN, facts)
    # Must NOT declare eligible
    assert evaluation.verdict == SchemeVerdict.INCOMPLETE
    # The land holding criterion must report MISSING_PROOF
    land_result = next(cr for cr in evaluation.criteria_results if cr.rule_id == "PMK_01")
    assert land_result.status == CriterionStatus.MISSING_PROOF


def test_golden_matrix_boundary_value():
    """Case 4: Income right at boundary threshold for Post-Matric SC (limit is <= 250000)."""
    # At exact threshold (250000)
    facts_at_limit = HouseholdFacts(
        social_category=ExtractedField(
            fact_key="social_category",
            raw_value="SC",
            provenance=Provenance.DOCUMENT_PROVEN,
            source_image_id="caste_certificate",
        ),
        annual_family_income=ExtractedField(
            fact_key="annual_family_income",
            raw_value=250000.0,
            provenance=Provenance.DOCUMENT_PROVEN,
            source_image_id="income_certificate",
        ),
        is_post_matric_student=ExtractedField(
            fact_key="is_post_matric_student",
            raw_value=True,
            provenance=Provenance.DOCUMENT_PROVEN,
            source_image_id="marksheet_or_admission_receipt",
        ),
        aadhaar_present=ExtractedField(
            fact_key="aadhaar_present",
            raw_value=True,
            provenance=Provenance.DOCUMENT_PROVEN,
            source_image_id="aadhaar_card",
        ),
        uploaded_document_types=[
            "caste_certificate",
            "income_certificate",
            "marksheet_or_admission_receipt",
            "aadhaar_card",
        ],
    )

    eval_limit = evaluate_scheme(POST_MATRIC, facts_at_limit)
    income_res = next(cr for cr in eval_limit.criteria_results if cr.rule_id == "PMS_02")
    assert income_res.status == CriterionStatus.PASS

    # Above threshold (250001)
    facts_above = HouseholdFacts(
        social_category=ExtractedField(
            fact_key="social_category",
            raw_value="SC",
            provenance=Provenance.DOCUMENT_PROVEN,
            source_image_id="caste_certificate",
        ),
        annual_family_income=ExtractedField(
            fact_key="annual_family_income",
            raw_value=250001.0,
            provenance=Provenance.DOCUMENT_PROVEN,
            source_image_id="income_certificate",
        ),
        is_post_matric_student=ExtractedField(
            fact_key="is_post_matric_student",
            raw_value=True,
            provenance=Provenance.DOCUMENT_PROVEN,
            source_image_id="marksheet_or_admission_receipt",
        ),
        aadhaar_present=ExtractedField(
            fact_key="aadhaar_present",
            raw_value=True,
            provenance=Provenance.DOCUMENT_PROVEN,
            source_image_id="aadhaar_card",
        ),
        uploaded_document_types=[
            "caste_certificate",
            "income_certificate",
            "marksheet_or_admission_receipt",
            "aadhaar_card",
        ],
    )

    eval_above = evaluate_scheme(POST_MATRIC, facts_above)
    assert eval_above.verdict == SchemeVerdict.NOT_ELIGIBLE


def test_golden_matrix_stale_rule():
    """Case 5: A scheme with an outdated verification date (> review_window_days) cannot yield ELIGIBLE."""
    stale_pack = PM_KISAN.model_copy(deep=True)
    stale_pack.last_verified = "2020-01-01"  # 5+ years ago

    facts = HouseholdFacts(
        land_holding_acres=ExtractedField(
            fact_key="land_holding_acres",
            raw_value=2.0,
            provenance=Provenance.DOCUMENT_PROVEN,
            source_image_id="land_ownership_record",
        ),
        is_institutional_landholder=ExtractedField(
            fact_key="is_institutional_landholder",
            raw_value=False,
            provenance=Provenance.DOCUMENT_PROVEN,
            source_image_id="land_ownership_record",
        ),
        aadhaar_present=ExtractedField(
            fact_key="aadhaar_present",
            raw_value=True,
            provenance=Provenance.DOCUMENT_PROVEN,
            source_image_id="aadhaar_card",
        ),
        uploaded_document_types=["land_ownership_record", "aadhaar_card", "bank_passbook"],
    )

    eval_stale = evaluate_scheme(stale_pack, facts)
    assert eval_stale.verdict == SchemeVerdict.INCOMPLETE
    assert any(cr.status == CriterionStatus.STALE for cr in eval_stale.criteria_results)


def test_nsp_ug_merit_eligible():
    """NSP Central Sector Scheme (UG): 84% in 12th, ₹2.2L income, UG student, no other scholarship -> ELIGIBLE."""
    nsp_pack = SCHEME_PACKS["nsp_ug_merit"]
    facts = HouseholdFacts(
        is_ug_student=ExtractedField(
            fact_key="is_ug_student",
            raw_value=True,
            provenance=Provenance.DOCUMENT_PROVEN,
            source_image_id="marksheet_or_admission_receipt",
        ),
        academic_percentage=ExtractedField(
            fact_key="academic_percentage",
            raw_value=84.0,
            provenance=Provenance.DOCUMENT_PROVEN,
            source_image_id="marksheet_or_admission_receipt",
        ),
        annual_family_income=ExtractedField(
            fact_key="annual_family_income",
            raw_value=220000.0,
            provenance=Provenance.DOCUMENT_PROVEN,
            source_image_id="income_certificate",
        ),
        is_availing_other_scholarship=ExtractedField(
            fact_key="is_availing_other_scholarship",
            raw_value=False,
            provenance=Provenance.DERIVED,
        ),
        aadhaar_present=ExtractedField(
            fact_key="aadhaar_present",
            raw_value=True,
            provenance=Provenance.DOCUMENT_PROVEN,
            source_image_id="aadhaar_card",
        ),
        uploaded_document_types=["marksheet_or_admission_receipt", "income_certificate", "aadhaar_card"],
    )

    evaluation = evaluate_scheme(nsp_pack, facts)
    assert evaluation.verdict == SchemeVerdict.ELIGIBLE
    assert len(evaluation.missing_documents) == 0
    assert all(cr.status == CriterionStatus.PASS for cr in evaluation.criteria_results)


def test_nsp_ug_merit_ineligible_low_marks():
    """NSP CSSS UG: Academic marks below 75% -> NOT_ELIGIBLE."""
    nsp_pack = SCHEME_PACKS["nsp_ug_merit"]
    facts = HouseholdFacts(
        is_ug_student=ExtractedField(
            fact_key="is_ug_student",
            raw_value=True,
            provenance=Provenance.DOCUMENT_PROVEN,
            source_image_id="marksheet_or_admission_receipt",
        ),
        academic_percentage=ExtractedField(
            fact_key="academic_percentage",
            raw_value=68.0,  # Below 75%
            provenance=Provenance.DOCUMENT_PROVEN,
            source_image_id="marksheet_or_admission_receipt",
        ),
        annual_family_income=ExtractedField(
            fact_key="annual_family_income",
            raw_value=220000.0,
            provenance=Provenance.DOCUMENT_PROVEN,
            source_image_id="income_certificate",
        ),
        is_availing_other_scholarship=ExtractedField(
            fact_key="is_availing_other_scholarship",
            raw_value=False,
            provenance=Provenance.DERIVED,
        ),
        aadhaar_present=ExtractedField(
            fact_key="aadhaar_present",
            raw_value=True,
            provenance=Provenance.DOCUMENT_PROVEN,
            source_image_id="aadhaar_card",
        ),
        uploaded_document_types=["marksheet_or_admission_receipt", "income_certificate", "aadhaar_card"],
    )

    evaluation = evaluate_scheme(nsp_pack, facts)
    assert evaluation.verdict == SchemeVerdict.NOT_ELIGIBLE
    marks_cr = next(cr for cr in evaluation.criteria_results if cr.rule_id == "NSP_UG_02")
    assert marks_cr.status == CriterionStatus.FAIL


def test_ssp_post_matric_ug_eligible():
    """SSP Post-Matric UG: UG enrolled student, income ₹2.2L (<= ₹2.5L limit), category General -> ELIGIBLE."""
    ssp_pack = SCHEME_PACKS["ssp_post_matric_ug"]
    facts = HouseholdFacts(
        is_ug_student=ExtractedField(
            fact_key="is_ug_student",
            raw_value=True,
            provenance=Provenance.DOCUMENT_PROVEN,
            source_image_id="marksheet_or_admission_receipt",
        ),
        annual_family_income=ExtractedField(
            fact_key="annual_family_income",
            raw_value=220000.0,
            provenance=Provenance.DOCUMENT_PROVEN,
            source_image_id="income_certificate",
        ),
        social_category=ExtractedField(
            fact_key="social_category",
            raw_value="OBC",
            provenance=Provenance.DOCUMENT_PROVEN,
            source_image_id="income_certificate",
        ),
        aadhaar_present=ExtractedField(
            fact_key="aadhaar_present",
            raw_value=True,
            provenance=Provenance.DOCUMENT_PROVEN,
            source_image_id="aadhaar_card",
        ),
        uploaded_document_types=["marksheet_or_admission_receipt", "income_certificate", "aadhaar_card"],
    )

    evaluation = evaluate_scheme(ssp_pack, facts)
    assert evaluation.verdict == SchemeVerdict.ELIGIBLE
    assert len(evaluation.missing_documents) == 0


def test_aicte_pragati_ug_eligible():
    """AICTE Pragati: Female student enrolled in UG technical degree, income ₹2.2L (<= ₹8L) -> ELIGIBLE."""
    pragati_pack = SCHEME_PACKS["aicte_pragati_ug"]
    facts = HouseholdFacts(
        gender=ExtractedField(
            fact_key="gender",
            raw_value="Female",
            provenance=Provenance.DOCUMENT_PROVEN,
            source_image_id="aadhaar_card",
        ),
        is_ug_student=ExtractedField(
            fact_key="is_ug_student",
            raw_value=True,
            provenance=Provenance.DOCUMENT_PROVEN,
            source_image_id="marksheet_or_admission_receipt",
        ),
        annual_family_income=ExtractedField(
            fact_key="annual_family_income",
            raw_value=220000.0,
            provenance=Provenance.DOCUMENT_PROVEN,
            source_image_id="income_certificate",
        ),
        aadhaar_present=ExtractedField(
            fact_key="aadhaar_present",
            raw_value=True,
            provenance=Provenance.DOCUMENT_PROVEN,
            source_image_id="aadhaar_card",
        ),
        uploaded_document_types=["marksheet_or_admission_receipt", "income_certificate", "aadhaar_card"],
    )

    evaluation = evaluate_scheme(pragati_pack, facts)
    assert evaluation.verdict == SchemeVerdict.ELIGIBLE
    assert len(evaluation.missing_documents) == 0

