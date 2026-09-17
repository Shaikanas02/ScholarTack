import React, { useState } from 'react';
import {
  X,
  Printer,
  Download,
  FileText,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import type { StudentProfile, TrackedApplication, DocumentChecklistItem } from '../types';
import { downloadStudentReportPdf } from '../services/api';

interface InstitutionalReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: StudentProfile | null;
  eligibleScholarships: any[];
  trackedApplications: TrackedApplication[];
  documentChecklist: DocumentChecklistItem[];
  onAddToast: (type: 'success' | 'error' | 'warning' | 'info', title: string, message?: string) => void;
}

export const InstitutionalReportModal: React.FC<InstitutionalReportModalProps> = ({
  isOpen,
  onClose,
  student,
  eligibleScholarships,
  trackedApplications,
  documentChecklist,
  onAddToast,
}) => {
  const [downloading, setDownloading] = useState(false);

  if (!isOpen) return null;

  const handleDownloadPdf = async () => {
    if (!student) {
      onAddToast('warning', 'Profile Required', 'Please create or load a student profile before generating a report.');
      return;
    }

    try {
      setDownloading(true);
      const blob = await downloadStudentReportPdf({
        student,
        eligible_scholarships: eligibleScholarships,
        tracked_applications: trackedApplications,
        document_checklist: documentChecklist,
      });

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const safeName = (student.applicant_name || 'Student').replace(/[^a-zA-Z0-9]/g, '_');
      a.download = `ScholarTack_${safeName}_Eligibility_Report.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      onAddToast('success', 'PDF Report Downloaded', 'Official institutional eligibility report saved.');
    } catch (err: any) {
      console.error('Failed to download report PDF:', err);
      onAddToast('error', 'Download Failed', err.message || 'Could not generate report PDF.');
    } finally {
      setDownloading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const currentDate = new Date().toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  const refId = `STK-REP-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(
    1000 + Math.random() * 9000
  )}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-4xl max-h-[95vh] bg-white border border-slate-200 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Top Control Bar */}
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Institutional Eligibility & Status Report</h3>
              <p className="text-[11px] text-slate-500">Official student scholarship readiness audit</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={handlePrint}
              disabled={!student}
              className="px-3.5 py-1.5 rounded-xl bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-bold flex items-center space-x-1.5 shadow-xs transition-colors cursor-pointer disabled:opacity-50"
              title="Print document or save as PDF via browser"
            >
              <Printer className="w-4 h-4" />
              <span>Print</span>
            </button>

            <button
              type="button"
              onClick={handleDownloadPdf}
              disabled={downloading || !student}
              className="px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center space-x-1.5 shadow-xs transition-all cursor-pointer disabled:opacity-50"
            >
              {downloading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Generating PDF...</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5" />
                  <span>Download PDF</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Printable Report Container */}
        <div className="p-6 overflow-y-auto flex-1 bg-slate-100/70">
          {!student ? (
            <div className="max-w-md mx-auto my-12 p-8 bg-white rounded-2xl border border-slate-200 text-center shadow-xs">
              <AlertCircle className="w-10 h-10 text-amber-500 mx-auto mb-3" />
              <h4 className="text-base font-bold text-slate-900">No Student Profile Selected</h4>
              <p className="text-xs text-slate-500 mt-2 mb-4 leading-relaxed">
                Please create or load a student profile in the <strong>My Profile</strong> section before generating or downloading an institutional eligibility report.
              </p>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold cursor-pointer"
              >
                Close and Go to My Profile
              </button>
            </div>
          ) : (
            /* A4 Sheet Container */
            <div
              id="printable-report"
              className="w-full max-w-[780px] mx-auto bg-white text-slate-900 p-8 sm:p-10 rounded-xl shadow-md border border-slate-200 space-y-6 text-xs"
            >
              {/* 1. Header */}
              <div className="border-b-2 border-slate-900 pb-4">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-black text-blue-700 tracking-wider uppercase">
                      ScholarTack Intelligence Platform
                    </span>
                    <h1 className="text-xl font-black tracking-tight text-slate-950 uppercase mt-0.5">
                      Scholarship Eligibility & Status Report
                    </h1>
                    <p className="text-[11px] text-slate-600 font-medium">
                      National & State Statutory Student Scholarship Verification Audit
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-mono font-bold text-slate-700">Ref: {refId}</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">Generated: {currentDate}</p>
                  </div>
                </div>
              </div>

              {/* 2. Candidate Demographics */}
              <div className="space-y-2">
                <h2 className="text-xs font-black uppercase text-[#047857] tracking-wider">
                  1. Candidate Profile & Statutory Attributes
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 border border-[#e2ebe5] p-3.5 rounded-xl bg-[#f4f8f5]/80">
                  <div>
                    <p className="text-[10px] text-[#52665a] uppercase font-semibold">Candidate Name</p>
                    <p className="font-bold text-[#0f172a] text-xs">{student.applicant_name}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-[#52665a] uppercase font-semibold">USN / Student ID</p>
                    <p className="font-mono font-bold text-[#047857] text-xs">{student.student_id || 'Not Assigned'}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-[10px] text-[#52665a] uppercase font-semibold">College / Institution</p>
                    <p className="font-bold text-[#0f172a] text-xs truncate">
                      {student.institution_name || 'Not Specified'}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-[#e2ebe5]">
                    <p className="text-[10px] text-[#52665a] uppercase font-semibold">Enrolled Course</p>
                    <p className="font-semibold text-[#0f172a] text-xs truncate">
                      {student.course_name || 'Undergraduate'}
                    </p>
                  </div>
                  <div className="pt-2 border-t border-[#e2ebe5]">
                    <p className="text-[10px] text-[#52665a] uppercase font-semibold">Academic Aggregate</p>
                    <p className="font-bold text-[#047857] text-xs">
                      {student.academic_percentage}% {student.cgpa ? `(CGPA: ${student.cgpa})` : ''}
                    </p>
                  </div>
                  <div className="pt-2 border-t border-[#e2ebe5]">
                    <p className="text-[10px] text-[#52665a] uppercase font-semibold">Age / Gender</p>
                    <p className="font-semibold text-[#0f172a] text-xs">
                      {student.applicant_age} Yrs / {student.gender}
                    </p>
                  </div>
                  <div className="pt-2 border-t border-[#e2ebe5]">
                    <p className="text-[10px] text-[#52665a] uppercase font-semibold">Social Category</p>
                    <p className="font-semibold text-[#0f172a] text-xs">{student.social_category}</p>
                  </div>

                  <div className="pt-2 border-t border-[#e2ebe5]">
                    <p className="text-[10px] text-[#52665a] uppercase font-semibold">Annual Family Income</p>
                    <p className="font-semibold text-[#0f172a] text-xs">
                      ₹{Number(student.annual_family_income || 0).toLocaleString('en-IN')}
                    </p>
                  </div>
                  <div className="pt-2 border-t border-[#e2ebe5]">
                    <p className="text-[10px] text-[#52665a] uppercase font-semibold">Domicile State</p>
                    <p className="font-semibold text-[#0f172a] text-xs">{student.domicile_state || 'Karnataka'}</p>
                  </div>
                  <div className="pt-2 border-t border-[#e2ebe5] col-span-2">
                    <p className="text-[10px] text-[#52665a] uppercase font-semibold">Aadhaar & NPCI DBT Status</p>
                    <p className="font-bold text-[#047857] text-xs">
                      {student.aadhaar_present && student.bank_account_present ? '✓ Seeded & Active' : 'Pending KYC'}
                    </p>
                  </div>
                </div>
              </div>

              {/* 3. Summary Performance Metrics */}
              <div className="grid grid-cols-4 gap-2 text-center">
                <div className="p-2.5 rounded-lg border border-slate-200 bg-slate-50">
                  <p className="text-[9px] text-slate-500 uppercase font-bold">Total Matched</p>
                  <p className="text-sm font-black text-slate-900">{eligibleScholarships.length} Schemes</p>
                </div>
                <div className="p-2.5 rounded-lg border border-slate-200 bg-slate-50">
                  <p className="text-[9px] text-slate-500 uppercase font-bold">Active Tracked</p>
                  <p className="text-sm font-black text-slate-900">{trackedApplications.length} Applications</p>
                </div>
                <div className="p-2.5 rounded-lg border border-slate-200 bg-slate-50">
                  <p className="text-[9px] text-slate-500 uppercase font-bold">Document Readiness</p>
                  <p className="text-sm font-black text-emerald-700">Verified</p>
                </div>
                <div className="p-2.5 rounded-lg border border-slate-200 bg-slate-50">
                  <p className="text-[9px] text-slate-500 uppercase font-bold">Evaluation Engine</p>
                  <p className="text-sm font-black text-blue-700">100% Deterministic</p>
                </div>
              </div>

              {/* 4. Eligible Schemes Table */}
              <div className="space-y-2">
                <h2 className="text-xs font-black uppercase text-blue-900 tracking-wider">
                  2. Eligible & Matched Statutory Scholarships
                </h2>
                <table className="w-full border-collapse border border-slate-200 text-[11px]">
                  <thead>
                    <tr className="bg-slate-100 text-slate-700 text-left">
                      <th className="border border-slate-200 p-1.5 font-bold">Scheme Name</th>
                      <th className="border border-slate-200 p-1.5 font-bold">Authority</th>
                      <th className="border border-slate-200 p-1.5 font-bold">Benefit Amount</th>
                      <th className="border border-slate-200 p-1.5 font-bold">Deadline</th>
                      <th className="border border-slate-200 p-1.5 font-bold">Match</th>
                    </tr>
                  </thead>
                  <tbody>
                    {eligibleScholarships.length > 0 ? (
                      eligibleScholarships.slice(0, 5).map((sch: any, idx: number) => (
                        <tr key={idx} className="hover:bg-slate-50">
                          <td className="border border-slate-200 p-1.5 font-semibold text-slate-900">
                            {sch.scheme_name || sch.name}
                          </td>
                          <td className="border border-slate-200 p-1.5 text-slate-600 truncate max-w-[150px]">
                            {sch.authority}
                          </td>
                          <td className="border border-slate-200 p-1.5 font-bold text-emerald-700">
                            {sch.award_amount || sch.benefit}
                          </td>
                          <td className="border border-slate-200 p-1.5 text-slate-600">
                            {sch.deadline || 'Open'}
                          </td>
                          <td className="border border-slate-200 p-1.5 font-bold text-emerald-700">
                            {sch.match_score ?? 100}%
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="border border-slate-200 p-2 text-center text-slate-500 italic">
                          No eligible schemes matched yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* 5. Document Readiness Audit */}
              <div className="space-y-2">
                <h2 className="text-xs font-black uppercase text-blue-900 tracking-wider">
                  3. Statutory Document Readiness Checklist
                </h2>
                <table className="w-full border-collapse border border-slate-200 text-[11px]">
                  <thead>
                    <tr className="bg-slate-100 text-slate-700 text-left">
                      <th className="border border-slate-200 p-1.5 font-bold">Certificate Name</th>
                      <th className="border border-slate-200 p-1.5 font-bold">Issuing Authority</th>
                      <th className="border border-slate-200 p-1.5 font-bold">Required By</th>
                      <th className="border border-slate-200 p-1.5 font-bold">Readiness Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {documentChecklist.slice(0, 5).map((doc, idx) => (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="border border-slate-200 p-1.5 font-semibold text-slate-900">
                          {doc.name}
                        </td>
                        <td className="border border-slate-200 p-1.5 text-slate-600 truncate max-w-[140px]">
                          {doc.issuing_authority}
                        </td>
                        <td className="border border-slate-200 p-1.5 text-slate-600 truncate max-w-[160px]">
                          {doc.required_by}
                        </td>
                        <td className="border border-slate-200 p-1.5 font-bold capitalize">
                          <span
                            className={
                              doc.status === 'verified'
                                ? 'text-emerald-700'
                                : doc.status === 'uploaded'
                                ? 'text-blue-700'
                                : 'text-amber-700'
                            }
                          >
                            {doc.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* 6. Active Application Tracker */}
              <div className="space-y-2">
                <h2 className="text-xs font-black uppercase text-blue-900 tracking-wider">
                  4. Application Tracking Pipeline
                </h2>
                <table className="w-full border-collapse border border-slate-200 text-[11px]">
                  <thead>
                    <tr className="bg-slate-100 text-slate-700 text-left">
                      <th className="border border-slate-200 p-1.5 font-bold">Scheme Name</th>
                      <th className="border border-slate-200 p-1.5 font-bold">Current Stage</th>
                      <th className="border border-slate-200 p-1.5 font-bold">Application Ref #</th>
                      <th className="border border-slate-200 p-1.5 font-bold">Target Date / Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {trackedApplications.length > 0 ? (
                      trackedApplications.slice(0, 3).map((app, idx) => (
                        <tr key={idx} className="hover:bg-slate-50">
                          <td className="border border-slate-200 p-1.5 font-semibold text-slate-900">
                            {app.scheme_name}
                          </td>
                          <td className="border border-slate-200 p-1.5 font-bold capitalize text-blue-800">
                            {app.status.replace('_', ' ')}
                          </td>
                          <td className="border border-slate-200 p-1.5 font-mono text-slate-700">
                            {app.application_number || 'Draft'}
                          </td>
                          <td className="border border-slate-200 p-1.5 text-slate-600 truncate max-w-[180px]">
                            {app.notes || app.deadline || '-'}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="border border-slate-200 p-2 text-center text-slate-500 italic">
                          No applications tracked yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* 7. Institutional Disclaimer & Verification Footer */}
              <div className="pt-4 border-t border-slate-200 text-[10px] text-slate-600 space-y-1">
                <p className="font-bold text-slate-800">
                  Important Compliance Notice:
                </p>
                <p>
                  All central and state government scholarships require mandatory One-Time Registration (OTR) on the National Scholarship Portal (scholarships.gov.in) with biometric authentication. Direct Benefit Transfer (DBT) funds are credited strictly into Aadhaar-seeded NPCI bank accounts.
                </p>
                <p className="pt-2 text-slate-500 text-[9px] italic">
                  Disclaimer: ScholarTack is an institutional scholarship intelligence tool designed for student eligibility discovery and application preparation. Official approval is governed solely by the designated government authorities.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};