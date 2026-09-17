from typing import Any, List, Optional
from pydantic import BaseModel, Field


class RawNarrativeExtraction(BaseModel):
    applicant_name: Optional[str] = Field(default=None, description="Name of the applicant or household head if mentioned")
    applicant_age: Optional[int] = Field(default=None, description="Age in completed years")
    gender: Optional[str] = Field(default=None, description="male, female, or other")
    social_category: Optional[str] = Field(default=None, description="SC, ST, OBC, General, etc.")
    household_size: Optional[int] = Field(default=None, description="Total number of members living in household")
    annual_family_income: Optional[float] = Field(default=None, description="Total annual household income in Indian Rupees (₹)")
    rural_urban_status: Optional[str] = Field(default=None, description="rural or urban")
    housing_condition: Optional[str] = Field(default=None, description="kutcha, semi-pucca, pucca, or houseless")
    disability_status: Optional[bool] = Field(default=None, description="True if any household member has certified disability >= 40%")
    land_holding_acres: Optional[float] = Field(default=None, description="Cultivable agricultural landholding in acres")
    is_institutional_landholder: Optional[bool] = Field(default=None, description="True if land is institutional/corporate, False if individual/family")
    is_income_tax_payer: Optional[bool] = Field(default=None, description="True if anyone pays income tax, False otherwise")
    has_bpl_or_secc_eligibility: Optional[bool] = Field(default=None, description="True if mentioned as BPL, Antyodaya, or SECC deprived")
    has_lpg_connection: Optional[bool] = Field(default=None, description="True if household already has an active LPG connection")
    is_post_matric_student: Optional[bool] = Field(default=None, description="True if a household member is studying in class 11, 12, or college")
    is_ug_student: Optional[bool] = Field(default=None, description="True if student is pursuing regular undergraduate degree like BA, BSc, BCom, BTech, MBBS, BCA, BBA, Diploma")
    academic_percentage: Optional[float] = Field(default=None, description="Marks percentage in 12th/qualifying examination, e.g. 78.5, 82.0")
    is_availing_other_scholarship: Optional[bool] = Field(default=None, description="True if student is already receiving another government scholarship")
    aadhaar_present: Optional[bool] = Field(default=None, description="True if Aadhaar is mentioned or possessed")
    bank_account_present: Optional[bool] = Field(default=None, description="True if bank account details or DBT is mentioned")


class RawDocumentField(BaseModel):
    fact_key: str = Field(description="Normalized key, e.g., annual_family_income, land_holding_acres, social_category, applicant_age, applicant_name, gender, aadhaar_present, has_bpl_or_secc_eligibility, housing_condition")
    raw_value: Any = Field(description="Parsed value, e.g., 180000, 2.5, 'SC', 62, 'Ramesh Kumar', 'female', 'kutcha', True")
    verbatim_snippet: Optional[str] = Field(default=None, description="Verbatim text from the document image proving this value")
    confidence: float = Field(ge=0.0, le=1.0, description="Extraction confidence score from 0.0 to 1.0")


class RawDocumentExtraction(BaseModel):
    detected_type: str = Field(description="Document type: land_ownership_record, aadhaar_card, income_certificate, caste_certificate, ration_card, marksheet_or_admission_receipt, bpl_card, bank_passbook, or unknown")
    document_name: str = Field(description="Descriptive name of the document")
    confidence: float = Field(ge=0.0, le=1.0, description="Confidence in document classification")
    retake_hint: Optional[str] = Field(default=None, description="Instructions to claimant if image is blurry, cropped, or unreadable")
    fields: List[RawDocumentField] = Field(default_factory=list, description="Fields extracted from this document")


class RawBatchDocumentResponse(BaseModel):
    documents: List[RawDocumentExtraction] = Field(default_factory=list)
