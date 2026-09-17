import React, { useState, useMemo } from 'react';
import {
  Search,
  User,
  Sparkles,
  FileText,
  Plus,
  ArrowLeft,
  Clock,
  Trash2,
  Check,
} from 'lucide-react';
import type { StudentProfile } from '../types';
import { calculateProfileCompletion } from './StudentProfileWizard';

interface AllStudentsViewProps {
  students: StudentProfile[];
  onSelectStudent: (student: StudentProfile) => void;
  onEditStudent: (student: StudentProfile) => void;
  onCheckEligibility: (student: StudentProfile) => void;
  onGenerateReport: (student: StudentProfile) => void;
  onDeleteStudent?: (studentId: string) => void;
  onNavigateToAddNew: () => void;
  onBackToRecent: () => void;
}

export const AllStudentsView: React.FC<AllStudentsViewProps> = ({
  students,
  onSelectStudent,
  onEditStudent,
  onCheckEligibility,
  onGenerateReport,
  onDeleteStudent,
  onNavigateToAddNew,
  onBackToRecent,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');

  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      if (categoryFilter !== 'ALL' && s.social_category !== categoryFilter) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          s.applicant_name.toLowerCase().includes(q) ||
          (s.student_id || '').toLowerCase().includes(q) ||
          (s.institution_name || '').toLowerCase().includes(q) ||
          (s.course_name || '').toLowerCase().includes(q) ||
          (s.branch || '').toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [students, searchQuery, categoryFilter]);

  const formatLastUsed = (dateStr?: string) => {
    if (!dateStr) return 'Not used yet';
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

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* Top Breadcrumb & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#e2ebe5]">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={onBackToRecent}
              className="inline-flex items-center space-x-1 text-xs font-semibold text-[#52665a] hover:text-[#047857] transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Recently Used</span>
            </button>
            <span className="text-[#cbd5e1]">/</span>
            <span className="text-xs font-bold text-[#047857] bg-[#ecfdf5] px-2 py-0.5 rounded border border-[#a7f3d0]">
              /students/all
            </span>
          </div>
          <h2 className="text-2xl font-black text-[#0f172a] tracking-tight">
            All Student Profiles ({students.length})
          </h2>
          <p className="text-xs text-[#52665a]">
            Complete institutional roster of registered students and their statutory verification statuses.
          </p>
        </div>

        <button
          type="button"
          onClick={onNavigateToAddNew}
          className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-[#047857] hover:bg-[#065f46] text-white text-xs font-bold shadow-sm transition-all cursor-pointer shrink-0 self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add New Student</span>
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="card-panel p-4 bg-white border border-[#e2ebe5] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#52665a] absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, USN, branch, college..."
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#e2ebe5] bg-[#f9fbf9] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#047857]/30 text-xs text-[#0f172a]"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <span className="text-xs font-semibold text-[#52665a] shrink-0">Category:</span>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-[#e2ebe5] bg-white text-xs font-medium text-[#0f172a] focus:outline-none focus:ring-2 focus:ring-[#047857]/30"
          >
            <option value="ALL">All Categories</option>
            <option value="General">General</option>
            <option value="OBC">OBC</option>
            <option value="SC">SC</option>
            <option value="ST">ST</option>
            <option value="EWS">EWS</option>
          </select>
        </div>
      </div>

      {/* Roster Grid */}
      {filteredStudents.length === 0 ? (
        <div className="card-panel p-12 text-center space-y-3 bg-white border border-[#e2ebe5]">
          <User className="w-10 h-10 text-[#52665a] mx-auto opacity-50" />
          <h3 className="text-sm font-bold text-[#0f172a]">No students match your search</h3>
          <p className="text-xs text-[#52665a]">Try adjusting your search query or category filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredStudents.map((student) => {
            const completion = calculateProfileCompletion(student);
            return (
              <div
                key={student.id || student.student_id || student.applicant_name}
                className="card-panel p-5 bg-white border border-[#e2ebe5] hover:border-[#a7f3d0] transition-all shadow-xs flex flex-col justify-between space-y-4"
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-[#ecfdf5] text-[#047857] border border-[#a7f3d0] flex items-center justify-center font-black text-sm shrink-0">
                      {student.applicant_name ? student.applicant_name[0].toUpperCase() : 'S'}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2 flex-wrap">
                        <h4 className="text-sm font-black text-[#0f172a]">{student.applicant_name}</h4>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#ecfdf5] text-[#047857] border border-[#a7f3d0]">
                          ACTIVE STUDENT
                        </span>
                      </div>
                      <p className="text-[11px] text-[#52665a] mt-0.5 font-mono">
                        USN: <span className="font-semibold text-[#0f172a]">{student.student_id || 'N/A'}</span> •{' '}
                        {student.institution_name || 'Not Specified'}
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-[10px] text-[#52665a] block">Last used</span>
                    <span className="text-xs font-semibold text-[#047857] flex items-center justify-end space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>{formatLastUsed(student.last_used)}</span>
                    </span>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] p-3 rounded-xl bg-[#f4f8f5]/60 border border-[#e2ebe5]">
                  <div>
                    <span className="text-[10px] font-bold text-[#52665a] uppercase block">Course & Year</span>
                    <p className="font-semibold text-[#0f172a] truncate">{student.course_name || 'B.E.'}</p>
                    <p className="text-[#52665a] text-[10px]">{student.year_of_study || '2nd Year'}</p>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold text-[#52665a] uppercase block">Merit Score</span>
                    <p className="font-black text-[#047857]">{student.academic_percentage}%</p>
                    <p className="text-[#52665a] text-[10px]">{student.cgpa ? `CGPA: ${student.cgpa}` : 'Qualifying'}</p>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold text-[#52665a] uppercase block">Category & Income</span>
                    <p className="font-semibold text-[#0f172a]">{student.social_category}</p>
                    <p className="text-[#52665a] text-[10px]">
                      ₹{Number(student.annual_family_income || 0).toLocaleString('en-IN')}
                    </p>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold text-[#52665a] uppercase block">Domicile</span>
                    <p className="font-semibold text-[#0f172a]">{student.domicile_state || 'Karnataka'}</p>
                    <p className="text-[#52665a] text-[10px]">{student.district || 'Ramanagara'}</p>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[10px] text-[#52665a]">
                    <span>Profile Completion</span>
                    <span className="font-bold text-[#047857]">{completion}%</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-200 overflow-hidden">
                    <div
                      className="h-full bg-[#059669] rounded-full transition-all"
                      style={{ width: `${completion}%` }}
                    />
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between gap-2 pt-2 border-t border-[#e2ebe5]">
                  <div className="flex items-center space-x-1.5">
                    <button
                      type="button"
                      onClick={() => onSelectStudent(student)}
                      className="px-2 py-1.5 rounded-lg bg-white border border-[#e2ebe5] hover:bg-[#ecfdf5] hover:border-[#a7f3d0] text-[#047857] font-semibold text-[11px] cursor-pointer flex items-center space-x-1"
                      title="Set as Active Student"
                    >
                      <Check className="w-3 h-3" />
                      <span>Select</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => onEditStudent(student)}
                      className="px-2.5 py-1.5 rounded-lg bg-white border border-[#e2ebe5] hover:bg-slate-50 text-[#0f172a] font-semibold text-[11px] cursor-pointer"
                    >
                      View / Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => onGenerateReport(student)}
                      className="px-2.5 py-1.5 rounded-lg bg-white border border-[#e2ebe5] hover:bg-slate-50 text-[#0f172a] font-semibold text-[11px] cursor-pointer flex items-center space-x-1"
                    >
                      <FileText className="w-3 h-3 text-[#52665a]" />
                      <span>Report</span>
                    </button>
                    {onDeleteStudent && student.id && (
                      <button
                        type="button"
                        onClick={() => onDeleteStudent(student.id!)}
                        className="p-1.5 rounded-lg hover:bg-rose-50 text-[#52665a] hover:text-rose-600 transition-colors cursor-pointer"
                        title="Delete Profile"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => onCheckEligibility(student)}
                    className="px-3.5 py-1.5 rounded-lg bg-[#047857] hover:bg-[#065f46] text-white font-bold text-[11px] shadow-xs cursor-pointer flex items-center space-x-1"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>Check Matches</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
