import React, { useState } from 'react';
import {
  Plus,
  Sparkles,
  ChevronDown,
  GraduationCap,
  ArrowRight,
  FileText,
  Clock,
  Users,
  Check,
} from 'lucide-react';
import type { StudentProfile } from '../types';
import {
  calculateProfileCompletion,
  DEMO_PERSONAS,
} from './StudentProfileWizard';

interface StudentProfilesViewProps {
  currentProfile: StudentProfile | null;
  recentStudents: StudentProfile[];
  onSelectStudent: (student: StudentProfile) => void;
  onEditStudent: (student: StudentProfile) => void;
  onCheckEligibility: (student: StudentProfile) => void;
  onGenerateReport: (student: StudentProfile) => void;
  onNavigateToAddNew: () => void;
  onNavigateToAllStudents: () => void;
  totalStudentsCount: number;
  loading?: boolean;
}

export const StudentProfilesView: React.FC<StudentProfilesViewProps> = ({
  currentProfile,
  recentStudents,
  onSelectStudent,
  onEditStudent,
  onCheckEligibility,
  onGenerateReport,
  onNavigateToAddNew,
  onNavigateToAllStudents,
  totalStudentsCount,
  loading = false,
}) => {
  const [demoExpanded, setDemoExpanded] = useState<boolean>(true);

  const formatLastUsed = (dateStr?: string) => {
    if (!dateStr) return 'Not accessed yet';
    try {
      const d = new Date(dateStr);
      const diffMs = Date.now() - d.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMins / 60);
      const diffDays = Math.floor(diffHours / 24);

      if (diffMins < 1) return 'Just now';
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      if (diffDays === 1) return 'Yesterday';
      if (diffDays < 7) return `${diffDays}d ago`;
      return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
    } catch {
      return 'Recently';
    }
  };

  // Exactly top 5 real students (demo profiles are filtered out and displayed in their own section)
  const displayedRecent = recentStudents.filter((s) => !s.is_demo).slice(0, 5);

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      {loading && (
        <div className="p-3 bg-[#ecfdf5] border border-[#a7f3d0] text-[#047857] text-xs font-semibold rounded-xl flex items-center space-x-2">
          <div className="w-3.5 h-3.5 border-2 border-[#047857] border-t-transparent rounded-full animate-spin" />
          <span>Processing scholarship data...</span>
        </div>
      )}
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#e2ebe5]">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-[#047857] uppercase tracking-wider bg-[#ecfdf5] px-2.5 py-0.5 rounded-md border border-[#a7f3d0]">
              Institutional Records
            </span>
            <span className="text-xs text-[#52665a]">
              • {totalStudentsCount} Student Profile{totalStudentsCount === 1 ? '' : 's'}
            </span>
          </div>
          <h2 className="text-2xl font-black text-[#0f172a] tracking-tight mt-1">
            Student Profiles
          </h2>
          <p className="text-xs text-[#52665a] mt-0.5">
            Manage verified student credentials and statutory facts for Central, State, and Institutional scholarship portals.
          </p>
        </div>

        <div className="flex items-center space-x-2 self-start sm:self-auto">
          {totalStudentsCount > 5 && (
            <button
              type="button"
              onClick={onNavigateToAllStudents}
              className="px-3.5 py-2 rounded-xl bg-white border border-[#e2ebe5] hover:bg-slate-50 text-[#0f172a] font-semibold text-xs transition-colors cursor-pointer flex items-center space-x-1.5 shadow-xs"
            >
              <Users className="w-3.5 h-3.5 text-[#52665a]" />
              <span>View All Students ({totalStudentsCount})</span>
            </button>
          )}

          <button
            type="button"
            onClick={onNavigateToAddNew}
            className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-[#047857] hover:bg-[#065f46] text-white text-xs font-bold shadow-sm transition-all cursor-pointer shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add New Student</span>
          </button>
        </div>
      </div>

      {/* SECTION 1: RECENTLY USED STUDENTS (MAX 5) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-[#047857]" />
            <h3 className="text-sm font-bold text-[#0f172a] uppercase tracking-wider">
              Recently Used Students {displayedRecent.length > 0 ? `(Top ${displayedRecent.length})` : ''}
            </h3>
          </div>
          {totalStudentsCount > 5 && (
            <button
              type="button"
              onClick={onNavigateToAllStudents}
              className="text-xs font-semibold text-[#047857] hover:underline flex items-center space-x-1 cursor-pointer"
            >
              <span>View All ({totalStudentsCount})</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          )}
        </div>

        {displayedRecent.length === 0 ? (
          <div className="card-panel p-8 text-center space-y-3 bg-white border border-[#e2ebe5]">
            <GraduationCap className="w-10 h-10 text-[#047857]/60 mx-auto" />
            <h4 className="text-sm font-bold text-[#0f172a]">No students added yet.</h4>
            <p className="text-xs text-[#52665a] max-w-md mx-auto">
              You haven&apos;t added any students yet. Click below to add a student, or explore using the 4 pre-configured demo profiles below.
            </p>
            <button
              type="button"
              onClick={onNavigateToAddNew}
              className="px-4 py-2 rounded-xl bg-[#047857] hover:bg-[#065f46] text-white font-bold text-xs shadow-xs cursor-pointer inline-flex items-center space-x-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add New Student</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {displayedRecent.map((student) => {
              const completion = calculateProfileCompletion(student);
              const isCurrent = currentProfile?.id === student.id || currentProfile?.student_id === student.student_id;

              return (
                <div
                  key={student.id || student.student_id}
                  className={`card-panel p-5 bg-white border transition-all shadow-xs space-y-4 ${
                    isCurrent
                      ? 'border-[#047857] ring-1 ring-[#047857]/20'
                      : 'border-[#e2ebe5] hover:border-[#a7f3d0]'
                  }`}
                >
                  {/* Top Bar: Identity & Last Used */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#e2ebe5]">
                    <div className="flex items-start space-x-3.5">
                      <div className="w-12 h-12 rounded-xl bg-[#ecfdf5] text-[#047857] border border-[#a7f3d0] flex items-center justify-center font-black text-base shrink-0">
                        {student.applicant_name ? student.applicant_name[0].toUpperCase() : 'S'}
                      </div>
                      <div>
                        <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                          <h4 className="text-base font-black text-[#0f172a]">
                            {student.applicant_name}
                          </h4>
                          {isCurrent && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#047857] text-white">
                              CURRENTLY SELECTED
                            </span>
                          )}
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#ecfdf5] text-[#047857] border border-[#a7f3d0]">
                            ACTIVE STUDENT
                          </span>
                        </div>
                        <p className="text-xs text-[#52665a] mt-0.5">
                          USN:{' '}
                          <span className="font-mono font-bold text-[#0f172a]">
                            {student.student_id || 'Not Assigned'}
                          </span>{' '}
                          • <span className="font-semibold text-[#0f172a]">{student.institution_name || 'Not Specified'}</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center sm:flex-col sm:items-end justify-between gap-1 text-xs">
                      <div className="text-[11px] text-[#52665a] flex items-center space-x-1">
                        <Clock className="w-3 h-3 text-[#52665a]" />
                        <span>Last used: <strong className="text-[#047857]">{formatLastUsed(student.last_used)}</strong></span>
                      </div>
                      {/* Profile completion bar */}
                      <div className="flex items-center space-x-2">
                        <div className="w-20 h-1.5 rounded-full bg-slate-200 overflow-hidden">
                          <div
                            className="h-full bg-[#059669] rounded-full transition-all"
                            style={{ width: `${completion}%` }}
                          />
                        </div>
                        <span className="text-[10px] font-bold text-[#047857]">{completion}% Complete</span>
                      </div>
                    </div>
                  </div>

                  {/* Attributes Matrix */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div className="p-3 rounded-xl bg-[#f4f8f5]/80 border border-[#e2ebe5]">
                      <p className="text-[10px] font-bold text-[#52665a] uppercase tracking-wider">Course & Year</p>
                      <p className="font-bold text-[#0f172a] mt-0.5 truncate">{student.course_name || 'B.E.'}</p>
                      <p className="text-[10px] text-[#52665a] mt-0.5">
                        {student.year_of_study || '2nd Year'} • {student.semester || '4th Sem'}
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-[#f4f8f5]/80 border border-[#e2ebe5]">
                      <p className="text-[10px] font-bold text-[#52665a] uppercase tracking-wider">Academic Performance</p>
                      <p className="font-black text-[#047857] mt-0.5">{student.academic_percentage}% Aggregate</p>
                      <p className="text-[10px] text-[#52665a] mt-0.5">
                        {student.cgpa ? `CGPA: ${student.cgpa}` : 'Qualifying Standard'}
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-[#f4f8f5]/80 border border-[#e2ebe5]">
                      <p className="text-[10px] font-bold text-[#52665a] uppercase tracking-wider">Category & Income</p>
                      <p className="font-bold text-[#0f172a] mt-0.5">{student.social_category} Category</p>
                      <p className="text-[10px] text-[#52665a] mt-0.5">
                        ₹{Number(student.annual_family_income || 0).toLocaleString('en-IN')}/yr
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-[#f4f8f5]/80 border border-[#e2ebe5]">
                      <p className="text-[10px] font-bold text-[#52665a] uppercase tracking-wider">Domicile & KYC</p>
                      <p className="font-bold text-[#0f172a] mt-0.5">{student.domicile_state || 'Karnataka'}</p>
                      <p className="text-[10px] text-[#52665a] mt-0.5">
                        Aadhaar: {student.aadhaar_present ? '✓ KYC' : 'Pending'} • DBT: {student.bank_account_present ? '✓' : '✗'}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#e2ebe5]">
                    <div className="flex items-center space-x-2">
                      <button
                        type="button"
                        onClick={() => onSelectStudent(student)}
                        className={`px-3 py-1.5 rounded-xl border text-xs font-semibold transition-colors cursor-pointer flex items-center space-x-1 ${
                          currentProfile?.student_id === student.student_id
                            ? 'bg-[#ecfdf5] border-[#a7f3d0] text-[#047857]'
                            : 'bg-white border-[#e2ebe5] hover:bg-[#ecfdf5] hover:border-[#a7f3d0] text-[#047857]'
                        }`}
                        title="Set as Active Student"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>{currentProfile?.student_id === student.student_id ? 'Active' : 'Select'}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => onEditStudent(student)}
                        className="px-3.5 py-1.5 rounded-xl bg-white border border-[#e2ebe5] hover:bg-slate-50 text-[#0f172a] font-semibold text-xs transition-colors cursor-pointer shadow-xs"
                      >
                        View / Edit Profile
                      </button>
                      <button
                        type="button"
                        onClick={() => onGenerateReport(student)}
                        className="px-3.5 py-1.5 rounded-xl bg-white border border-[#e2ebe5] hover:bg-slate-50 text-[#0f172a] font-semibold text-xs transition-colors cursor-pointer flex items-center space-x-1.5 shadow-xs"
                      >
                        <FileText className="w-3.5 h-3.5 text-[#52665a]" />
                        <span>Generate Report</span>
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => onCheckEligibility(student)}
                      className="px-4 py-1.5 rounded-xl bg-[#047857] hover:bg-[#065f46] text-white font-bold text-xs shadow-xs transition-all cursor-pointer flex items-center space-x-1.5"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Check Eligibility & Matches</span>
                      <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* SECTION 2: DEMO STUDENT PROFILES (4 EXACT GHOUSIA PERSONAS) */}
      <div className="card-panel overflow-hidden border border-[#e2ebe5] bg-white shadow-xs">
        <button
          type="button"
          onClick={() => setDemoExpanded(!demoExpanded)}
          className="w-full px-5 py-4 flex items-center justify-between bg-[#f4f8f5]/60 hover:bg-[#f4f8f5] transition-colors cursor-pointer text-left"
        >
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#0f172a]">
                Demo Student Profiles
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-900 border border-amber-300">
                4 DEMO PROFILES (Ghousia College Of Engineering)
              </span>
            </div>
            <p className="text-xs text-[#52665a] mt-0.5">
              Reference sample profiles demonstrating statutory matching rules. These do not count toward Recently Used Students.
            </p>
          </div>
          <div className="text-[#52665a] text-xs font-semibold flex items-center space-x-1">
            <span>{demoExpanded ? 'Collapse' : 'Expand'}</span>
            <ChevronDown
              className={`w-4 h-4 transition-transform duration-200 ${
                demoExpanded ? 'rotate-180' : ''
              }`}
            />
          </div>
        </button>

        {demoExpanded && (
          <div className="p-5 border-t border-[#e2ebe5] bg-white space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {DEMO_PERSONAS.map((persona) => {
                const p = persona.profile;
                const completion = calculateProfileCompletion(p);

                return (
                  <div
                    key={persona.id}
                    className="p-5 rounded-2xl border border-[#e2ebe5] bg-[#fdfefe] hover:border-[#a7f3d0] transition-all flex flex-col justify-between space-y-4 shadow-xs"
                  >
                    {/* Header with clear DEMO PROFILE label */}
                    <div className="flex items-start justify-between gap-2 pb-3 border-b border-[#e2ebe5]">
                      <div className="flex items-start space-x-3">
                        <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-800 border border-amber-200 flex items-center justify-center font-black text-sm shrink-0">
                          {p.applicant_name[0]}
                        </div>
                        <div>
                          <div className="flex items-center space-x-2 flex-wrap">
                            <h4 className="text-sm font-black text-[#0f172a]">{p.applicant_name}</h4>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300">
                              DEMO PROFILE
                            </span>
                          </div>
                          <p className="text-[11px] text-[#52665a] mt-0.5 font-mono">
                            USN: <strong className="text-[#0f172a]">{p.student_id}</strong> • Ghousia College Of Engineering
                          </p>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-[10px] text-[#52665a] block">Completion</span>
                        <span className="text-xs font-bold text-[#047857]">{completion}%</span>
                      </div>
                    </div>

                    {/* Attributes */}
                    <div className="grid grid-cols-2 gap-2 text-[11px] p-2.5 rounded-xl bg-[#f4f8f5]/60 border border-[#e2ebe5]">
                      <div>
                        <span className="text-[10px] font-bold text-[#52665a] uppercase block">Course & Year</span>
                        <p className="font-semibold text-[#0f172a] truncate">{p.course_name}</p>
                        <p className="text-[10px] text-[#52665a]">{p.year_of_study}</p>
                      </div>

                      <div>
                        <span className="text-[10px] font-bold text-[#52665a] uppercase block">Academic Merit</span>
                        <p className="font-bold text-[#047857]">{p.academic_percentage}% Aggregate</p>
                        <p className="text-[10px] text-[#52665a]">CGPA: {p.cgpa || '8.0'}</p>
                      </div>

                      <div>
                        <span className="text-[10px] font-bold text-[#52665a] uppercase block">Category & Income</span>
                        <p className="font-semibold text-[#0f172a]">{p.social_category}</p>
                        <p className="text-[10px] text-[#52665a]">₹{p.annual_family_income.toLocaleString('en-IN')}</p>
                      </div>

                      <div>
                        <span className="text-[10px] font-bold text-[#52665a] uppercase block">Domicile & Special</span>
                        <p className="font-semibold text-[#0f172a]">{p.domicile_state}</p>
                        <p className="text-[10px] text-[#52665a] truncate">
                          {p.disability_status ? 'PwD 40%+' : p.social_category}
                        </p>
                      </div>
                    </div>

                    {/* Actions: View/Edit, Check Eligibility, Generate Report */}
                    <div className="flex items-center justify-between gap-2 pt-2 border-t border-[#e2ebe5]">
                      <div className="flex items-center space-x-1.5">
                        <button
                          type="button"
                          onClick={() => onSelectStudent(p)}
                          className={`px-2 py-1.5 rounded-lg border text-[11px] font-semibold transition-colors cursor-pointer flex items-center space-x-1 ${
                            currentProfile?.student_id === p.student_id
                              ? 'bg-[#ecfdf5] border-[#a7f3d0] text-[#047857]'
                              : 'bg-white border-[#e2ebe5] hover:bg-[#ecfdf5] hover:border-[#a7f3d0] text-[#047857]'
                          }`}
                          title="Set as Active Student"
                        >
                          <Check className="w-3 h-3" />
                          <span>{currentProfile?.student_id === p.student_id ? 'Active' : 'Select'}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => onEditStudent(p)}
                          className="px-2.5 py-1.5 rounded-lg bg-white border border-[#e2ebe5] hover:bg-slate-50 text-[#0f172a] font-semibold text-[11px] cursor-pointer"
                        >
                          View / Edit Profile
                        </button>
                        <button
                          type="button"
                          onClick={() => onGenerateReport(p)}
                          className="px-2.5 py-1.5 rounded-lg bg-white border border-[#e2ebe5] hover:bg-slate-50 text-[#0f172a] font-semibold text-[11px] cursor-pointer flex items-center space-x-1"
                        >
                          <FileText className="w-3 h-3 text-[#52665a]" />
                          <span>Generate Report</span>
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => onCheckEligibility(p)}
                        className="px-3 py-1.5 rounded-lg bg-[#047857] hover:bg-[#065f46] text-white font-bold text-[11px] shadow-xs cursor-pointer flex items-center space-x-1"
                      >
                        <Sparkles className="w-3 h-3" />
                        <span>Check Eligibility & Matches</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
