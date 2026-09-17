export type Provenance = 'DOCUMENT_PROVEN' | 'SELF_DECLARED' | 'DERIVED' | 'UNKNOWN';

export type CriterionStatus = 'PASS' | 'FAIL' | 'MISSING_PROOF' | 'UNKNOWN' | 'STALE';

export type SchemeVerdict = 'ELIGIBLE' | 'INCOMPLETE' | 'NOT_ELIGIBLE';

export interface ExtractedField {
  fact_key: string;
  raw_value: any;
  verbatim_snippet?: string;
  confidence: number;
  source_image_id?: string;
  provenance: Provenance;
}

export interface ConflictItem {
  field: string;
  label: string;
  narrative_value: any;
  document_value: any;
  document_type: string;
  verbatim_snippet?: string;
  source_image_id?: string;
  resolved_value?: any;
}

export interface DocumentEvidence {
  document_id: string;
  document_name: string;
  detected_type: string;
  confidence: number;
  retake_hint?: string;
  extracted_fields: ExtractedField[];
}

export interface HouseholdFacts {
  applicant_name?: ExtractedField;
  applicant_age?: ExtractedField;
  social_category?: ExtractedField;
  annual_family_income?: ExtractedField;
  land_holding_acres?: ExtractedField;
  is_institutional_landholder?: ExtractedField;
  is_income_tax_payer?: ExtractedField;
  has_bpl_or_secc_eligibility?: ExtractedField;
  is_post_matric_student?: ExtractedField;
  is_ug_student?: ExtractedField;
  academic_percentage?: ExtractedField;
  is_availing_other_scholarship?: ExtractedField;
  aadhaar_present?: ExtractedField;
  bank_account_present?: ExtractedField;
  raw_narrative?: string;
  uploaded_document_types: string[];
  conflicts: ConflictItem[];
  documents: DocumentEvidence[];
}

export interface CriterionResult {
  rule_id: string;
  label: string;
  status: CriterionStatus;
  extracted_value?: any;
  provenance: Provenance;
  verbatim_snippet?: string;
  proving_document?: string;
  source_clause: string;
  source_url: string;
  remediation?: string;
  explanation: string;
}

export interface ApplicationInfo {
  portal_name: string;
  portal_url: string;
  office_name: string;
  documents_to_carry: string[];
  process_steps: string[];
}

export interface SchemeEvaluation {
  scheme_id: string;
  scheme_name: string;
  authority: string;
  benefit: string;
  version: string;
  source_url: string;
  last_verified: string;
  verdict: SchemeVerdict;
  criteria_results: CriterionResult[];
  missing_documents: string[];
  application: ApplicationInfo;
}

export interface AnalysisResponse {
  household_facts: HouseholdFacts;
  schemes_evaluated: SchemeEvaluation[];
  eligible_count: number;
  incomplete_count: number;
  not_eligible_count: number;
  execution_time_ms: number;
}

export interface ScholarshipItem {
  id: string;
  name: string;
  authority: string;
  benefit: string;
  award_amount: string;
  category: string;
  education_level: string;
  deadline?: string;
  days_left?: number | null;
  source_url: string;
  required_documents: string[];
  criteria_count: number;
  is_featured: boolean;
  application_status: string;
  criteria_preview: string[];
}

export interface ScholarshipUpdate {
  id: string;
  title: string;
  summary: string;
  tag: string;
  urgency: 'urgent' | 'high' | 'medium' | 'normal';
  date: string;
  source_url: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'deadline' | 'update' | 'alert' | 'status';
  urgency: 'urgent' | 'high' | 'medium' | 'normal';
  timestamp: string;
  scholarship_id?: string;
  is_read: boolean;
}

export interface StudentProfile {
  id?: string;
  applicant_name: string;
  applicant_age: number;
  gender: string;
  social_category: string;
  annual_family_income: number;
  is_ug_student: boolean;
  is_post_matric_student: boolean;
  academic_percentage: number;
  is_availing_other_scholarship: boolean;
  aadhaar_present: boolean;
  bank_account_present: boolean;
  student_id?: string;
  course_name?: string;
  branch?: string;
  institution_name?: string;
  year_of_study?: string;
  semester?: string;
  academic_year?: string;
  cgpa?: number | string;
  previous_academic_performance?: string;
  domicile_state?: string;
  district?: string;
  date_of_birth?: string;
  phone?: string;
  email?: string;
  disability_status?: boolean;
  is_single_girl_child?: boolean;
  is_orphan_or_ward_of_defense?: boolean;
  is_ner_domicile?: boolean;
  relevant_scholarship_category?: string;
  scholarship_interests?: string;
  previous_scholarship_details?: string;
  income_certificate_status?: string;
  caste_certificate_status?: string;
  bonafide_certificate_status?: string;
  marks_card_status?: string;
  other_documents_status?: string;
  is_demo?: boolean;
  last_used?: string;
  created_at?: string;
}

export interface ScholarshipRecommendation {
  scheme_id: string;
  scheme_name: string;
  authority: string;
  award_amount: string;
  category: string;
  education_level?: string;
  deadline?: string;
  days_left?: number | null;
  source_url?: string;
  required_documents?: string[];
  is_featured?: boolean;
  match_score: number;
  match_tier: string;
  verdict: SchemeVerdict;
  satisfied_criteria: string[];
  blocking_reasons: string[];
  missing_documents: string[];
}

export type ApplicationTrackingStatus =
  | 'saved'
  | 'preparing_docs'
  | 'submitted'
  | 'under_review'
  | 'approved'
  | 'disbursed'
  | 'awarded';

export interface TrackedApplication {
  scheme_id: string;
  scheme_name: string;
  award_amount: string;
  portal_url: string;
  status: ApplicationTrackingStatus;
  application_number?: string;
  applied_date?: string;
  notes?: string;
  deadline?: string;
}

export type DocumentReadinessStatus = 'required' | 'uploaded' | 'pending' | 'verified';

export interface DocumentChecklistItem {
  id: string;
  name: string;
  category: string;
  status: DocumentReadinessStatus;
  description: string;
  issuing_authority: string;
  required_by: string;
  tips: string;
  file_name?: string;
  uploaded_at?: string;
}

export interface StudentReportPayload {
  student: StudentProfile;
  eligible_scholarships: any[];
  tracked_applications: TrackedApplication[];
  document_checklist: DocumentChecklistItem[];
}

