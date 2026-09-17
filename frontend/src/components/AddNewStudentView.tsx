import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Save,
  RotateCcw,
  AlertCircle,
} from 'lucide-react';
import type { StudentProfile } from '../types';

interface AddNewStudentViewProps {
  initialProfile?: StudentProfile | null;
  onSaveStudent: (student: StudentProfile) => void;
  onCancel: () => void;
}

interface FormState {
  // A. Personal
  fullName: string;
  studentId: string;
  gender: string;
  dateOfBirth: string;
  age: string;
  phone: string;
  email: string;

  // B. Education
  college: string;
  course: string;
  branch: string;
  yearOfStudy: string;
  semester: string;
  academicYear: string;

  // C. Academic Performance
  percentage: string;
  cgpa: string;
  previousPerformance: string;

  // D. Category & Income
  category: string;
  annualIncome: string;
  relevantScholarshipCategory: string;

  // E. Domicile
  state: string;
  district: string;

  // F. Scholarship Info
  scholarshipInterests: string;
  previousScholarshipDetails: string;

  // G. Documents
  aadhaarStatus: boolean;
  bankDbtStatus: boolean;
  incomeCertificateStatus: string;
  casteCertificateStatus: string;
  bonafideCertificateStatus: string;
  marksCardStatus: string;
  otherDocumentsStatus: string;

  // Special criteria
  disabilityStatus: boolean;
  singleGirlChild: boolean;
  orphanOrDefense: boolean;
}

const DEFAULT_FORM_STATE: FormState = {
  fullName: '',
  studentId: '',
  gender: '',
  dateOfBirth: '',
  age: '',
  phone: '',
  email: '',

  college: '',
  course: '',
  branch: '',
  yearOfStudy: '',
  semester: '',
  academicYear: '',

  percentage: '',
  cgpa: '',
  previousPerformance: '',

  category: '',
  annualIncome: '',
  relevantScholarshipCategory: '',

  state: '',
  district: '',

  scholarshipInterests: '',
  previousScholarshipDetails: '',

  aadhaarStatus: false,
  bankDbtStatus: false,
  incomeCertificateStatus: 'not_available',
  casteCertificateStatus: 'not_applicable',
  bonafideCertificateStatus: 'not_available',
  marksCardStatus: 'not_available',
  otherDocumentsStatus: 'not_available',

  disabilityStatus: false,
  singleGirlChild: false,
  orphanOrDefense: false,
};

export const AddNewStudentView: React.FC<AddNewStudentViewProps> = ({
  initialProfile,
  onSaveStudent,
  onCancel,
}) => {
  const getInitialForm = (): FormState => {
    if (initialProfile) {
      return {
        fullName: initialProfile.applicant_name || '',
        studentId: initialProfile.student_id || '',
        gender: initialProfile.gender || '',
        dateOfBirth: initialProfile.date_of_birth || '',
        age: initialProfile.applicant_age ? String(initialProfile.applicant_age) : '',
        phone: initialProfile.phone || '',
        email: initialProfile.email || '',

        college: initialProfile.institution_name || '',
        course: initialProfile.course_name || '',
        branch: initialProfile.branch || '',
        yearOfStudy: initialProfile.year_of_study || '',
        semester: initialProfile.semester || '',
        academicYear: initialProfile.academic_year || '',

        percentage: initialProfile.academic_percentage ? String(initialProfile.academic_percentage) : '',
        cgpa: initialProfile.cgpa ? String(initialProfile.cgpa) : '',
        previousPerformance: initialProfile.previous_academic_performance || '',

        category: initialProfile.social_category || '',
        annualIncome: initialProfile.annual_family_income !== undefined ? String(initialProfile.annual_family_income) : '',
        relevantScholarshipCategory: initialProfile.relevant_scholarship_category || '',

        state: initialProfile.domicile_state || '',
        district: initialProfile.district || '',

        scholarshipInterests: initialProfile.scholarship_interests || '',
        previousScholarshipDetails: initialProfile.previous_scholarship_details || '',

        aadhaarStatus: Boolean(initialProfile.aadhaar_present),
        bankDbtStatus: Boolean(initialProfile.bank_account_present),
        incomeCertificateStatus: initialProfile.income_certificate_status || 'not_available',
        casteCertificateStatus: initialProfile.caste_certificate_status || 'not_applicable',
        bonafideCertificateStatus: initialProfile.bonafide_certificate_status || 'not_available',
        marksCardStatus: initialProfile.marks_card_status || 'not_available',
        otherDocumentsStatus: initialProfile.other_documents_status || 'not_available',

        disabilityStatus: Boolean(initialProfile.disability_status),
        singleGirlChild: Boolean(initialProfile.is_single_girl_child),
        orphanOrDefense: Boolean(initialProfile.is_orphan_or_ward_of_defense),
      };
    }
    return DEFAULT_FORM_STATE;
  };

  const [form, setForm] = useState<FormState>(getInitialForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setForm(getInitialForm());
    setErrors({});
  }, [initialProfile]);

  const handleChange = (field: keyof FormState, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[field];
        return copy;
      });
    }
  };

  const handleClear = () => {
    if (window.confirm('Are you sure you want to clear the entire form?')) {
      setForm(DEFAULT_FORM_STATE);
      setErrors({});
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!form.fullName.trim()) {
      newErrors.fullName = 'Full Name is required';
    }
    if (!form.studentId.trim()) {
      newErrors.studentId = 'USN / Student ID is required';
    }
    if (!form.college.trim()) {
      newErrors.college = 'College / Institution name is required';
    }
    const pct = parseFloat(form.percentage);
    if (!form.percentage || isNaN(pct) || pct <= 0 || pct > 100) {
      newErrors.percentage = 'Academic percentage must be between 1 and 100';
    }
    const inc = parseFloat(form.annualIncome);
    if (form.annualIncome === '' || isNaN(inc) || inc < 0) {
      newErrors.annualIncome = 'Please enter a valid annual family income (0 or greater)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setIsSubmitting(true);
    const now = new Date().toISOString();
    const id = initialProfile?.id || `student-${form.studentId.replace(/[^a-zA-Z0-9]/g, '').toLowerCase()}-${Date.now()}`;

    const newProfile: StudentProfile = {
      id,
      applicant_name: form.fullName.trim(),
      student_id: form.studentId.trim().toUpperCase(),
      applicant_age: parseInt(form.age) || 19,
      gender: form.gender || 'Not Specified',
      date_of_birth: form.dateOfBirth,
      phone: form.phone.trim(),
      email: form.email.trim(),

      institution_name: form.college.trim(),
      course_name: form.course.trim() || 'Degree Course',
      branch: form.branch.trim(),
      year_of_study: form.yearOfStudy || '1st Year',
      semester: form.semester || '1st Semester',
      academic_year: form.academicYear || '2026-27',

      academic_percentage: parseFloat(form.percentage) || 0,
      cgpa: form.cgpa.trim(),
      previous_academic_performance: form.previousPerformance.trim(),

      social_category: form.category || 'General',
      annual_family_income: parseFloat(form.annualIncome) || 0,
      relevant_scholarship_category: form.relevantScholarshipCategory.trim(),

      domicile_state: form.state || 'Karnataka',
      district: form.district.trim(),

      scholarship_interests: form.scholarshipInterests.trim(),
      previous_scholarship_details: form.previousScholarshipDetails.trim(),

      aadhaar_present: form.aadhaarStatus,
      bank_account_present: form.bankDbtStatus,
      income_certificate_status: form.incomeCertificateStatus,
      caste_certificate_status: form.casteCertificateStatus,
      bonafide_certificate_status: form.bonafideCertificateStatus,
      marks_card_status: form.marksCardStatus,
      other_documents_status: form.otherDocumentsStatus,

      disability_status: form.disabilityStatus,
      is_single_girl_child: form.singleGirlChild,
      is_orphan_or_ward_of_defense: form.orphanOrDefense,
      is_availing_other_scholarship: Boolean(form.previousScholarshipDetails?.trim()),
      is_ug_student: true,
      is_post_matric_student: true,
      is_demo: false,

      last_used: now,
      created_at: initialProfile?.created_at || now,
    };

    onSaveStudent(newProfile);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Route & Header Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#e2ebe5]">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={onCancel}
              className="inline-flex items-center space-x-1 text-xs font-semibold text-[#52665a] hover:text-[#047857] transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Student Profiles</span>
            </button>
            <span className="text-[#cbd5e1]">/</span>
            <span className="text-xs font-bold text-[#047857] bg-[#ecfdf5] px-2 py-0.5 rounded border border-[#a7f3d0]">
              {initialProfile ? 'Edit Profile' : '/students/new'}
            </span>
          </div>
          <h2 className="text-2xl font-black text-[#0f172a] tracking-tight">
            {initialProfile ? 'Edit Student Profile' : 'Add New Student Registration'}
          </h2>
          <p className="text-xs text-[#52665a]">
            {initialProfile
              ? `Update academic credentials and statutory eligibility facts for ${form.fullName || 'student'}.`
              : 'Register verified student credentials and statutory entitlement attributes for government scholarship evaluation.'}
          </p>
        </div>

        <div className="flex items-center space-x-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={handleClear}
            className="px-3.5 py-2 rounded-xl bg-white border border-[#e2ebe5] hover:bg-slate-50 text-[#52665a] font-semibold text-xs transition-colors cursor-pointer flex items-center space-x-1.5 shadow-xs"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Clear Form</span>
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-3.5 py-2 rounded-xl bg-white border border-[#e2ebe5] hover:bg-slate-50 text-[#52665a] font-semibold text-xs transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-5 py-2 rounded-xl bg-[#047857] hover:bg-[#065f46] text-white font-bold text-xs shadow-sm transition-all cursor-pointer flex items-center space-x-1.5"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Student</span>
          </button>
        </div>
      </div>

      {Object.keys(errors).length > 0 && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start space-x-2">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">Please correct the following fields:</p>
            <ul className="list-disc list-inside mt-1 space-y-0.5 text-[11px]">
              {Object.values(errors).map((err, idx) => (
                <li key={idx}>{err}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* SECTION A: Personal Information */}
        <div className="card-panel p-6 bg-white border border-[#e2ebe5] shadow-xs space-y-4">
          <div className="flex items-center space-x-2.5 pb-3 border-b border-[#e2ebe5]">
            <div className="w-7 h-7 rounded-lg bg-[#ecfdf5] text-[#047857] flex items-center justify-center font-bold text-xs">
              A
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#0f172a]">Personal Information</h3>
              <p className="text-[11px] text-[#52665a]">Student identification and demographic facts</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            <div className="space-y-1">
              <label className="font-semibold text-[#0f172a] block">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={form.fullName}
                onChange={(e) => handleChange('fullName', e.target.value)}
                placeholder="Enter student's full name"
                className={`w-full px-3 py-2 rounded-xl border ${
                  errors.fullName ? 'border-rose-400 bg-rose-50/30' : 'border-[#e2ebe5] bg-white'
                } focus:outline-none focus:ring-2 focus:ring-[#047857]/30 text-xs`}
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-[#0f172a] block">
                USN / Student ID <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={form.studentId}
                onChange={(e) => handleChange('studentId', e.target.value)}
                placeholder="Enter USN / Student ID"
                className={`w-full px-3 py-2 rounded-xl border ${
                  errors.studentId ? 'border-rose-400 bg-rose-50/30' : 'border-[#e2ebe5] bg-white'
                } focus:outline-none focus:ring-2 focus:ring-[#047857]/30 text-xs font-mono uppercase`}
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-[#0f172a] block">Gender</label>
              <select
                value={form.gender}
                onChange={(e) => handleChange('gender', e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#e2ebe5] bg-white focus:outline-none focus:ring-2 focus:ring-[#047857]/30 text-xs"
              >
                <option value="">-- Select Gender --</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="transgender">Transgender</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-[#0f172a] block">Date of Birth</label>
              <input
                type="date"
                value={form.dateOfBirth}
                onChange={(e) => handleChange('dateOfBirth', e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#e2ebe5] bg-white focus:outline-none focus:ring-2 focus:ring-[#047857]/30 text-xs"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-[#0f172a] block">Age (Years)</label>
              <input
                type="number"
                min="14"
                max="60"
                value={form.age}
                onChange={(e) => handleChange('age', e.target.value)}
                placeholder="e.g. 19"
                className="w-full px-3 py-2 rounded-xl border border-[#e2ebe5] bg-white focus:outline-none focus:ring-2 focus:ring-[#047857]/30 text-xs"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-[#0f172a] block">Phone Number (Demo/Masked)</label>
              <input
                type="text"
                value={form.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                placeholder="e.g. +91 9876543210"
                className="w-full px-3 py-2 rounded-xl border border-[#e2ebe5] bg-white focus:outline-none focus:ring-2 focus:ring-[#047857]/30 text-xs"
              />
            </div>

            <div className="space-y-1 sm:col-span-2 lg:col-span-3">
              <label className="font-semibold text-[#0f172a] block">Email Address</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => handleChange('email', e.target.value)}
                placeholder="e.g. student@college.edu"
                className="w-full px-3 py-2 rounded-xl border border-[#e2ebe5] bg-white focus:outline-none focus:ring-2 focus:ring-[#047857]/30 text-xs"
              />
            </div>
          </div>
        </div>

        {/* SECTION B: Education */}
        <div className="card-panel p-6 bg-white border border-[#e2ebe5] shadow-xs space-y-4">
          <div className="flex items-center space-x-2.5 pb-3 border-b border-[#e2ebe5]">
            <div className="w-7 h-7 rounded-lg bg-[#ecfdf5] text-[#047857] flex items-center justify-center font-bold text-xs">
              B
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#0f172a]">Education Details</h3>
              <p className="text-[11px] text-[#52665a]">Institution, enrolled degree program, and current academic stage</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            <div className="space-y-1 sm:col-span-2">
              <label className="font-semibold text-[#0f172a] block">
                College / Institution <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={form.college}
                onChange={(e) => handleChange('college', e.target.value)}
                placeholder="Enter college or university name"
                className={`w-full px-3 py-2 rounded-xl border ${
                  errors.college ? 'border-rose-400 bg-rose-50/30' : 'border-[#e2ebe5] bg-white'
                } focus:outline-none focus:ring-2 focus:ring-[#047857]/30 text-xs`}
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-[#0f172a] block">Academic Year</label>
              <input
                type="text"
                value={form.academicYear}
                onChange={(e) => handleChange('academicYear', e.target.value)}
                placeholder="e.g. 2026-27"
                className="w-full px-3 py-2 rounded-xl border border-[#e2ebe5] bg-white focus:outline-none focus:ring-2 focus:ring-[#047857]/30 text-xs"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-[#0f172a] block">Course Name</label>
              <input
                type="text"
                value={form.course}
                onChange={(e) => handleChange('course', e.target.value)}
                placeholder="e.g. B.E. Computer Science / B.Tech / B.Sc / M.Tech"
                className="w-full px-3 py-2 rounded-xl border border-[#e2ebe5] bg-white focus:outline-none focus:ring-2 focus:ring-[#047857]/30 text-xs"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-[#0f172a] block">Branch / Discipline</label>
              <input
                type="text"
                value={form.branch}
                onChange={(e) => handleChange('branch', e.target.value)}
                placeholder="e.g. Computer Science / Electronics / Mechanical"
                className="w-full px-3 py-2 rounded-xl border border-[#e2ebe5] bg-white focus:outline-none focus:ring-2 focus:ring-[#047857]/30 text-xs"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-[#0f172a] block">Current Year</label>
              <select
                value={form.yearOfStudy}
                onChange={(e) => handleChange('yearOfStudy', e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#e2ebe5] bg-white focus:outline-none focus:ring-2 focus:ring-[#047857]/30 text-xs"
              >
                <option value="">-- Select Year --</option>
                <option value="1st Year">1st Year</option>
                <option value="2nd Year">2nd Year</option>
                <option value="3rd Year">3rd Year</option>
                <option value="4th Year">4th Year</option>
                <option value="Post-Graduate">Post-Graduate</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-[#0f172a] block">Current Semester</label>
              <select
                value={form.semester}
                onChange={(e) => handleChange('semester', e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#e2ebe5] bg-white focus:outline-none focus:ring-2 focus:ring-[#047857]/30 text-xs"
              >
                <option value="">-- Select Semester --</option>
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
          </div>
        </div>

        {/* SECTION C: Academic Performance */}
        <div className="card-panel p-6 bg-white border border-[#e2ebe5] shadow-xs space-y-4">
          <div className="flex items-center space-x-2.5 pb-3 border-b border-[#e2ebe5]">
            <div className="w-7 h-7 rounded-lg bg-[#ecfdf5] text-[#047857] flex items-center justify-center font-bold text-xs">
              C
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#0f172a]">Academic Performance</h3>
              <p className="text-[11px] text-[#52665a]">Merit percentages, CGPA, and qualifying scores</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="space-y-1">
              <label className="font-semibold text-[#0f172a] block">
                Academic Aggregate Percentage (%) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="100"
                value={form.percentage}
                onChange={(e) => handleChange('percentage', e.target.value)}
                placeholder="e.g. 82.5"
                className={`w-full px-3 py-2 rounded-xl border ${
                  errors.percentage ? 'border-rose-400 bg-rose-50/30' : 'border-[#e2ebe5] bg-white'
                } focus:outline-none focus:ring-2 focus:ring-[#047857]/30 text-xs font-semibold`}
              />
              <p className="text-[10px] text-[#52665a]">Class 12 / Diploma / Previous Sem aggregate</p>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-[#0f172a] block">Cumulative CGPA</label>
              <input
                type="text"
                value={form.cgpa}
                onChange={(e) => handleChange('cgpa', e.target.value)}
                placeholder="e.g. 8.50"
                className="w-full px-3 py-2 rounded-xl border border-[#e2ebe5] bg-white focus:outline-none focus:ring-2 focus:ring-[#047857]/30 text-xs"
              />
              <p className="text-[10px] text-[#52665a]">Out of 10-point grade scale</p>
            </div>

            <div className="space-y-1 sm:col-span-3">
              <label className="font-semibold text-[#0f172a] block">Previous Academic Performance Summary</label>
              <textarea
                rows={2}
                value={form.previousPerformance}
                onChange={(e) => handleChange('previousPerformance', e.target.value)}
                placeholder="Details of 10th, 12th or previous semester examination marks..."
                className="w-full px-3 py-2 rounded-xl border border-[#e2ebe5] bg-white focus:outline-none focus:ring-2 focus:ring-[#047857]/30 text-xs"
              />
            </div>
          </div>
        </div>

        {/* SECTION D: Category & Income */}
        <div className="card-panel p-6 bg-white border border-[#e2ebe5] shadow-xs space-y-4">
          <div className="flex items-center space-x-2.5 pb-3 border-b border-[#e2ebe5]">
            <div className="w-7 h-7 rounded-lg bg-[#ecfdf5] text-[#047857] flex items-center justify-center font-bold text-xs">
              D
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#0f172a]">Category & Income</h3>
              <p className="text-[11px] text-[#52665a]">Statutory reservation category and certified annual household income</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            <div className="space-y-1">
              <label className="font-semibold text-[#0f172a] block">Social Category</label>
              <select
                value={form.category}
                onChange={(e) => handleChange('category', e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#e2ebe5] bg-white focus:outline-none focus:ring-2 focus:ring-[#047857]/30 text-xs"
              >
                <option value="">-- Select Category --</option>
                <option value="General">General / Open</option>
                <option value="OBC">OBC (Other Backward Classes)</option>
                <option value="SC">SC (Scheduled Caste)</option>
                <option value="ST">ST (Scheduled Tribe)</option>
                <option value="EWS">EWS (Economically Weaker Section)</option>
                <option value="Minority">Minority Community</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-[#0f172a] block">
                Annual Family Income (₹) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                step="1000"
                min="0"
                value={form.annualIncome}
                onChange={(e) => handleChange('annualIncome', e.target.value)}
                placeholder="e.g. 180000"
                className={`w-full px-3 py-2 rounded-xl border ${
                  errors.annualIncome ? 'border-rose-400 bg-rose-50/30' : 'border-[#e2ebe5] bg-white'
                } focus:outline-none focus:ring-2 focus:ring-[#047857]/30 text-xs font-semibold`}
              />
              <p className="text-[10px] text-[#52665a]">As stated on official Revenue Department Certificate</p>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-[#0f172a] block">Scholarship Reservation Tag</label>
              <input
                type="text"
                value={form.relevantScholarshipCategory}
                onChange={(e) => handleChange('relevantScholarshipCategory', e.target.value)}
                placeholder="e.g. Post-Matric SC, SSP, Central Sector"
                className="w-full px-3 py-2 rounded-xl border border-[#e2ebe5] bg-white focus:outline-none focus:ring-2 focus:ring-[#047857]/30 text-xs"
              />
            </div>
          </div>

          {/* Special Entitlements Checkboxes */}
          <div className="pt-2 border-t border-[#e2ebe5] grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <label className="flex items-center space-x-2 p-2.5 rounded-xl border border-[#e2ebe5] bg-slate-50/50 cursor-pointer hover:bg-slate-100/50">
              <input
                type="checkbox"
                checked={form.disabilityStatus}
                onChange={(e) => handleChange('disabilityStatus', e.target.checked)}
                className="rounded text-[#047857] focus:ring-[#047857]"
              />
              <span className="font-medium text-[#0f172a]">Differently-Abled (PwD 40%+)</span>
            </label>

            <label className="flex items-center space-x-2 p-2.5 rounded-xl border border-[#e2ebe5] bg-slate-50/50 cursor-pointer hover:bg-slate-100/50">
              <input
                type="checkbox"
                checked={form.singleGirlChild}
                onChange={(e) => handleChange('singleGirlChild', e.target.checked)}
                className="rounded text-[#047857] focus:ring-[#047857]"
              />
              <span className="font-medium text-[#0f172a]">Single Girl Child (Pragati)</span>
            </label>

            <label className="flex items-center space-x-2 p-2.5 rounded-xl border border-[#e2ebe5] bg-slate-50/50 cursor-pointer hover:bg-slate-100/50">
              <input
                type="checkbox"
                checked={form.orphanOrDefense}
                onChange={(e) => handleChange('orphanOrDefense', e.target.checked)}
                className="rounded text-[#047857] focus:ring-[#047857]"
              />
              <span className="font-medium text-[#0f172a]">Orphan / Armed Forces Ward</span>
            </label>
          </div>
        </div>

        {/* SECTION E: Domicile */}
        <div className="card-panel p-6 bg-white border border-[#e2ebe5] shadow-xs space-y-4">
          <div className="flex items-center space-x-2.5 pb-3 border-b border-[#e2ebe5]">
            <div className="w-7 h-7 rounded-lg bg-[#ecfdf5] text-[#047857] flex items-center justify-center font-bold text-xs">
              E
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#0f172a]">Domicile Information</h3>
              <p className="text-[11px] text-[#52665a]">Permanent residence state and home district</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <label className="font-semibold text-[#0f172a] block">State of Domicile</label>
              <select
                value={form.state}
                onChange={(e) => handleChange('state', e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#e2ebe5] bg-white focus:outline-none focus:ring-2 focus:ring-[#047857]/30 text-xs"
              >
                <option value="">-- Select State / UT --</option>
                <option value="Karnataka">Karnataka</option>
                <option value="Andhra Pradesh">Andhra Pradesh</option>
                <option value="Telangana">Telangana</option>
                <option value="Tamil Nadu">Tamil Nadu</option>
                <option value="Kerala">Kerala</option>
                <option value="Maharashtra">Maharashtra</option>
                <option value="Uttar Pradesh">Uttar Pradesh</option>
                <option value="Bihar">Bihar</option>
                <option value="Assam">Assam (NER)</option>
                <option value="Delhi">Delhi (NCR)</option>
                <option value="Other">Other / All-India</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-[#0f172a] block">District</label>
              <input
                type="text"
                value={form.district}
                onChange={(e) => handleChange('district', e.target.value)}
                placeholder="e.g. Bangalore Urban / Ramanagara / Mysuru"
                className="w-full px-3 py-2 rounded-xl border border-[#e2ebe5] bg-white focus:outline-none focus:ring-2 focus:ring-[#047857]/30 text-xs"
              />
            </div>
          </div>
        </div>

        {/* SECTION F: Scholarship Information */}
        <div className="card-panel p-6 bg-white border border-[#e2ebe5] shadow-xs space-y-4">
          <div className="flex items-center space-x-2.5 pb-3 border-b border-[#e2ebe5]">
            <div className="w-7 h-7 rounded-lg bg-[#ecfdf5] text-[#047857] flex items-center justify-center font-bold text-xs">
              F
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#0f172a]">Scholarship Information</h3>
              <p className="text-[11px] text-[#52665a]">Target scholarship schemes, interests, and past aid history</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <label className="font-semibold text-[#0f172a] block">Target Schemes & Interests</label>
              <textarea
                rows={2}
                value={form.scholarshipInterests}
                onChange={(e) => handleChange('scholarshipInterests', e.target.value)}
                placeholder="e.g. NSP Central Sector, AICTE Saksham, State SSP Post-Matric"
                className="w-full px-3 py-2 rounded-xl border border-[#e2ebe5] bg-white focus:outline-none focus:ring-2 focus:ring-[#047857]/30 text-xs"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-[#0f172a] block">Previous Scholarship Details</label>
              <textarea
                rows={2}
                value={form.previousScholarshipDetails}
                onChange={(e) => handleChange('previousScholarshipDetails', e.target.value)}
                placeholder="Mention any currently availed scholarship, or None if first-time..."
                className="w-full px-3 py-2 rounded-xl border border-[#e2ebe5] bg-white focus:outline-none focus:ring-2 focus:ring-[#047857]/30 text-xs"
              />
            </div>
          </div>
        </div>

        {/* SECTION G: Documents & Verification Readiness */}
        <div className="card-panel p-6 bg-white border border-[#e2ebe5] shadow-xs space-y-4">
          <div className="flex items-center space-x-2.5 pb-3 border-b border-[#e2ebe5]">
            <div className="w-7 h-7 rounded-lg bg-[#ecfdf5] text-[#047857] flex items-center justify-center font-bold text-xs">
              G
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#0f172a]">Statutory Document Readiness</h3>
              <p className="text-[11px] text-[#52665a]">Verification state of essential proofs for DBT disbursal</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            <div className="p-3 rounded-xl border border-[#e2ebe5] bg-slate-50/50 space-y-1.5">
              <span className="font-bold text-[#0f172a] block">Aadhaar Card KYC</span>
              <select
                value={form.aadhaarStatus ? 'yes' : 'no'}
                onChange={(e) => handleChange('aadhaarStatus', e.target.value === 'yes')}
                className="w-full px-2.5 py-1.5 rounded-lg border border-[#e2ebe5] bg-white text-xs font-semibold"
              >
                <option value="yes">✓ Verified & Available</option>
                <option value="no">Pending KYC</option>
              </select>
            </div>

            <div className="p-3 rounded-xl border border-[#e2ebe5] bg-slate-50/50 space-y-1.5">
              <span className="font-bold text-[#0f172a] block">Bank DBT / NPCI Seeding</span>
              <select
                value={form.bankDbtStatus ? 'yes' : 'no'}
                onChange={(e) => handleChange('bankDbtStatus', e.target.value === 'yes')}
                className="w-full px-2.5 py-1.5 rounded-lg border border-[#e2ebe5] bg-white text-xs font-semibold"
              >
                <option value="yes">✓ Seeded & Active</option>
                <option value="no">Pending Seeding</option>
              </select>
            </div>

            <div className="p-3 rounded-xl border border-[#e2ebe5] bg-slate-50/50 space-y-1.5">
              <span className="font-bold text-[#0f172a] block">Income Certificate</span>
              <select
                value={form.incomeCertificateStatus}
                onChange={(e) => handleChange('incomeCertificateStatus', e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg border border-[#e2ebe5] bg-white text-xs"
              >
                <option value="verified">Verified Valid</option>
                <option value="pending">Application in Progress</option>
                <option value="not_available">Not Available</option>
              </select>
            </div>

            <div className="p-3 rounded-xl border border-[#e2ebe5] bg-slate-50/50 space-y-1.5">
              <span className="font-bold text-[#0f172a] block">Caste / Category Certificate</span>
              <select
                value={form.casteCertificateStatus}
                onChange={(e) => handleChange('casteCertificateStatus', e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg border border-[#e2ebe5] bg-white text-xs"
              >
                <option value="verified">Verified (RD Number Available)</option>
                <option value="pending">Application in Progress</option>
                <option value="not_applicable">Not Applicable (General)</option>
              </select>
            </div>

            <div className="p-3 rounded-xl border border-[#e2ebe5] bg-slate-50/50 space-y-1.5">
              <span className="font-bold text-[#0f172a] block">Bonafide / Admission Letter</span>
              <select
                value={form.bonafideCertificateStatus}
                onChange={(e) => handleChange('bonafideCertificateStatus', e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg border border-[#e2ebe5] bg-white text-xs"
              >
                <option value="verified">Issued by College / Institute</option>
                <option value="pending">Awaiting College Seal</option>
                <option value="not_available">Not Available</option>
              </select>
            </div>

            <div className="p-3 rounded-xl border border-[#e2ebe5] bg-slate-50/50 space-y-1.5">
              <span className="font-bold text-[#0f172a] block">Marks Card / Marksheet</span>
              <select
                value={form.marksCardStatus}
                onChange={(e) => handleChange('marksCardStatus', e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg border border-[#e2ebe5] bg-white text-xs"
              >
                <option value="verified">Original Marks Card Ready</option>
                <option value="pending">Provisional Available</option>
              </select>
            </div>
          </div>
        </div>

        {/* Form Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-2xl bg-white border border-[#e2ebe5] shadow-xs">
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={handleClear}
              className="px-4 py-2.5 rounded-xl bg-white border border-[#e2ebe5] hover:bg-slate-50 text-[#52665a] font-semibold text-xs transition-colors cursor-pointer flex items-center space-x-1.5 shadow-xs"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Clear Form</span>
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2.5 rounded-xl bg-white border border-[#e2ebe5] hover:bg-slate-50 text-[#52665a] font-semibold text-xs transition-colors cursor-pointer"
            >
              Cancel
            </button>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto px-7 py-2.5 rounded-xl bg-[#047857] hover:bg-[#065f46] text-white font-bold text-xs shadow-md shadow-[#047857]/20 transition-all cursor-pointer flex items-center justify-center space-x-2"
          >
            <Save className="w-4 h-4" />
            <span>Save Student & Evaluate Scholarships</span>
          </button>
        </div>
      </form>
    </div>
  );
};
