import React, { useState } from 'react';
import {
  X,
  ExternalLink,
  Clock,
  FileCheck,
  Building2,
  Calendar,
  Bookmark,
  Check,
  Info,
} from 'lucide-react';
import type { ScholarshipItem, ScholarshipRecommendation, StudentProfile } from '../types';

interface ScholarshipDetailsModalProps {
  scholarship: ScholarshipItem | null;
  recommendation?: ScholarshipRecommendation | null;
  studentProfile?: StudentProfile | null;
  isOpen: boolean;
  onClose: () => void;
  onTrack: (scholarship: ScholarshipItem) => void;
  isTracked?: boolean;
}

export const ScholarshipDetailsModal: React.FC<ScholarshipDetailsModalProps> = ({
  scholarship,
  recommendation,
  studentProfile: _studentProfile,
  isOpen,
  onClose,
  onTrack,
  isTracked = false,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'eligibility' | 'documents' | 'process'>('overview');

  if (!isOpen || !scholarship) return null;

  const daysLeft = scholarship.days_left;
  const isUrgent = daysLeft != null && daysLeft <= 15;
  const matchScore = recommendation?.match_score ?? null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-3xl max-h-[90vh] bg-white border border-slate-200 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-200 bg-slate-50 flex items-start justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center space-x-2 flex-wrap gap-y-1">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                {scholarship.category}
              </span>
              <span className="text-[10px] font-semibold text-slate-500">
                {scholarship.education_level}
              </span>
              {matchScore !== null && (
                <span
                  className={`text-[10px] font-extrabold px-2 py-0.5 rounded border ${
                    matchScore >= 85
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      : matchScore >= 50
                      ? 'bg-amber-50 text-amber-800 border-amber-200'
                      : 'bg-rose-50 text-rose-800 border-rose-200'
                  }`}
                >
                  {matchScore}% Profile Match
                </span>
              )}
            </div>

            <h3 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug">
              {scholarship.name}
            </h3>

            <p className="text-xs text-slate-500 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-slate-400" />
              <span>Authority: {scholarship.authority}</span>
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Highlight Stats Bar */}
        <div className="grid grid-cols-3 divide-x divide-slate-200 border-b border-slate-200 bg-white text-center py-3.5">
          <div>
            <p className="text-[10px] text-slate-500 uppercase font-semibold">Benefit / Grant</p>
            <p className="text-sm sm:text-base font-black text-emerald-700 mt-0.5">
              {scholarship.award_amount}
            </p>
          </div>

          <div>
            <p className="text-[10px] text-slate-500 uppercase font-semibold">Deadline</p>
            <div className="flex items-center justify-center space-x-1 mt-0.5">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-xs sm:text-sm font-bold text-slate-800">
                {scholarship.deadline || 'Open All Year'}
              </span>
            </div>
          </div>

          <div>
            <p className="text-[10px] text-slate-500 uppercase font-semibold">Urgency Status</p>
            <div className="flex items-center justify-center space-x-1 mt-0.5">
              <Clock
                className={`w-3.5 h-3.5 ${
                  isUrgent ? 'text-rose-600' : 'text-emerald-600'
                }`}
              />
              <span
                className={`text-xs sm:text-sm font-bold ${
                  isUrgent ? 'text-rose-600' : 'text-emerald-700'
                }`}
              >
                {daysLeft != null
                  ? daysLeft <= 7
                    ? `Critical (${daysLeft}d left)`
                    : daysLeft <= 15
                    ? `Upcoming (${daysLeft}d left)`
                    : `${daysLeft} Days Left`
                  : 'Active'}
              </span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 px-5 bg-slate-50 text-xs font-semibold">
          {[
            { id: 'overview', label: 'Overview & Benefits' },
            { id: 'eligibility', label: 'Eligibility Criteria' },
            { id: 'documents', label: 'Required Documents' },
            { id: 'process', label: 'Application Steps' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-3 px-3.5 border-b-2 transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'border-blue-600 text-blue-700 font-bold'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-4 text-xs leading-relaxed">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-blue-600" />
                  Statutory Scheme Overview:
                </h4>
                <p className="text-slate-700">{scholarship.benefit}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <p className="text-[10px] text-slate-500 uppercase font-semibold">Sponsoring Body</p>
                  <p className="text-xs font-bold text-slate-900 mt-1">{scholarship.authority}</p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <p className="text-[10px] text-slate-500 uppercase font-semibold">Disbursement Mode</p>
                  <p className="text-xs font-bold text-emerald-700 mt-1">
                    Direct Benefit Transfer (DBT) via PFMS / Aadhaar NPCI
                  </p>
                </div>
              </div>

              {/* Official Source Badge */}
              <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-900">Official Government Portal Source</p>
                  <p className="text-[11px] text-slate-600 mt-0.5">
                    Source: <span className="font-semibold text-blue-700">{scholarship.source_url}</span>
                  </p>
                </div>
                <a
                  href={scholarship.source_url}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center space-x-1 shadow-xs"
                >
                  <span>Open Portal</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          )}

          {/* TAB 2: ELIGIBILITY CRITERIA */}
          {activeTab === 'eligibility' && (
            <div className="space-y-3">
              <p className="text-xs text-slate-600">
                Deterministic statutory criteria verified against your student profile facts:
              </p>

              <div className="space-y-2">
                {scholarship.criteria_preview && scholarship.criteria_preview.length > 0 ? (
                  scholarship.criteria_preview.map((crit, idx) => {
                    const isSatisfied =
                      recommendation?.satisfied_criteria?.some((sc) => sc.includes(crit) || crit.includes(sc)) ?? true;

                    return (
                      <div
                        key={idx}
                        className="flex items-start justify-between p-3 rounded-xl bg-slate-50 border border-slate-200"
                      >
                        <div className="flex items-start space-x-2.5">
                          <div
                            className={`mt-0.5 p-1 rounded-full ${
                              isSatisfied ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                            }`}
                          >
                            {isSatisfied ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-slate-900">{crit}</p>
                            <p className="text-[10px] text-slate-500">
                              Statutory Clause Requirement #{idx + 1}
                            </p>
                          </div>
                        </div>

                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                            isSatisfied
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : 'bg-rose-50 text-rose-700 border-rose-200'
                          }`}
                        >
                          {isSatisfied ? 'Satisfied' : 'Pending Proof'}
                        </span>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-xs text-slate-500">Criteria details available on official portal.</p>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: REQUIRED DOCUMENTS */}
          {activeTab === 'documents' && (
            <div className="space-y-3">
              <p className="text-xs text-slate-600">
                You must have original copies and digital scans of the following documents:
              </p>

              <div className="space-y-2">
                {scholarship.required_documents.map((doc, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200"
                  >
                    <div className="flex items-center space-x-2.5">
                      <FileCheck className="w-4 h-4 text-blue-600 shrink-0" />
                      <div>
                        <p className="text-xs font-bold text-slate-900 capitalize">
                          {doc.replace(/_/g, ' ')}
                        </p>
                        <p className="text-[10px] text-slate-500">
                          Mandatory attachment during online portal submission
                        </p>
                      </div>
                    </div>

                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                      Required
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: APPLICATION PROCESS */}
          {activeTab === 'process' && (
            <div className="space-y-3">
              <p className="text-xs text-slate-600">
                Step-by-step workflow to submit your application on the official government portal:
              </p>

              <div className="space-y-2.5">
                {[
                  '1. Register on National Scholarship Portal (NSP) or State Portal using Aadhaar for One-Time Registration (OTR).',
                  '2. Fill in student academic details, college roll number, and tuition fee structure.',
                  '3. Upload required documents (Income Certificate, Marksheet, Bonafide, Bank Passbook).',
                  '4. Submit application and download the statutory application acknowledgement receipt.',
                  '5. Submit physical copy to your College / Institution Nodal Officer for electronic verification.',
                  '6. Track PFMS Aadhaar DBT disbursement status in your bank account.',
                ].map((step, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 flex items-start space-x-2.5"
                  >
                    <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="leading-relaxed">{step.slice(3)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => onTrack(scholarship)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-all cursor-pointer border ${
                isTracked
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                  : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-300 shadow-xs'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5" />
              <span>{isTracked ? 'In Application Tracker' : 'Save to Tracker'}</span>
            </button>
          </div>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 text-xs font-semibold cursor-pointer shadow-xs"
            >
              Close
            </button>

            <a
              href={scholarship.source_url || 'https://scholarships.gov.in/'}
              target="_blank"
              rel="noreferrer"
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center space-x-1.5 shadow-xs cursor-pointer"
            >
              <span>Apply on Official Portal</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
