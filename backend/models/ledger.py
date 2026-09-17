from typing import Any, List, Optional
from pydantic import BaseModel, Field

from backend.models.facts import HouseholdFacts, Provenance
from backend.models.scheme import ApplicationInfo, CriterionStatus, SchemeVerdict


class CriterionResult(BaseModel):
    rule_id: str
    label: str
    status: CriterionStatus
    extracted_value: Any = None
    provenance: Provenance = Provenance.UNKNOWN
    verbatim_snippet: Optional[str] = None
    proving_document: Optional[str] = None
    source_clause: str
    source_url: str
    remediation: Optional[str] = None
    explanation: str


class SchemeEvaluation(BaseModel):
    scheme_id: str
    scheme_name: str
    authority: str
    benefit: str
    version: str = "v1.0"
    source_url: str = ""
    last_verified: str = ""
    verdict: SchemeVerdict
    criteria_results: List[CriterionResult]
    missing_documents: List[str] = Field(default_factory=list)
    application: ApplicationInfo


class AnalysisResponse(BaseModel):
    household_facts: HouseholdFacts
    schemes_evaluated: List[SchemeEvaluation]
    eligible_count: int
    incomplete_count: int
    not_eligible_count: int
    execution_time_ms: float
