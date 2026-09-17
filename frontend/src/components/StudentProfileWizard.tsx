import React, { useState } from 'react';
import {
  User,
  GraduationCap,
  Users,
  FileCheck,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Check,
  ShieldCheck,
} from 'lucide-react';
import type { StudentProfile } from '../types';

export const DEMO_PERSONAS: {
  id: string;
  name: string;
  tag: string;
  badgeColor: string;
  profile: StudentProfile;
}[] = [
  {
    id: 'anas',
    name: 'Shaik Mohammed Anas',
    tag: 'B.E. Computer Science • Ghousia College Of Engineering',
    badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    profile: {
      id: 'demo-anas-1gc23cs138',
      applicant_name: 'Shaik Mohammed Anas',
      student_id: '1GC23CS138',
      applicant_age: 19,
      gender: 'male',
      social_category: 'General',
      annual_family_income: 220000,
      is_ug_student: true,
      is_post_matric_student: true,
      academic_percentage: 84.5,
      cgpa: '8.65',
      is_availing_other_scholarship: false,
      aadhaar_present: true,
      bank_account_present: true,
      course_name: 'B.E. Computer Science & Engineering',
      branch: 'Computer Science & Engineering',
      institution_name: 'Ghousia College Of Engineering',
      year_of_study: '2nd Year',
      semester: '4th Semester',
      academic_year: '2026-27',
      domicile_state: 'Karnataka',
      district: 'Ramanagara',
      date_of_birth: '2005-04-14',
      phone: '+91 98XXXXXX38',
      email: 'anas.1gc23cs138@demo.ghousia.ac.in',
      is_single_girl_child: false,
      disability_status: false,
      is_orphan_or_ward_of_defense: false,
      is_ner_domicile: false,
      relevant_scholarship_category: 'Central Sector (PM-USP) / State Merit',
      income_certificate_status: 'verified',
      bonafide_certificate_status: 'verified',
      marks_card_status: 'verified',
      is_demo: true,
    },
  },
  {
    id: 'shiyaz',
    name: 'Shiyaz Abdul Azeez',
    tag: 'Post-Matric Engineering • Ghousia College Of Engineering',
    badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    profile: {
      id: 'demo-shiyaz-1gc23cs144',
      applicant_name: 'Shiyaz Abdul Azeez',
      student_id: '1GC23CS144',
      applicant_age: 20,
      gender: 'male',
      social_category: 'SC',
      annual_family_income: 180000,
      is_ug_student: true,
      is_post_matric_student: true,
      academic_percentage: 76.0,
      cgpa: '7.80',
      is_availing_other_scholarship: false,
      aadhaar_present: true,
      bank_account_present: true,
      course_name: 'B.E. Computer Science & Engineering',
      branch: 'Computer Science & Engineering',
      institution_name: 'Ghousia College Of Engineering',
      year_of_study: '2nd Year',
      semester: '4th Semester',
      academic_year: '2026-27',
      domicile_state: 'Karnataka',
      district: 'Ramanagara',
      date_of_birth: '2004-08-22',
      phone: '+91 97XXXXXX44',
      email: 'shiyaz.1gc23cs144@demo.ghousia.ac.in',
      disability_status: false,
      is_single_girl_child: false,
      is_orphan_or_ward_of_defense: false,
      is_ner_domicile: false,
      relevant_scholarship_category: 'Post-Matric SC & SSP Karnataka',
      income_certificate_status: 'verified',
      caste_certificate_status: 'verified',
      bonafide_certificate_status: 'verified',
      marks_card_status: 'verified',
      is_demo: true,
    },
  },
  {
    id: 'saqib',
    name: 'Saqib Khan',
    tag: 'Differently-Abled Scholar (PwD) • Ghousia College Of Engineering',
    badgeColor: 'bg-teal-50 text-teal-700 border-teal-200',
    profile: {
      id: 'demo-saqib-1gc23cs134',
      applicant_name: 'Saqib Khan',
      student_id: '1GC23CS134',
      applicant_age: 19,
      gender: 'male',
      social_category: 'OBC',
      annual_family_income: 300000,
      is_ug_student: true,
      is_post_matric_student: true,
      academic_percentage: 82.0,
      cgpa: '8.40',
      is_availing_other_scholarship: false,
      aadhaar_present: true,
      bank_account_present: true,
      course_name: 'B.E. Computer Science & Engineering',
      branch: 'Computer Science & Engineering',
      institution_name: 'Ghousia College Of Engineering',
      year_of_study: '2nd Year',
      semester: '4th Semester',
      academic_year: '2026-27',
      domicile_state: 'Karnataka',
      district: 'Ramanagara',
      date_of_birth: '2005-01-18',
      phone: '+91 96XXXXXX34',
      email: 'saqib.1gc23cs134@demo.ghousia.ac.in',
      disability_status: true,
      is_single_girl_child: false,
      is_orphan_or_ward_of_defense: false,
      is_ner_domicile: false,
      relevant_scholarship_category: 'AICTE Saksham & Top Class PwD',
      income_certificate_status: 'verified',
      bonafide_certificate_status: 'verified',
      marks_card_status: 'verified',
      is_demo: true,
    },
  },
  {
    id: 'rumaiz',
    name: 'Mohammed Rumaiz',
    tag: 'Technical Degree Scholar • Ghousia College Of Engineering',
    badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    profile: {
      id: 'demo-rumaiz-1gc23cs083',
      applicant_name: 'Mohammed Rumaiz',
      student_id: '1GC23CS083',
      applicant_age: 20,
      gender: 'male',
      social_category: 'ST',
      annual_family_income: 240000,
      is_ug_student: true,
      is_post_matric_student: true,
      academic_percentage: 81.0,
      cgpa: '8.25',
      is_availing_other_scholarship: false,
      aadhaar_present: true,
      bank_account_present: true,
      course_name: 'B.E. Computer Science & Engineering',
      branch: 'Computer Science & Engineering',
      institution_name: 'Ghousia College Of Engineering',
      year_of_study: '2nd Year',
      semester: '4th Semester',
      academic_year: '2026-27',
      domicile_state: 'Karnataka',
      district: 'Ramanagara',
      date_of_birth: '2004-11-09',
      phone: '+91 95XXXXXX83',
      email: 'rumaiz.1gc23cs083@demo.ghousia.ac.in',
      is_ner_domicile: false,
      disability_status: false,
      is_single_girl_child: false,
      is_orphan_or_ward_of_defense: false,
      relevant_scholarship_category: 'Post-Matric ST & National Fellowship',
      income_certificate_status: 'verified',
      caste_certificate_status: 'verified',
      bonafide_certificate_status: 'verified',
      marks_card_status: 'verified',
      is_demo: true,
    },
  },
];

export const STUDENT_PERSONAS = DEMO_PERSONAS;

export function calculateProfileCompletion(p: StudentProfile | null | undefined): number {
  if (!p) return 0;
  let score = 0;
  if (p.applicant_name && p.applicant_name.length > 2) score += 15;
  if (p.applicant_age && p.applicant_age >= 15) score += 10;
  if (p.gender) score += 10;
  if (p.social_category) score += 10;
  if (p.course_name) score += 15;
  if (p.academic_percentage && p.academic_percentage > 0) score += 15;
  if (p.annual_family_income !== undefined && p.annual_family_income > 0) score += 15;
  if (p.aadhaar_present && p.bank_account_present) score += 10;
  return Math.min(100, score);
}

const EMPTY_PROFILE: StudentProfile = {
  applicant_name: '',
  student_id: '',
  applicant_age: 19,
  gender: 'male',
  social_category: 'General',
  annual_family_income: 250000,
  is_ug_student: true,
  is_post_matric_student: true,
  academic_percentage: 75.0,
  is_availing_other_scholarship: false,
  aadhaar_present: true,
  bank_account_present: true,
  course_name: '',
  branch: '',
  institution_name: '',
  year_of_study: '1st Year',
  semester: '1st Semester',
  domicile_state: 'Karnataka',
  district: '',
  date_of_birth: '',
  disability_status: false,
  is_single_girl_child: false,
  is_orphan_or_ward_of_defense: false,
  is_ner_domicile: false,
  previous_scholarship_details: '',
  is_demo: false,
};

interface StudentProfileWizardProps {
  profile: StudentProfile | null;
  onSaveProfile: (profile: StudentProfile) => void;
  onRunAnalysis: () => void;
  onCancel?: () => void;
  loading?: boolean;
}

export const StudentProfileWizard: React.FC<StudentProfileWizardProps> = ({
  profile,
  onSaveProfile,
  onRunAnalysis,
  onCancel,
  loading = false,
}) => {
  const [formData, setFormData] = useState<StudentProfile>(profile || EMPTY_PROFILE);
  const [currentStep, setCurrentStep] = useState<number>(1);

  const completionPct = calculateProfileCompletion(formData);

  const handleFieldChange = (field: keyof StudentProfile, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep((prev) => prev + 1);
    } else {
      onSaveProfile(formData);
      onRunAnalysis();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleFinalSubmit = () => {
    onSaveProfile(formData);
    onRunAnalysis();
  };

  const steps = [
    { step: 1, label: 'Personal Details', icon: User, desc: 'Identity & KYC' },
    { step: 2, label: 'Education Details', icon: GraduationCap, desc: 'Course & Marks' },
    { step: 3, label: 'Family & Eligibility', icon: Users, desc: 'Income & Social' },
    { step: 4, label: 'Documents Readiness', icon: FileCheck, desc: 'Certificates' },
    { step: 5, label: 'Review & Verify', icon: Sparkles, desc: 'Calculate Matches' },
  ];

  return (
    <div className="card-panel p-6 space-y-6 bg-white border border-slate-200 shadow-sm">
      {/* Step Header & Completion Progress */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <h3 className="text-lg font-black text-slate-900">
            {steps[currentStep - 1].label}
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Step {currentStep} of 5 — {steps[currentStep - 1].desc}
          </p>
        </div>

        <div className="flex items-center space-x-3 sm:self-auto self-start">
          <div className="text-right">
            <span className="text-[11px] font-semibold text-slate-500 block">Profile Completion</span>
            <span className="text-xs font-black text-emerald-700">{completionPct}% Completed</span>
          </div>
          <div className="w-24 h-2 rounded-full bg-slate-100 overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all duration-300"
              style={{ width: `${completionPct}%` }}
            />
          </div>
        </div>
      </div>

      {/* Progress Stepper Bar */}
      <div className="grid grid-cols-5 gap-1 p-1 rounded-xl bg-slate-100 border border-slate-200 text-xs">
        {steps.map((s) => {
          const isActive = currentStep === s.step;
          const isDone = currentStep > s.step;

          return (
            <button
              key={s.step}
              type="button"
              onClick={() => setCurrentStep(s.step)}
              className={`flex items-center justify-center space-x-1.5 py-2 px-1 rounded-lg transition-all cursor-pointer text-center ${
                isActive
                  ? 'bg-white text-blue-700 font-bold shadow-xs border border-slate-200'
                  : isDone
                  ? 'text-emerald-700 font-semibold hover:bg-slate-200/50'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                  isActive
                    ? 'bg-blue-600 text-white'
                    : isDone
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-slate-200 text-slate-600'
                }`}
              >
                {isDone ? <Check className="w-3 h-3" /> : s.step}
              </div>
              <span className="hidden md:inline truncate">{s.label}</span>
            </button>
          );
        })}
      </div>

      {/* STEP 1: PERSONAL DETAILS */}
      {currentStep === 1 && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Full Legal Name (as per Aadhaar / Marksheet) *
              </label>
              <input
                type="text"
                value={formData.applicant_name}
                onChange={(e) => handleFieldChange('applicant_name', e.target.value)}
                placeholder="e.g. Shaik Mohammed Anas"
                className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-slate-300 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Student ID / USN / Roll Number
              </label>
              <input
                type="text"
                value={formData.student_id || ''}
                onChange={(e) => handleFieldChange('student_id', e.target.value)}
                placeholder="e.g. 1NT22CS142 or College Roll No."
                className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-slate-300 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Age (in completed years) *
              </label>
              <input
                type="number"
                value={formData.applicant_age}
                onChange={(e) => handleFieldChange('applicant_age', parseInt(e.target.value) || 18)}
                className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Date of Birth
              </label>
              <input
                type="date"
                value={formData.date_of_birth || ''}
                onChange={(e) => handleFieldChange('date_of_birth', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Gender *</label>
              <select
                value={formData.gender}
                onChange={(e) => handleFieldChange('gender', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="male">Male</option>
                <option value="female">Female (Qualifies for AICTE Pragati & Girls Schemes)</option>
                <option value="other">Other / Transgender</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Social Category *
              </label>
              <select
                value={formData.social_category}
                onChange={(e) => handleFieldChange('social_category', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="General">General / Open Merit</option>
                <option value="OBC">OBC (Other Backward Classes)</option>
                <option value="SC">SC (Scheduled Caste)</option>
                <option value="ST">ST (Scheduled Tribe)</option>
                <option value="EWS">EWS (Economically Weaker Section)</option>
                <option value="Minority">Minority (Muslim, Christian, Sikh, Jain, Buddhist, Parsi)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Domicile / Resident State *
              </label>
              <select
                value={formData.domicile_state || 'Karnataka'}
                onChange={(e) => {
                  const state = e.target.value;
                  handleFieldChange('domicile_state', state);
                  const isNer = [
                    'Assam',
                    'Arunachal Pradesh',
                    'Manipur',
                    'Meghalaya',
                    'Mizoram',
                    'Nagaland',
                    'Sikkim',
                    'Tripura',
                  ].includes(state);
                  handleFieldChange('is_ner_domicile', isNer);
                }}
                className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="Karnataka">Karnataka (SSP Eligible)</option>
                <option value="Maharashtra">Maharashtra</option>
                <option value="Delhi">Delhi</option>
                <option value="Uttar Pradesh">Uttar Pradesh</option>
                <option value="Tamil Nadu">Tamil Nadu</option>
                <option value="Telangana">Telangana</option>
                <option value="Gujarat">Gujarat</option>
                <option value="Rajasthan">Rajasthan</option>
                <option value="West Bengal">West Bengal</option>
                <option value="Assam">Assam (North Eastern Region - Ishan Uday)</option>
                <option value="Manipur">Manipur (North Eastern Region - Ishan Uday)</option>
                <option value="Meghalaya">Meghalaya (North Eastern Region - Ishan Uday)</option>
                <option value="Arunachal Pradesh">Arunachal Pradesh (NER)</option>
                <option value="Nagaland">Nagaland (NER)</option>
                <option value="Mizoram">Mizoram (NER)</option>
                <option value="Sikkim">Sikkim (NER)</option>
                <option value="Tripura">Tripura (NER)</option>
                <option value="Other">Other State</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                District of Residence
              </label>
              <input
                type="text"
                value={formData.district || ''}
                onChange={(e) => handleFieldChange('district', e.target.value)}
                placeholder="e.g. Dakshina Kannada or Bengaluru Urban"
                className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-slate-300 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* KYC Status Checkboxes */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Statutory KYC Readiness (Required for Central & State Portals):
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <label className="flex items-start space-x-2.5 p-3 rounded-lg bg-white border border-slate-200 cursor-pointer hover:border-slate-300">
                <input
                  type="checkbox"
                  checked={formData.aadhaar_present}
                  onChange={(e) => handleFieldChange('aadhaar_present', e.target.checked)}
                  className="mt-0.5 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
                />
                <div>
                  <p className="text-xs font-semibold text-slate-900">Aadhaar Card Available</p>
                  <p className="text-[11px] text-slate-500">Required for NSP One-Time Registration (OTR)</p>
                </div>
              </label>

              <label className="flex items-start space-x-2.5 p-3 rounded-lg bg-white border border-slate-200 cursor-pointer hover:border-slate-300">
                <input
                  type="checkbox"
                  checked={formData.bank_account_present}
                  onChange={(e) => handleFieldChange('bank_account_present', e.target.checked)}
                  className="mt-0.5 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
                />
                <div>
                  <p className="text-xs font-semibold text-slate-900">Aadhaar-NPCI Seeded Bank Account</p>
                  <p className="text-[11px] text-slate-500">Mandatory for Direct Benefit Transfer (DBT) funds</p>
                </div>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* STEP 2: EDUCATION DETAILS */}
      {currentStep === 2 && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                College / University / Institution Name *
              </label>
              <input
                type="text"
                value={formData.institution_name || ''}
                onChange={(e) => handleFieldChange('institution_name', e.target.value)}
                placeholder="e.g. National Institute of Technology Karnataka (NITK) Surathkal"
                className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-slate-300 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Course / Degree Name *
              </label>
              <input
                type="text"
                value={formData.course_name || ''}
                onChange={(e) => handleFieldChange('course_name', e.target.value)}
                placeholder="e.g. B.Tech Computer Science & Engineering"
                className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-slate-300 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Branch / Specialization
              </label>
              <input
                type="text"
                value={formData.branch || ''}
                onChange={(e) => handleFieldChange('branch', e.target.value)}
                placeholder="e.g. Computer Science, Mechanical, Natural Sciences"
                className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-slate-300 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Year of Study *
              </label>
              <select
                value={formData.year_of_study || '1st Year'}
                onChange={(e) => handleFieldChange('year_of_study', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="1st Year">1st Year (Fresher)</option>
                <option value="2nd Year">2nd Year (Renewal)</option>
                <option value="3rd Year">3rd Year (Renewal)</option>
                <option value="4th Year">4th Year (Renewal)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Semester
              </label>
              <select
                value={formData.semester || '1st Semester'}
                onChange={(e) => handleFieldChange('semester', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="1st Semester">1st Semester</option>
                <option value="2nd Semester">2nd Semester</option>
                <option value="3rd Semester">3rd Semester</option>
                <option value="4th Semester">4th Semester</option>
                <option value="5th Semester">5th Semester</option>
                <option value="6th Semester">6th Semester</option>
                <option value="7th Semester">7th Semester</option>
                <option value="8th Semester">8th Semester</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Academic Aggregate Percentage / Equivalent CGPA (%) *
              </label>
              <div className="flex items-center space-x-3">
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="100"
                  value={formData.academic_percentage}
                  onChange={(e) => handleFieldChange('academic_percentage', parseFloat(e.target.value) || 0)}
                  className="w-40 px-3.5 py-2.5 rounded-lg bg-white border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-bold"
                />
                <span className="text-xs text-slate-500">
                  {formData.academic_percentage >= 80
                    ? '✓ Satisfies PM-USP Central Sector & DST INSPIRE 80% cutoff'
                    : formData.academic_percentage >= 60
                    ? '✓ Satisfies State and Post-Matric 60% criteria'
                    : 'Satisfies standard passing criteria'}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <label className="flex items-center space-x-2 p-3 rounded-lg bg-slate-50 border border-slate-200 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.is_ug_student}
                onChange={(e) => handleFieldChange('is_ug_student', e.target.checked)}
                className="rounded text-blue-600 focus:ring-blue-500 border-slate-300"
              />
              <span className="text-xs font-semibold text-slate-800">
                Enrolled in Under-Graduate (UG) Degree
              </span>
            </label>

            <label className="flex items-center space-x-2 p-3 rounded-lg bg-slate-50 border border-slate-200 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.is_post_matric_student}
                onChange={(e) => handleFieldChange('is_post_matric_student', e.target.checked)}
                className="rounded text-blue-600 focus:ring-blue-500 border-slate-300"
              />
              <span className="text-xs font-semibold text-slate-800">
                Post-Matric Student (Completed 10th Standard)
              </span>
            </label>
          </div>
        </div>
      )}

      {/* STEP 3: FAMILY & ELIGIBILITY */}
      {currentStep === 3 && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Annual Family Income (INR ₹) *
              </label>
              <input
                type="number"
                step="10000"
                value={formData.annual_family_income}
                onChange={(e) => handleFieldChange('annual_family_income', parseInt(e.target.value) || 0)}
                className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-slate-300 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                {formData.annual_family_income <= 250000
                  ? '✓ Qualifies for full tuition waiver & Post-Matric schemes (<= ₹2.5L)'
                  : formData.annual_family_income <= 450000
                  ? '✓ Qualifies for Central Sector NSP merit schemes (<= ₹4.5L)'
                  : formData.annual_family_income <= 800000
                  ? '✓ Qualifies for AICTE Pragati, Saksham & Swanath (<= ₹8L)'
                  : 'Requires merit-based schemes without income ceiling'}
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Previous / Existing Scholarship Details
              </label>
              <input
                type="text"
                value={formData.previous_scholarship_details || ''}
                onChange={(e) => handleFieldChange('previous_scholarship_details', e.target.value)}
                placeholder="e.g. None or SSP 2025"
                className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-slate-300 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Statutory Clauses & Special Entitlements:
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label className="flex items-start space-x-2.5 p-3 rounded-lg bg-white border border-slate-200 cursor-pointer hover:border-slate-300">
                <input
                  type="checkbox"
                  checked={formData.is_single_girl_child || false}
                  onChange={(e) => handleFieldChange('is_single_girl_child', e.target.checked)}
                  className="mt-0.5 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
                />
                <div>
                  <p className="text-xs font-semibold text-slate-900">Single Girl Child in Family</p>
                  <p className="text-[11px] text-slate-500">Unlocks UGC PG Indira Gandhi Scholarship (₹36,200/yr)</p>
                </div>
              </label>

              <label className="flex items-start space-x-2.5 p-3 rounded-lg bg-white border border-slate-200 cursor-pointer hover:border-slate-300">
                <input
                  type="checkbox"
                  checked={formData.disability_status || false}
                  onChange={(e) => handleFieldChange('disability_status', e.target.checked)}
                  className="mt-0.5 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
                />
                <div>
                  <p className="text-xs font-semibold text-slate-900">Differently-Abled (PwD &ge; 40%)</p>
                  <p className="text-[11px] text-slate-500">Unlocks AICTE Saksham Scholarship (₹50,000/yr)</p>
                </div>
              </label>

              <label className="flex items-start space-x-2.5 p-3 rounded-lg bg-white border border-slate-200 cursor-pointer hover:border-slate-300">
                <input
                  type="checkbox"
                  checked={formData.is_orphan_or_ward_of_defense || false}
                  onChange={(e) => handleFieldChange('is_orphan_or_ward_of_defense', e.target.checked)}
                  className="mt-0.5 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
                />
                <div>
                  <p className="text-xs font-semibold text-slate-900">Orphan / Ward of Defense</p>
                  <p className="text-[11px] text-slate-500">Unlocks AICTE Swanath Scheme (₹50,000/yr)</p>
                </div>
              </label>

              <label className="flex items-start space-x-2.5 p-3 rounded-lg bg-white border border-slate-200 cursor-pointer hover:border-slate-300">
                <input
                  type="checkbox"
                  checked={formData.is_ner_domicile || false}
                  onChange={(e) => handleFieldChange('is_ner_domicile', e.target.checked)}
                  className="mt-0.5 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
                />
                <div>
                  <p className="text-xs font-semibold text-slate-900">North Eastern Region (NER) Domicile</p>
                  <p className="text-[11px] text-slate-500">Unlocks UGC Ishan Uday Special Scholarship (₹78,000/yr)</p>
                </div>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* STEP 4: DOCUMENTS READINESS */}
      {currentStep === 4 && (
        <div className="space-y-4">
          <p className="text-xs text-slate-600">
            Verify readiness of statutory documents required during portal submission:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              {
                id: 'income_cert',
                title: 'Competent Authority Income Certificate',
                desc: 'Issued by Tehsildar / Revenue Authority (valid for current FY).',
                checked: (formData.annual_family_income || 0) > 0,
              },
              {
                id: 'bonafide',
                title: 'College Bonafide / Admission Receipt',
                desc: 'Endorsement from college Head of Institution (HOI).',
                checked: formData.is_ug_student,
              },
              {
                id: 'marksheets',
                title: 'Class 10th & 12th Board Passing Marksheets',
                desc: 'Verifies aggregate academic percentage and merit cutoff.',
                checked: (formData.academic_percentage || 0) >= 50,
              },
              {
                id: 'bank',
                title: 'NPCI Seeded Bank Account Passbook',
                desc: 'Aadhaar mapped in bank CBS for DBT disbursement.',
                checked: formData.bank_account_present,
              },
            ].map((doc) => (
              <div
                key={doc.id}
                className="flex items-start justify-between p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs"
              >
                <div className="flex items-start space-x-2.5">
                  <div
                    className={`mt-0.5 w-5 h-5 rounded-md flex items-center justify-center ${
                      doc.checked ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">{doc.title}</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">{doc.desc}</p>
                  </div>
                </div>

                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded border shrink-0 ${
                    doc.checked
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-amber-50 text-amber-700 border-amber-200'
                  }`}
                >
                  {doc.checked ? 'Ready' : 'Pending'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* STEP 5: REVIEW & VERIFY */}
      {currentStep === 5 && (
        <div className="space-y-4">
          <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <p className="text-[10px] text-slate-500 uppercase font-bold">Student Name</p>
                <p className="text-sm font-bold text-slate-900 mt-0.5">{formData.applicant_name || 'Not provided'}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-500 uppercase font-bold">Age & Gender</p>
                <p className="text-sm font-bold text-slate-900 mt-0.5">
                  {formData.applicant_age} Yrs / {formData.gender}
                </p>
              </div>
              <div>
                <p className="text-[10px] text-slate-500 uppercase font-bold">Academic Merit</p>
                <p className="text-sm font-bold text-emerald-700 mt-0.5">{formData.academic_percentage}% Aggregate</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-500 uppercase font-bold">Family Income</p>
                <p className="text-sm font-bold text-slate-900 mt-0.5">
                  ₹{Number(formData.annual_family_income || 0).toLocaleString('en-IN')}
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <p className="text-[10px] text-slate-500 uppercase font-bold">Category</p>
                <p className="text-xs font-semibold text-slate-800 mt-0.5">{formData.social_category}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-500 uppercase font-bold">Domicile State</p>
                <p className="text-xs font-semibold text-slate-800 mt-0.5">{formData.domicile_state || 'All-India'}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-500 uppercase font-bold">Course / Degree</p>
                <p className="text-xs font-semibold text-slate-800 mt-0.5 truncate">
                  {formData.course_name || 'Undergraduate'}
                </p>
              </div>
              <div>
                <p className="text-[10px] text-slate-500 uppercase font-bold">Aadhaar / Bank DBT</p>
                <p className="text-xs font-semibold text-emerald-700 mt-0.5">
                  {formData.aadhaar_present && formData.bank_account_present ? '✓ Verified' : 'Pending'}
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <ShieldCheck className="w-5 h-5 text-blue-700 shrink-0" />
              <div>
                <p className="text-xs font-bold text-slate-900">Deterministic Statutory Rule Verification</p>
                <p className="text-[11px] text-slate-600">
                  ScholarTack analyzes statutory clauses with 0% AI hallucination — only true government criteria decide.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-100">
        <div className="flex items-center space-x-2">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 text-xs font-semibold cursor-pointer"
            >
              Cancel
            </button>
          )}

          <button
            type="button"
            onClick={handleBack}
            disabled={currentStep === 1}
            className="flex items-center space-x-1.5 px-4 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 text-xs font-semibold transition-all disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Previous</span>
          </button>
        </div>

        <div className="flex items-center space-x-3">
          {currentStep < 5 ? (
            <button
              type="button"
              onClick={handleNext}
              className="flex items-center space-x-1.5 px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-all cursor-pointer"
            >
              <span>Continue</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleFinalSubmit}
              disabled={loading}
              className="flex items-center space-x-2 px-6 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition-all cursor-pointer disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4" />
              <span>{loading ? 'Evaluating Eligibility...' : 'Save Profile & Run Matching'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
