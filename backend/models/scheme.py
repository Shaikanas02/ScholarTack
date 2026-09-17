from enum import Enum
from typing import Any, List, Optional
from pydantic import BaseModel, Field


class CriterionStatus(str, Enum):
    PASS = "PASS"
    FAIL = "FAIL"
    MISSING_PROOF = "MISSING_PROOF"
    UNKNOWN = "UNKNOWN"
    STALE = "STALE"


class SchemeVerdict(str, Enum):
    ELIGIBLE = "ELIGIBLE"
    INCOMPLETE = "INCOMPLETE"
    NOT_ELIGIBLE = "NOT_ELIGIBLE"


class Predicate(BaseModel):
    operator: str  # eq, neq, gt, gte, lt, lte, in, not_in, between, exists
    value: Any = None


class RuleDefinition(BaseModel):
    rule_id: str
    label: str
    plain_description: str
    required_fact: str
    predicate: Predicate
    accepted_proof: List[str] = Field(default_factory=list)
    source_clause: str
    source_url: str
    remediation: Optional[str] = None


class ApplicationInfo(BaseModel):
    portal_name: str
    portal_url: str
    office_name: str
    documents_to_carry: List[str] = Field(default_factory=list)
    process_steps: List[str] = Field(default_factory=list)


class SchemePack(BaseModel):
    scheme_id: str
    scheme_name: str
    authority: str
    jurisdiction: str
    benefit: str
    version: str
    source_url: str
    last_verified: str  # YYYY-MM-DD
    review_window_days: int = 180
    required_documents: List[str] = Field(default_factory=list)
    criteria: List[RuleDefinition]
    application: ApplicationInfo
    category: Optional[str] = "General"
    education_level: Optional[str] = "Higher Education"
    deadline: Optional[str] = None
    award_amount: Optional[str] = None
    is_featured: Optional[bool] = False
    application_status: Optional[str] = "Open"
