from typing import List, Optional

from backend.engine.loader import is_scheme_stale
from backend.engine.operators import evaluate_operator
from backend.models.facts import ExtractedField, HouseholdFacts, Provenance
from backend.models.ledger import CriterionResult, SchemeEvaluation
from backend.models.scheme import CriterionStatus, SchemePack, SchemeVerdict


def evaluate_scheme(scheme: SchemePack, facts: HouseholdFacts) -> SchemeEvaluation:
    """Evaluates a single scheme pack against household facts deterministically.
    Pure Python. Zero external network calls. Zero LLM calls.
    Returns CriterionResult for every criterion and final SchemeVerdict.
    """
    criteria_results: List[CriterionResult] = []
    stale_flag = is_scheme_stale(scheme.last_verified, scheme.review_window_days)

    for rule in scheme.criteria:
        # Retrieve the relevant fact field
        fact_field: Optional[ExtractedField] = getattr(facts, rule.required_fact, None)

        if fact_field is None or fact_field.raw_value is None or fact_field.provenance == Provenance.UNKNOWN:
            criteria_results.append(
                CriterionResult(
                    rule_id=rule.rule_id,
                    label=rule.label,
                    status=CriterionStatus.UNKNOWN,
                    extracted_value=None,
                    provenance=Provenance.UNKNOWN,
                    verbatim_snippet=None,
                    proving_document=None,
                    source_clause=rule.source_clause,
                    source_url=rule.source_url,
                    remediation=rule.remediation or "Please provide information or documentation for this requirement.",
                    explanation=f"Required fact '{rule.required_fact}' is missing or unverified.",
                )
            )
            continue

        raw_val = fact_field.raw_value
        prov = fact_field.provenance
        snippet = fact_field.verbatim_snippet
        proving_doc = fact_field.source_image_id

        # Check predicate satisfaction
        passes_predicate = evaluate_operator(rule.predicate.operator, raw_val, rule.predicate.value)

        if not passes_predicate:
            criteria_results.append(
                CriterionResult(
                    rule_id=rule.rule_id,
                    label=rule.label,
                    status=CriterionStatus.FAIL,
                    extracted_value=raw_val,
                    provenance=prov,
                    verbatim_snippet=snippet,
                    proving_document=proving_doc,
                    source_clause=rule.source_clause,
                    source_url=rule.source_url,
                    remediation=rule.remediation,
                    explanation=f"Extracted value '{raw_val}' does not meet the eligibility condition ({rule.predicate.operator} {rule.predicate.value}).",
                )
            )
            continue

        # Predicate passed: now check proof requirements
        requires_doc_proof = rule.accepted_proof and "self_declaration" not in [p.lower() for p in rule.accepted_proof]
        has_doc_proof = (prov == Provenance.DOCUMENT_PROVEN)

        if requires_doc_proof and not has_doc_proof:
            criteria_results.append(
                CriterionResult(
                    rule_id=rule.rule_id,
                    label=rule.label,
                    status=CriterionStatus.MISSING_PROOF,
                    extracted_value=raw_val,
                    provenance=prov,
                    verbatim_snippet=snippet,
                    proving_document=proving_doc,
                    source_clause=rule.source_clause,
                    source_url=rule.source_url,
                    remediation=rule.remediation or f"Upload supporting proof: {', '.join(rule.accepted_proof)}.",
                    explanation=f"Self-declared value '{raw_val}' requires documentary proof ({', '.join(rule.accepted_proof)}).",
                )
            )
            continue

        # If scheme rule is stale, it cannot result in PASS
        if stale_flag:
            criteria_results.append(
                CriterionResult(
                    rule_id=rule.rule_id,
                    label=rule.label,
                    status=CriterionStatus.STALE,
                    extracted_value=raw_val,
                    provenance=prov,
                    verbatim_snippet=snippet,
                    proving_document=proving_doc,
                    source_clause=rule.source_clause,
                    source_url=rule.source_url,
                    remediation="Official scheme rules are past review window and pending administrator verification.",
                    explanation="Rule verification is stale. Official government guidelines must be re-validated.",
                )
            )
            continue

        # Criterion PASSED
        criteria_results.append(
            CriterionResult(
                rule_id=rule.rule_id,
                label=rule.label,
                status=CriterionStatus.PASS,
                extracted_value=raw_val,
                provenance=prov,
                verbatim_snippet=snippet,
                proving_document=proving_doc,
                source_clause=rule.source_clause,
                source_url=rule.source_url,
                remediation=None,
                explanation=f"Criterion verified and satisfied with value: {raw_val}.",
            )
        )

    # Determine missing required documents
    uploaded_docs = set(facts.uploaded_document_types)
    missing_docs = [
        doc_req for doc_req in scheme.required_documents
        if doc_req not in uploaded_docs
    ]

    # Calculate overall scheme verdict according to PRD section 14.3
    # any rule FAIL -> NOT_ELIGIBLE
    # otherwise if all required rules PASS -> ELIGIBLE
    # otherwise -> INCOMPLETE
    statuses = [cr.status for cr in criteria_results]
    if any(s == CriterionStatus.FAIL for s in statuses):
        verdict = SchemeVerdict.NOT_ELIGIBLE
    elif all(s == CriterionStatus.PASS for s in statuses) and not missing_docs:
        verdict = SchemeVerdict.ELIGIBLE
    else:
        verdict = SchemeVerdict.INCOMPLETE

    return SchemeEvaluation(
        scheme_id=scheme.scheme_id,
        scheme_name=scheme.scheme_name,
        authority=scheme.authority,
        benefit=scheme.benefit,
        version=scheme.version,
        source_url=scheme.source_url,
        last_verified=scheme.last_verified,
        verdict=verdict,
        criteria_results=criteria_results,
        missing_documents=missing_docs,
        application=scheme.application,
    )
