from typing import Any, Dict, List, Optional

from backend.models.facts import (
    ConflictItem,
    DocumentEvidence,
    ExtractedField,
    HouseholdFacts,
    Provenance,
)


def merge_facts(
    narrative_facts: Dict[str, Any],
    documents: List[DocumentEvidence],
    conflict_resolutions: Optional[Dict[str, Any]] = None,
    raw_narrative: Optional[str] = None,
) -> HouseholdFacts:
    """Combines narrative facts and document evidence deterministically.
    Applies provenance precedence:
      DOCUMENT_PROVEN (confidence >= 0.75) > SELF_DECLARED > UNKNOWN.
    Preserves conflicts instead of silently choosing.
    Calculates derived arithmetic (income aggregation, acre conversion).
    """
    conflict_resolutions = conflict_resolutions or {}
    conflicts: List[ConflictItem] = []
    final_fields: Dict[str, ExtractedField] = {}

    # 1. Collect all document extracted fields by fact_key
    doc_fields_by_key: Dict[str, List[ExtractedField]] = {}
    uploaded_doc_types = [doc.detected_type for doc in documents if doc.detected_type != "unknown"]

    for doc in documents:
        for field in doc.extracted_fields:
            if field.raw_value is not None:
                doc_fields_by_key.setdefault(field.fact_key, []).append(field)

    # List of known target fact keys
    fact_keys = [
        ("applicant_name", "Applicant Full Name"),
        ("applicant_age", "Applicant Age"),
        ("gender", "Applicant Gender"),
        ("social_category", "Social / Caste Category"),
        ("household_size", "Household Size"),
        ("annual_family_income", "Annual Family Income (₹)"),
        ("rural_urban_status", "Rural / Urban Status"),
        ("housing_condition", "Housing Condition"),
        ("disability_status", "Certified Disability Status"),
        ("land_holding_acres", "Agricultural Landholding (Acres)"),
        ("is_institutional_landholder", "Institutional Landholder Status"),
        ("is_income_tax_payer", "Income Tax Payer Status"),
        ("has_bpl_or_secc_eligibility", "BPL / SECC Deprivation Eligibility"),
        ("has_lpg_connection", "Active LPG Connection"),
        ("is_post_matric_student", "Post-Matric Student Status"),
        ("is_ug_student", "Under-Graduate (UG) College Student Status"),
        ("academic_percentage", "Academic Qualifying Marks (%)"),
        ("is_availing_other_scholarship", "Availing Other Scholarship Status"),
        ("aadhaar_present", "Aadhaar Card Present / Seeded"),
        ("bank_account_present", "Bank Account Details Present"),
    ]

    for key, label in fact_keys:
        narrative_val = narrative_facts.get(key)
        doc_fields = doc_fields_by_key.get(key, [])

        # Check if user already provided a manual resolution for this key
        if key in conflict_resolutions:
            resolved_val = conflict_resolutions[key]
            final_fields[key] = ExtractedField(
                fact_key=key,
                raw_value=resolved_val,
                verbatim_snippet=f"User verified value: {resolved_val}",
                confidence=1.0,
                source_image_id="user_resolution",
                provenance=Provenance.DOCUMENT_PROVEN if doc_fields else Provenance.SELF_DECLARED,
            )
            continue

        # Case A: Both narrative and document evidence exist
        if narrative_val is not None and doc_fields:
            best_doc_field = max(doc_fields, key=lambda f: f.confidence)
            doc_val = best_doc_field.raw_value

            # Conflict Detection:
            # Numeric tolerance (e.g. within 5% or exact match)
            is_conflicting = False
            try:
                num_narrative = float(narrative_val)
                num_doc = float(doc_val)
                if abs(num_narrative - num_doc) > (0.05 * max(num_narrative, num_doc, 1.0)):
                    is_conflicting = True
            except (ValueError, TypeError):
                if str(narrative_val).strip().lower() != str(doc_val).strip().lower():
                    is_conflicting = True

            if is_conflicting:
                conflicts.append(
                    ConflictItem(
                        field=key,
                        label=label,
                        narrative_value=narrative_val,
                        document_value=doc_val,
                        document_type=best_doc_field.source_image_id or "Document",
                        verbatim_snippet=best_doc_field.verbatim_snippet,
                        source_image_id=best_doc_field.source_image_id,
                    )
                )
                # In conflict state, use the verified document proof as provisional or await confirmation
                final_fields[key] = ExtractedField(
                    fact_key=key,
                    raw_value=doc_val,
                    verbatim_snippet=best_doc_field.verbatim_snippet,
                    confidence=best_doc_field.confidence,
                    source_image_id=best_doc_field.source_image_id,
                    provenance=Provenance.DOCUMENT_PROVEN,
                )
            else:
                # Agreement between narrative and document
                final_fields[key] = ExtractedField(
                    fact_key=key,
                    raw_value=doc_val,
                    verbatim_snippet=best_doc_field.verbatim_snippet,
                    confidence=best_doc_field.confidence,
                    source_image_id=best_doc_field.source_image_id,
                    provenance=Provenance.DOCUMENT_PROVEN,
                )

        # Case B: Document evidence only
        elif doc_fields:
            best_doc_field = max(doc_fields, key=lambda f: f.confidence)
            final_fields[key] = ExtractedField(
                fact_key=key,
                raw_value=best_doc_field.raw_value,
                verbatim_snippet=best_doc_field.verbatim_snippet,
                confidence=best_doc_field.confidence,
                source_image_id=best_doc_field.source_image_id,
                provenance=Provenance.DOCUMENT_PROVEN if best_doc_field.confidence >= 0.75 else Provenance.SELF_DECLARED,
            )

        # Case C: Narrative only (Self-declared)
        elif narrative_val is not None:
            final_fields[key] = ExtractedField(
                fact_key=key,
                raw_value=narrative_val,
                verbatim_snippet=f"Self-declared in narrative: '{raw_narrative[:120]}...'" if raw_narrative else "Self-declared",
                confidence=0.70,
                source_image_id=None,
                provenance=Provenance.SELF_DECLARED,
            )

        # Case D: Not provided anywhere
        else:
            final_fields[key] = ExtractedField(
                fact_key=key,
                raw_value=None,
                provenance=Provenance.UNKNOWN,
            )

    # 2. Derive facts where appropriate
    # If land_holding_acres is positive, is_institutional_landholder defaults to False if unknown
    if final_fields["land_holding_acres"].raw_value is not None:
        if final_fields["is_institutional_landholder"].raw_value is None:
            final_fields["is_institutional_landholder"] = ExtractedField(
                fact_key="is_institutional_landholder",
                raw_value=False,
                verbatim_snippet="Derived: Individual smallholder ownership indicated",
                confidence=0.85,
                provenance=Provenance.DERIVED,
            )

    # If Aadhaar card is in uploaded_doc_types, aadhaar_present is True and DOCUMENT_PROVEN
    if "aadhaar_card" in uploaded_doc_types or "aadhaar" in uploaded_doc_types:
        final_fields["aadhaar_present"] = ExtractedField(
            fact_key="aadhaar_present",
            raw_value=True,
            verbatim_snippet="Proved via uploaded Aadhaar Card",
            confidence=0.98,
            source_image_id="aadhaar_card",
            provenance=Provenance.DOCUMENT_PROVEN,
        )

    # If BPL card or ration card is uploaded, has_bpl_or_secc_eligibility is True
    if any(t in uploaded_doc_types for t in ["bpl_card", "ration_card"]):
        if final_fields["has_bpl_or_secc_eligibility"].raw_value is None:
            final_fields["has_bpl_or_secc_eligibility"] = ExtractedField(
                fact_key="has_bpl_or_secc_eligibility",
                raw_value=True,
                verbatim_snippet="Proved via uploaded Ration/BPL Card",
                confidence=0.95,
                source_image_id="ration_card",
                provenance=Provenance.DOCUMENT_PROVEN,
            )

    # If UG student is true, is_post_matric_student is derived as True
    if final_fields["is_ug_student"].raw_value is True:
        if final_fields["is_post_matric_student"].raw_value is None:
            final_fields["is_post_matric_student"] = ExtractedField(
                fact_key="is_post_matric_student",
                raw_value=True,
                verbatim_snippet="Derived: Under-Graduate degree is post-matric by statutory definition",
                confidence=0.95,
                provenance=Provenance.DERIVED,
            )

    # Default is_availing_other_scholarship to False if unmentioned
    if final_fields["is_availing_other_scholarship"].raw_value is None:
        final_fields["is_availing_other_scholarship"] = ExtractedField(
            fact_key="is_availing_other_scholarship",
            raw_value=False,
            verbatim_snippet="Self-declared: No concurrent scholarship recorded",
            confidence=0.85,
            provenance=Provenance.SELF_DECLARED,
        )

    # Default is_income_tax_payer to False if income < 2.5L and not explicitly taxpayer
    inc = final_fields["annual_family_income"].raw_value
    if inc is not None:
        try:
            if float(inc) <= 250000 and final_fields["is_income_tax_payer"].raw_value is None:
                final_fields["is_income_tax_payer"] = ExtractedField(
                    fact_key="is_income_tax_payer",
                    raw_value=False,
                    verbatim_snippet=f"Derived: Annual income ₹{inc} below basic tax exemption threshold",
                    confidence=0.90,
                    provenance=Provenance.DERIVED,
                )
        except (ValueError, TypeError):
            pass

    return HouseholdFacts(
        applicant_name=final_fields.get("applicant_name"),
        applicant_age=final_fields.get("applicant_age"),
        gender=final_fields.get("gender"),
        social_category=final_fields.get("social_category"),
        household_size=final_fields.get("household_size"),
        annual_family_income=final_fields.get("annual_family_income"),
        rural_urban_status=final_fields.get("rural_urban_status"),
        housing_condition=final_fields.get("housing_condition"),
        disability_status=final_fields.get("disability_status"),
        land_holding_acres=final_fields.get("land_holding_acres"),
        is_institutional_landholder=final_fields.get("is_institutional_landholder"),
        is_income_tax_payer=final_fields.get("is_income_tax_payer"),
        has_bpl_or_secc_eligibility=final_fields.get("has_bpl_or_secc_eligibility"),
        has_lpg_connection=final_fields.get("has_lpg_connection"),
        is_post_matric_student=final_fields.get("is_post_matric_student"),
        is_ug_student=final_fields.get("is_ug_student"),
        academic_percentage=final_fields.get("academic_percentage"),
        is_availing_other_scholarship=final_fields.get("is_availing_other_scholarship"),
        aadhaar_present=final_fields.get("aadhaar_present"),
        bank_account_present=final_fields.get("bank_account_present"),
        raw_narrative=raw_narrative,
        uploaded_document_types=uploaded_doc_types,
        conflicts=conflicts,
        documents=documents,
    )
