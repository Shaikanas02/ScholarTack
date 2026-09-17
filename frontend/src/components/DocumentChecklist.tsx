import React, { useState } from 'react';
import {
  FileCheck2,
  CheckCircle2,
  Clock,
  ShieldCheck,
  AlertTriangle,
  Upload,
  FileText,
} from 'lucide-react';
import type { DocumentChecklistItem, DocumentReadinessStatus } from '../types';

export const INITIAL_DOCUMENTS: DocumentChecklistItem[] = [
  {
    id: 'doc-aadhaar',
    name: 'Aadhaar Card (UIDAI)',
    category: 'Identity & OTR KYC',
    status: 'verified',
    required_by: 'All Statutory Schemes (NSP, AICTE Pragati/Saksham, UGC, SSP)',
    description: 'Statutory 12-digit biometric identity document used for One-Time Registration (OTR) on the National Scholarship Portal.',
    issuing_authority: 'Unique Identification Authority of India (UIDAI)',
    tips: 'Ensure your active mobile number is linked for OTP biometric authentication. Name spelling must match marksheet.',
    file_name: 'Aadhaar_Card_Verified.pdf',
    uploaded_at: '2026-09-01',
  },
  {
    id: 'doc-bonafide',
    name: 'College Bonafide / Admission Fee Receipt',
    category: 'Institutional Enrollment',
    status: 'verified',
    required_by: 'AICTE Pragati, AICTE Saksham, UGC Ishan Uday, SSP Karnataka',
    description: 'Endorsement from college Head of Institution (HOI) confirming enrollment in 1st year degree/diploma.',
    issuing_authority: 'College Principal / Dean / Academic Registrar',
    tips: 'Must specify course name, branch, academic year, and whether day scholar or hosteller.',
    file_name: 'College_Bonafide_2026.pdf',
    uploaded_at: '2026-09-05',
  },
  {
    id: 'doc-marksheet',
    name: 'Class 10th & 12th Board Marksheets',
    category: 'Academic Proof & Cutoff',
    status: 'uploaded',
    required_by: 'NSP Central Sector (>=75%), DST INSPIRE (Top 1%), AICTE Schemes',
    description: 'Consolidated passing marksheet proving candidate aggregate percentage meets scholarship threshold.',
    issuing_authority: 'CBSE / CISCE / State Board of School Education',
    tips: 'DigiLocker verified digital copies with QR codes are fully accepted across all government portals.',
    file_name: 'Class12_Marksheet_Scanned.pdf',
    uploaded_at: '2026-09-10',
  },
  {
    id: 'doc-income',
    name: 'Government Family Income Certificate',
    category: 'Financial Means Verification',
    status: 'pending',
    required_by: 'NSP (<= ₹4.5L), Post-Matric SC/ST (<= ₹2.5L), AICTE (<= ₹8.0L)',
    description: 'Official revenue document certifying annual family income from all sources (agriculture, salary, business).',
    issuing_authority: 'Revenue Department / Tahsildar / Sub-Divisional Magistrate (SDM)',
    tips: 'Must be issued within current financial year. Self-declarations alone will be rejected during nodal officer verification.',
  },
  {
    id: 'doc-caste',
    name: 'Caste / Community Certificate (SC / ST / OBC)',
    category: 'Social Category Reservation',
    status: 'required',
    required_by: 'Centrally Sponsored Post-Matric SC, Post-Matric ST, Begum Hazrat Mahal',
    description: 'Official community certificate certifying candidate belongs to Scheduled Caste, Scheduled Tribe, or Minority.',
    issuing_authority: 'Competent Revenue Officer / District Magistrate (DM)',
    tips: 'Ensure caste name matches official central/state gazetted schedule. Check barcode or e-district verification number.',
  },
  {
    id: 'doc-bank',
    name: 'NPCI Aadhaar-Seeded Bank Passbook',
    category: 'Direct Benefit Transfer (DBT)',
    status: 'verified',
    required_by: 'Mandatory for All DBT Schemes (PFMS Disbursal)',
    description: 'Savings bank account linked with Aadhaar and mapped on the National Payments Corporation of India (NPCI) server.',
    issuing_authority: 'Scheduled Commercial Bank / SBI / India Post Payments Bank',
    tips: 'Joint accounts or inactive accounts cause 90% of DBT disbursal failures. Verify NPCI status on UIDAI portal.',
    file_name: 'Bank_Passbook_NPCI_Seeded.pdf',
    uploaded_at: '2026-09-02',
  },
  {
    id: 'doc-disability',
    name: 'UDID / Medical Disability Certificate (if applicable)',
    category: 'Special Quota Verification',
    status: 'required',
    required_by: 'AICTE Saksham Scholarship Scheme (>= 40% disability)',
    description: 'Official certificate from Chief Medical Officer or government hospital certifying 40% or more benchmark disability.',
    issuing_authority: 'Ministry of Social Justice / District Medical Board',
    tips: 'UDID card number can be directly verified electronically on the National Scholarship Portal.',
  },
];

interface DocumentChecklistProps {
  onCheckEligibilityFromDocs?: () => void;
}

export const DocumentChecklist: React.FC<DocumentChecklistProps> = () => {
  const [documents, setDocuments] = useState<DocumentChecklistItem[]>(INITIAL_DOCUMENTS);
  const [selectedFilter, setSelectedFilter] = useState<'all' | DocumentReadinessStatus>('all');

  const handleStatusChange = (id: string, newStatus: DocumentReadinessStatus) => {
    setDocuments((prev) =>
      prev.map((doc) => {
        if (doc.id === id) {
          return {
            ...doc,
            status: newStatus,
            uploaded_at: newStatus !== 'required' ? doc.uploaded_at || new Date().toISOString().split('T')[0] : undefined,
          };
        }
        return doc;
      })
    );
  };

  const handleSimulateUpload = (id: string) => {
    setDocuments((prev) =>
      prev.map((doc) => {
        if (doc.id === id) {
          return {
            ...doc,
            status: 'uploaded',
            file_name: `${doc.name.replace(/[^a-zA-Z0-9]/g, '_')}_Uploaded.pdf`,
            uploaded_at: new Date().toISOString().split('T')[0],
          };
        }
        return doc;
      })
    );
  };

  const total = documents.length;
  const verifiedCount = documents.filter((d) => d.status === 'verified').length;
  const uploadedCount = documents.filter((d) => d.status === 'uploaded').length;
  const pendingCount = documents.filter((d) => d.status === 'pending').length;
  const requiredCount = documents.filter((d) => d.status === 'required').length;

  const readinessScore = Math.round(((verifiedCount * 1.0 + uploadedCount * 0.75 + pendingCount * 0.3) / total) * 100);

  const filteredDocs = documents.filter((d) => {
    if (selectedFilter === 'all') return true;
    return d.status === selectedFilter;
  });

  const getStatusBadge = (status: DocumentReadinessStatus) => {
    switch (status) {
      case 'verified':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3" />
            <span>Verified</span>
          </span>
        );
      case 'uploaded':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
            <Upload className="w-3 h-3" />
            <span>Uploaded</span>
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
            <Clock className="w-3 h-3" />
            <span>Pending Issuance</span>
          </span>
        );
      case 'required':
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
            <AlertTriangle className="w-3 h-3" />
            <span>Action Required</span>
          </span>
        );
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      {/* Header & Readiness Meter */}
      <div className="card-panel p-6 bg-white border border-slate-200 shadow-sm relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 border border-teal-200 flex items-center justify-center font-bold">
                <FileCheck2 className="w-4 h-4" />
              </div>
              <h2 className="text-xl font-black text-slate-900">Document Readiness Checklist</h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Verify your official certificates against statutory scholarship requirements to guarantee zero rejection during nodal verification.
            </p>
          </div>

          {/* Readiness Score Box */}
          <div className="w-full md:w-72 p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="text-slate-600 font-semibold">Document Readiness</span>
              <span className="font-black text-emerald-700 text-sm">{readinessScore}% Ready</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
              <div
                className="h-full rounded-full bg-emerald-500 transition-all duration-500"
                style={{ width: `${readinessScore}%` }}
              />
            </div>
            <p className="text-[10px] text-slate-500 mt-1.5">
              {verifiedCount} Verified • {uploadedCount} Uploaded • {pendingCount} Pending • {requiredCount} Action Required
            </p>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex items-center gap-2 flex-wrap text-xs">
          <span className="text-slate-500 font-semibold mr-1">Filter by Status:</span>
          {(['all', 'verified', 'uploaded', 'pending', 'required'] as const).map((filterKey) => (
            <button
              key={filterKey}
              type="button"
              onClick={() => setSelectedFilter(filterKey)}
              className={`px-3 py-1 rounded-xl font-semibold capitalize transition-all cursor-pointer border ${
                selectedFilter === filterKey
                  ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
              }`}
            >
              {filterKey === 'all' ? 'All Documents' : filterKey}
            </button>
          ))}
        </div>
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredDocs.map((doc) => (
          <div
            key={doc.id}
            className="card-panel p-5 bg-white border border-slate-200 hover:border-slate-300 shadow-sm transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              {/* Header: Title & Status */}
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                    {doc.category}
                  </span>
                  <h3 className="text-base font-bold text-slate-900 mt-1.5">{doc.name}</h3>
                </div>
                <div>{getStatusBadge(doc.status)}</div>
              </div>

              {/* Description */}
              <p className="text-xs text-slate-600 leading-relaxed">{doc.description}</p>

              {/* Scheme Linkage Badge */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <p className="text-[10px] font-bold text-blue-700 uppercase tracking-wider flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Mandatory For Schemes:
                </p>
                <p className="text-xs font-semibold text-slate-800">{doc.required_by}</p>
              </div>

              {/* Authority & Tips */}
              <div className="space-y-1 text-[11px] text-slate-500">
                <p>
                  <span className="font-semibold text-slate-700">Issuing Authority:</span> {doc.issuing_authority}
                </p>
                <p className="italic text-slate-500">
                  <span className="font-semibold not-italic text-slate-700">Statutory Tip:</span> {doc.tips}
                </p>
              </div>

              {/* Attached file if present */}
              {doc.file_name && (
                <div className="flex items-center space-x-2 p-2 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-900">
                  <FileText className="w-3.5 h-3.5 shrink-0 text-emerald-700" />
                  <span className="truncate font-mono text-[11px]">{doc.file_name}</span>
                  {doc.uploaded_at && (
                    <span className="text-[10px] text-slate-500 shrink-0 ml-auto">
                      ({doc.uploaded_at})
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Bottom Actions */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-center space-x-1.5">
                <span className="text-[10px] text-slate-500 font-semibold">Change Status:</span>
                <select
                  value={doc.status}
                  onChange={(e) => handleStatusChange(doc.id, e.target.value as DocumentReadinessStatus)}
                  className="px-2 py-1 rounded-lg bg-white border border-slate-300 text-[11px] text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="required">Required</option>
                  <option value="pending">Pending</option>
                  <option value="uploaded">Uploaded</option>
                  <option value="verified">Verified</option>
                </select>
              </div>

              {doc.status !== 'verified' && (
                <button
                  type="button"
                  onClick={() => handleSimulateUpload(doc.id)}
                  className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-xs font-semibold transition-all cursor-pointer"
                >
                  <Upload className="w-3 h-3" />
                  <span>Attach Scan</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
