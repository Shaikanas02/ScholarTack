import json
import time
from datetime import date, datetime
from typing import Any, Dict, List, Optional

from fastapi import APIRouter, File, Form, HTTPException, Request, Response, UploadFile

from backend.engine.evaluator import evaluate_scheme
from backend.engine.loader import load_scheme_packs
from backend.extraction.extractor import extract_documents_batched, extract_narrative_facts
from backend.merge.merger import merge_facts
from backend.models.facts import HouseholdFacts
from backend.models.ledger import AnalysisResponse, SchemeEvaluation
from backend.models.scheme import SchemePack, SchemeVerdict
from backend.pdf.generator import (
    generate_application_pdf,
    generate_printable_ledger_pdf,
    generate_student_report_pdf,
)
from backend.security.validator import sanitize_narrative, validate_uploaded_files

router = APIRouter()

# In-memory scheme packs loaded at module init
SCHEME_PACKS: Dict[str, SchemePack] = load_scheme_packs()


@router.get("/healthz")
async def healthz():
    """Health check endpoint. < 50ms, zero external dependencies."""
    return {
        "status": "ok",
        "version": "2.0",
        "packs_loaded": len(SCHEME_PACKS),
    }


@router.get("/api/schemes")
async def get_schemes():
    """Returns list of loaded scheme packs and metadata."""
    return [
        {
            "id": p.scheme_id,
            "name": p.scheme_name,
            "authority": p.authority,
            "benefit": p.benefit,
            "version": p.version,
            "last_verified": p.last_verified,
            "required_documents": p.required_documents,
            "criteria_count": len(p.criteria),
        }
        for p in SCHEME_PACKS.values()
    ]


SCHOLARSHIP_IDS = {
    "nsp_ug_merit",
    "aicte_pragati_ug",
    "aicte_saksham",
    "aicte_swanath",
    "ssp_post_matric_ug",
    "post_matric_sc",
    "post_matric_st",
    "inspire_she",
    "begum_hazrat_mahal",
    "ugc_ishan_uday",
    "ugc_single_girl_child",
    "pm_yasasvi_top_class",
    "top_class_sc",
    "top_class_pwd",
    "post_matric_disabilities",
    "ugc_pg_studies",
    "national_fellowship_st",
}

SCHOLARSHIP_UPDATES = [
    {
        "id": "upd-1",
        "title": "National Scholarship Portal (NSP) AY 2026-27 Registrations Live",
        "summary": "One-Time Registration (OTR) is mandatory for Central Sector & Post-Matric schemes. Biometric authentication enabled across colleges.",
        "tag": "PORTAL OPEN",
        "urgency": "high",
        "date": "2026-09-15",
        "source_url": "https://scholarships.gov.in/",
    },
    {
        "id": "upd-2",
        "title": "AICTE Pragati for Girls: Verification Window Closing Soon",
        "summary": "First-year technical degree students must submit institution endorsements before September 30, 2026.",
        "tag": "DEADLINE ALERT",
        "urgency": "urgent",
        "date": "2026-09-14",
        "source_url": "https://scholarships.gov.in/",
    },
    {
        "id": "upd-3",
        "title": "DST INSPIRE-SHE 2026 Guidelines Announced",
        "summary": "Top 1% Class 12 board cut-offs released for Natural Science entrants. ₹80,000/yr fellowship with DBT linking.",
        "tag": "NEW RELEASE",
        "urgency": "medium",
        "date": "2026-09-10",
        "source_url": "https://online-inspire.gov.in/",
    },
    {
        "id": "upd-4",
        "title": "Mandatory NPCI Aadhaar-Seeding for Direct DBT Transfers",
        "summary": "Students must check active NPCI mapper status for bank account to prevent disbursal rejection.",
        "tag": "COMPLIANCE",
        "urgency": "medium",
        "date": "2026-09-08",
        "source_url": "https://myaadhaar.uidai.gov.in/",
    },
    {
        "id": "upd-5",
        "title": "State Scholarship Portal (SSP) Post-Matric e-Attestation Active",
        "summary": "Hostel stay and college fee receipt e-Attestation can now be done via designated college nodal officers.",
        "tag": "STATE PORTAL",
        "urgency": "normal",
        "date": "2026-09-05",
        "source_url": "https://ssp.postmatric.karnataka.gov.in/",
    },
]

STUDENT_NOTIFICATIONS = [
    {
        "id": "notif-1",
        "title": "AICTE Pragati Application Deadline Approaching",
        "message": "Only 13 days left to submit the AICTE Pragati application for female engineering students (Deadline: Sept 30, 2026).",
        "type": "deadline",
        "urgency": "urgent",
        "timestamp": "2 hours ago",
        "scholarship_id": "aicte_pragati_ug",
        "is_read": False,
    },
    {
        "id": "notif-2",
        "title": "New Scheme Available: DST INSPIRE SHE",
        "message": "INSPIRE Scholarship for Higher Education (₹80,000/yr) is now available for Basic Science undergraduates.",
        "type": "update",
        "urgency": "normal",
        "timestamp": "1 day ago",
        "scholarship_id": "inspire_she",
        "is_read": False,
    },
    {
        "id": "notif-3",
        "title": "Class 12 Marksheet Verification Required",
        "message": "Ensure your Class 12 board marksheet aggregate is verified for NSP UG Merit consideration (>= 75%).",
        "type": "alert",
        "urgency": "medium",
        "timestamp": "3 days ago",
        "scholarship_id": "nsp_ug_merit",
        "is_read": True,
    },
    {
        "id": "notif-4",
        "title": "Aadhaar Bank Seeding Reminder",
        "message": "All approved scholarships disburse strictly through Aadhaar-seeded NPCI bank accounts.",
        "type": "status",
        "urgency": "normal",
        "timestamp": "5 days ago",
        "scholarship_id": "ssp_post_matric_ug",
        "is_read": True,
    },
]


def _calc_days_left(deadline_str: Optional[str]) -> Optional[int]:
    if not deadline_str:
        return None
    try:
        dl_date = datetime.strptime(deadline_str, "%Y-%m-%d").date()
        today = date.today()
        return (dl_date - today).days
    except Exception:
        return None


@router.get("/api/scholarships")
async def get_scholarships(
    category: Optional[str] = None,
    level: Optional[str] = None,
    q: Optional[str] = None,
):
    """Returns list of student scholarships with real-time deadlines and criteria summaries."""
    results = []
    for p in SCHEME_PACKS.values():
        # Only return student scholarship schemes
        if p.scheme_id not in SCHOLARSHIP_IDS and p.category == "General":
            continue

        days_left = _calc_days_left(p.deadline)

        # Filters
        if category and category.lower() != "all" and p.category and category.lower() not in p.category.lower():
            continue
        if level and level.lower() != "all" and p.education_level and level.lower() not in p.education_level.lower():
            continue
        if q:
            query = q.lower()
            matches = (
                query in p.scheme_name.lower()
                or query in (p.authority or "").lower()
                or query in (p.benefit or "").lower()
                or query in (p.category or "").lower()
            )
            if not matches:
                continue

        results.append(
            {
                "id": p.scheme_id,
                "name": p.scheme_name,
                "authority": p.authority,
                "benefit": p.benefit,
                "award_amount": p.award_amount or p.benefit,
                "category": p.category or "General",
                "education_level": p.education_level or "Higher Education",
                "deadline": p.deadline,
                "days_left": days_left,
                "source_url": p.source_url,
                "required_documents": p.required_documents,
                "criteria_count": len(p.criteria),
                "is_featured": bool(p.is_featured),
                "application_status": p.application_status or "Open",
                "criteria_preview": [c.label for c in p.criteria],
            }
        )

    # Sort: closing soonest first (lowest days_left > 0), then others
    def sort_key(item):
        dl = item["days_left"]
        if dl is not None and dl >= 0:
            return (0, dl)
        return (1, 9999)

    results.sort(key=sort_key)
    return results


@router.get("/api/scholarships/updates")
async def get_scholarship_updates():
    """Returns real-time updates and statutory announcements feed."""
    return SCHOLARSHIP_UPDATES


@router.get("/api/scholarships/notifications")
async def get_student_notifications():
    """Returns actionable notifications and deadline reminders."""
    return STUDENT_NOTIFICATIONS


@router.post("/api/scholarships/recommend")
async def recommend_scholarships(profile: Dict[str, Any]):
    """Deterministically evaluates student profile against all scholarship packs to produce
    personalized recommendations with match scores and actionable explanations.
    """
    from backend.models.facts import ExtractedField, HouseholdFacts, Provenance

    # Construct HouseholdFacts from profile attributes
    facts = HouseholdFacts(
        applicant_name=ExtractedField(
            fact_key="applicant_name",
            raw_value=profile.get("name") or profile.get("applicant_name", "Student"),
            provenance=Provenance.SELF_DECLARED,
        ) if profile.get("name") or profile.get("applicant_name") else None,
        applicant_age=ExtractedField(
            fact_key="applicant_age",
            raw_value=profile.get("age") or profile.get("applicant_age", 18),
            provenance=Provenance.SELF_DECLARED,
        ) if profile.get("age") or profile.get("applicant_age") else None,
        gender=ExtractedField(
            fact_key="gender",
            raw_value=profile.get("gender", "any"),
            provenance=Provenance.SELF_DECLARED,
        ) if profile.get("gender") else None,
        social_category=ExtractedField(
            fact_key="social_category",
            raw_value=profile.get("social_category", "General"),
            provenance=Provenance.SELF_DECLARED,
        ) if profile.get("social_category") else None,
        annual_family_income=ExtractedField(
            fact_key="annual_family_income",
            raw_value=float(profile.get("annual_family_income", 250000.0)),
            provenance=Provenance.SELF_DECLARED,
        ) if profile.get("annual_family_income") is not None else None,
        is_ug_student=ExtractedField(
            fact_key="is_ug_student",
            raw_value=bool(profile.get("is_ug_student", True)),
            provenance=Provenance.SELF_DECLARED,
        ) if profile.get("is_ug_student") is not None else None,
        is_post_matric_student=ExtractedField(
            fact_key="is_post_matric_student",
            raw_value=bool(profile.get("is_post_matric_student", True)),
            provenance=Provenance.SELF_DECLARED,
        ) if profile.get("is_post_matric_student") is not None else None,
        academic_percentage=ExtractedField(
            fact_key="academic_percentage",
            raw_value=float(profile.get("academic_percentage", 75.0)),
            provenance=Provenance.SELF_DECLARED,
        ) if profile.get("academic_percentage") is not None else None,
        is_availing_other_scholarship=ExtractedField(
            fact_key="is_availing_other_scholarship",
            raw_value=bool(profile.get("is_availing_other_scholarship", False)),
            provenance=Provenance.SELF_DECLARED,
        ) if profile.get("is_availing_other_scholarship") is not None else None,
        aadhaar_present=ExtractedField(
            fact_key="aadhaar_present",
            raw_value=bool(profile.get("aadhaar_present", True)),
            provenance=Provenance.SELF_DECLARED,
        ) if profile.get("aadhaar_present") is not None else None,
        bank_account_present=ExtractedField(
            fact_key="bank_account_present",
            raw_value=bool(profile.get("bank_account_present", True)),
            provenance=Provenance.SELF_DECLARED,
        ) if profile.get("bank_account_present") is not None else None,
        disability_status=ExtractedField(
            fact_key="disability_status",
            raw_value=profile.get("disability_status", False),
            provenance=Provenance.SELF_DECLARED,
        ) if profile.get("disability_status") is not None else None,
        is_single_girl_child=ExtractedField(
            fact_key="is_single_girl_child",
            raw_value=bool(profile.get("is_single_girl_child", False)),
            provenance=Provenance.SELF_DECLARED,
        ) if profile.get("is_single_girl_child") is not None else None,
        is_orphan_or_ward_of_defense=ExtractedField(
            fact_key="is_orphan_or_ward_of_defense",
            raw_value=bool(profile.get("is_orphan_or_ward_of_defense", False)),
            provenance=Provenance.SELF_DECLARED,
        ) if profile.get("is_orphan_or_ward_of_defense") is not None else None,
        is_ner_domicile=ExtractedField(
            fact_key="is_ner_domicile",
            raw_value=bool(
                profile.get("is_ner_domicile")
                or (profile.get("domicile_state") in ["Assam", "Arunachal Pradesh", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Sikkim", "Tripura"])
            ),
            provenance=Provenance.SELF_DECLARED,
        ),
        domicile_state=ExtractedField(
            fact_key="domicile_state",
            raw_value=profile.get("domicile_state", "All-India"),
            provenance=Provenance.SELF_DECLARED,
        ) if profile.get("domicile_state") else None,
        uploaded_document_types=profile.get("uploaded_document_types", []),
    )

    recommendations = []
    for pid in SCHOLARSHIP_IDS:
        if pid not in SCHEME_PACKS:
            continue
        pack = SCHEME_PACKS[pid]
        eval_result = evaluate_scheme(pack, facts)

        total_rules = len(eval_result.criteria_results)
        passed_rules = sum(1 for cr in eval_result.criteria_results if cr.status.value in ("PASS", "MISSING_PROOF"))
        failed_rules = sum(1 for cr in eval_result.criteria_results if cr.status.value == "FAIL")

        if failed_rules == 0:
            match_score = 100 if passed_rules == total_rules else 90
            match_tier = "High Match"
        elif passed_rules > 0:
            match_score = max(20, round((passed_rules / max(total_rules, 1)) * 80))
            match_tier = "Partial Match"
        else:
            match_score = 10
            match_tier = "Low Match"

        recommendations.append(
            {
                "scheme_id": pack.scheme_id,
                "scheme_name": pack.scheme_name,
                "authority": pack.authority,
                "award_amount": pack.award_amount or pack.benefit,
                "category": pack.category or "General",
                "education_level": pack.education_level or "Higher Education",
                "deadline": pack.deadline,
                "days_left": _calc_days_left(pack.deadline),
                "source_url": pack.source_url,
                "required_documents": pack.required_documents,
                "is_featured": bool(pack.is_featured),
                "match_score": match_score,
                "match_tier": match_tier,
                "verdict": eval_result.verdict.value,
                "satisfied_criteria": [cr.label for cr in eval_result.criteria_results if cr.status.value in ("PASS", "MISSING_PROOF")],
                "blocking_reasons": [cr.explanation for cr in eval_result.criteria_results if cr.status.value == "FAIL"],
                "missing_documents": eval_result.missing_documents,
            }
        )

    # Sort descending by match_score
    recommendations.sort(key=lambda r: r["match_score"], reverse=True)
    return recommendations


@router.post("/api/analyze", response_model=AnalysisResponse)
async def analyze_household(
    request: Request,
    narrative: Optional[str] = Form(default=""),
    conflict_resolutions: Optional[str] = Form(default="{}"),
    files: Optional[List[UploadFile]] = File(default=None),
):
    """Core analysis endpoint supporting both multipart/form-data and application/json.
    1. Sanitizes narrative
    2. Validates files
    3. Multimodal extraction
    4. Deterministic fact merge & conflict preservation
    5. Pure Python rule engine evaluation
    """
    start_time = time.perf_counter()

    content_type = request.headers.get("content-type", "")
    parsed_resolutions: Dict[str, Any] = {}
    clean_narrative = ""
    validated_files = []

    # Handle application/json programmatic requests
    if "application/json" in content_type:
        body = await request.json()
        raw_narrative = body.get("narrative", "")
        parsed_resolutions = body.get("conflict_resolutions", {})
        clean_narrative = sanitize_narrative(raw_narrative)
        doc_meta = body.get("document_metadata", [])
        if doc_meta:
            validated_files = [
                (d.get("document_name", f"doc_{i}.jpg"), b"", "image/jpeg")
                for i, d in enumerate(doc_meta)
            ]
    else:
        # Handle multipart/form-data
        if conflict_resolutions:
            try:
                parsed_resolutions = json.loads(conflict_resolutions)
            except Exception:
                parsed_resolutions = {}

        clean_narrative = sanitize_narrative(narrative or "")

        if files:
            validated_files = await validate_uploaded_files(files)

    # 3. Multimodal Extraction
    narrative_facts = extract_narrative_facts(clean_narrative) if clean_narrative else {}
    doc_evidences = extract_documents_batched(validated_files) if validated_files else []

    # 4. Deterministic Merge & Conflict Preservation
    merged_facts = merge_facts(
        narrative_facts=narrative_facts,
        documents=doc_evidences,
        conflict_resolutions=parsed_resolutions,
        raw_narrative=clean_narrative,
    )

    # 5. Deterministic Scheme Evaluation
    evaluations: List[SchemeEvaluation] = []
    for pack in SCHEME_PACKS.values():
        eval_result = evaluate_scheme(pack, merged_facts)
        evaluations.append(eval_result)

    # Sort evaluations: ELIGIBLE first, then INCOMPLETE, then NOT_ELIGIBLE
    verdict_rank = {
        SchemeVerdict.ELIGIBLE: 0,
        SchemeVerdict.INCOMPLETE: 1,
        SchemeVerdict.NOT_ELIGIBLE: 2,
    }
    evaluations.sort(key=lambda e: verdict_rank.get(e.verdict, 3))

    eligible_count = sum(1 for e in evaluations if e.verdict == SchemeVerdict.ELIGIBLE)
    incomplete_count = sum(1 for e in evaluations if e.verdict == SchemeVerdict.INCOMPLETE)
    not_eligible_count = sum(1 for e in evaluations if e.verdict == SchemeVerdict.NOT_ELIGIBLE)

    elapsed_ms = (time.perf_counter() - start_time) * 1000.0

    return AnalysisResponse(
        household_facts=merged_facts,
        schemes_evaluated=evaluations,
        eligible_count=eligible_count,
        incomplete_count=incomplete_count,
        not_eligible_count=not_eligible_count,
        execution_time_ms=round(elapsed_ms, 2),
    )


@router.post("/api/application/{scheme_id}/pdf")
async def get_application_pdf(scheme_id: str, facts: HouseholdFacts):
    """Generates official pre-filled application PDF for a scheme."""
    if scheme_id not in SCHEME_PACKS:
        raise HTTPException(status_code=404, detail=f"Scheme '{scheme_id}' not found.")

    scheme = SCHEME_PACKS[scheme_id]
    pdf_bytes = generate_application_pdf(scheme, facts)

    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={
            "Content-Disposition": f"attachment; filename=ScholarTack_{scheme_id}_Application.pdf"
        },
    )


@router.post("/api/application/{scheme_id}/ledger-pdf")
async def get_ledger_pdf(scheme_id: str, facts: HouseholdFacts):
    """Generates printable 1-page Proof Ledger PDF."""
    if scheme_id not in SCHEME_PACKS:
        raise HTTPException(status_code=404, detail=f"Scheme '{scheme_id}' not found.")

    scheme = SCHEME_PACKS[scheme_id]
    pdf_bytes = generate_printable_ledger_pdf(scheme, facts)

    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={
            "Content-Disposition": f"attachment; filename=ScholarTack_{scheme_id}_ProofLedger.pdf"
        },
    )


@router.post("/api/student/report-pdf")
async def get_student_report_pdf_endpoint(payload: Dict[str, Any]):
    """Generates an institutional A4 printable ScholarTack Scholarship Eligibility & Status Report."""
    student_data = payload.get("student", {})
    eligible_scholarships = payload.get("eligible_scholarships", [])
    tracked_apps = payload.get("tracked_applications", [])
    doc_checklist = payload.get("document_checklist", [])

    pdf_bytes = generate_student_report_pdf(
        student=student_data,
        eligible_scholarships=eligible_scholarships,
        tracked_apps=tracked_apps,
        doc_checklist=doc_checklist,
    )

    student_name = student_data.get("applicant_name") or student_data.get("name") or "Student"
    safe_name = "".join(c for c in student_name if c.isalnum() or c in ("-", "_")).strip() or "Student"

    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={
            "Content-Disposition": f"attachment; filename=ScholarTack_{safe_name}_Eligibility_Report.pdf"
        },
    )
