from enum import Enum
from typing import Any, List, Optional
from pydantic import BaseModel, Field


class Provenance(str, Enum):
    DOCUMENT_PROVEN = "DOCUMENT_PROVEN"
    SELF_DECLARED = "SELF_DECLARED"
    DERIVED = "DERIVED"
    UNKNOWN = "UNKNOWN"


class ExtractedField(BaseModel):
    fact_key: str
    raw_value: Any = None
    verbatim_snippet: Optional[str] = None
    confidence: float = 1.0
    source_image_id: Optional[str] = None
    provenance: Provenance = Provenance.UNKNOWN


class MemberFact(BaseModel):
    name: Optional[str] = None
    relation: Optional[str] = None
    age: Optional[int] = None
    gender: Optional[str] = None
    occupation: Optional[str] = None
    is_student: Optional[bool] = None
    student_grade: Optional[str] = None
    individual_income: Optional[float] = None


class ConflictItem(BaseModel):
    field: str
    label: str
    narrative_value: Any
    document_value: Any
    document_type: str
    verbatim_snippet: Optional[str] = None
    source_image_id: Optional[str] = None
    resolved_value: Optional[Any] = None


class DocumentEvidence(BaseModel):
    document_id: str
    document_name: str
    detected_type: str
    confidence: float
    retake_hint: Optional[str] = None
    extracted_fields: List[ExtractedField] = Field(default_factory=list)


class HouseholdFacts(BaseModel):
    applicant_name: Optional[ExtractedField] = None
    applicant_age: Optional[ExtractedField] = None
    gender: Optional[ExtractedField] = None
    social_category: Optional[ExtractedField] = None
    household_size: Optional[ExtractedField] = None
    annual_family_income: Optional[ExtractedField] = None
    rural_urban_status: Optional[ExtractedField] = None
    housing_condition: Optional[ExtractedField] = None
    disability_status: Optional[ExtractedField] = None
    land_holding_acres: Optional[ExtractedField] = None
    is_institutional_landholder: Optional[ExtractedField] = None
    is_income_tax_payer: Optional[ExtractedField] = None
    has_bpl_or_secc_eligibility: Optional[ExtractedField] = None
    has_lpg_connection: Optional[ExtractedField] = None
    is_post_matric_student: Optional[ExtractedField] = None
    is_ug_student: Optional[ExtractedField] = None
    academic_percentage: Optional[ExtractedField] = None
    is_availing_other_scholarship: Optional[ExtractedField] = None
    aadhaar_present: Optional[ExtractedField] = None
    bank_account_present: Optional[ExtractedField] = None
    is_single_girl_child: Optional[ExtractedField] = None
    is_orphan_or_ward_of_defense: Optional[ExtractedField] = None
    is_ner_domicile: Optional[ExtractedField] = None
    domicile_state: Optional[ExtractedField] = None
    members: List[MemberFact] = Field(default_factory=list)
    raw_narrative: Optional[str] = None
    uploaded_document_types: List[str] = Field(default_factory=list)
    conflicts: List[ConflictItem] = Field(default_factory=list)
    documents: List[DocumentEvidence] = Field(default_factory=list)
