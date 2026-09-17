import React, { useState } from 'react';
import {
  FileText,
  AlertTriangle,
  HelpCircle,
  Cpu,
  BadgeCheck,
  ArrowRight,
  Sparkles,
  Edit2,
  Check,
  X,
  Camera,
} from 'lucide-react';
import type { ConflictItem, HouseholdFacts, Provenance } from '../types';

interface FactsReviewProps {
  facts: HouseholdFacts;
  onResolveConflict: (field: string, resolvedValue: any) => void;
  onProceedToLedger: () => void;
}

export const FactsReview: React.FC<FactsReviewProps> = ({
  facts,
  onResolveConflict,
  onProceedToLedger,
}) => {
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>('');

  const renderProvenanceBadge = (prov: Provenance) => {
    switch (prov) {
      case 'DOCUMENT_PROVEN':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold badge-document-proven">
            <BadgeCheck className="w-3 h-3" /> Document Proven
          </span>
        );
      case 'SELF_DECLARED':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold badge-self-declared">
            <FileText className="w-3 h-3" /> Self Declared
          </span>
        );
      case 'DERIVED':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold badge-derived">
            <Cpu className="w-3 h-3" /> Python Derived
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold badge-unknown">
            <HelpCircle className="w-3 h-3" /> Unknown
          </span>
        );
    }
  };

  const handleStartEdit = (key: string, currentVal: any) => {
    setEditingKey(key);
    setEditValue(currentVal != null ? String(currentVal) : '');
  };

  const handleSaveEdit = (key: string) => {
    let parsed: any = editValue.trim();
    if (key === 'annual_family_income' || key === 'land_holding_acres' || key === 'applicant_age' || key === 'academic_percentage') {
      const num = parseFloat(parsed);
      if (!isNaN(num)) parsed = num;
    } else if (parsed.toLowerCase() === 'true') {
      parsed = true;
    } else if (parsed.toLowerCase() === 'false') {
      parsed = false;
    }

    onResolveConflict(key, parsed);
    setEditingKey(null);
  };

  const factItems = [
    { key: 'applicant_name', label: 'Applicant Name', hindiLabel: 'आवेदक का नाम', field: facts.applicant_name },
    { key: 'applicant_age', label: 'Age', hindiLabel: 'आयु (वर्ष)', field: facts.applicant_age },
    { key: 'social_category', label: 'Caste / Category', hindiLabel: 'सामाजिक वर्ग (SC/ST/OBC)', field: facts.social_category },
    {
      key: 'annual_family_income',
      label: 'Annual Income',
      hindiLabel: 'वार्षिक पारिवारिक आय',
      field: facts.annual_family_income,
      formatter: (v: any) => (v != null ? `₹${Number(v).toLocaleString('en-IN')}` : null),
    },
    {
      key: 'land_holding_acres',
      label: 'Landholding',
      hindiLabel: 'कृषि भूमि (एकड़)',
      field: facts.land_holding_acres,
      formatter: (v: any) => (v != null ? `${v} Acres` : null),
    },
    {
      key: 'is_institutional_landholder',
      label: 'Institutional Landholder',
      hindiLabel: 'संस्थागत भूमि धारक',
      field: facts.is_institutional_landholder,
      formatter: (v: any) => (v != null ? (v ? 'Yes (Excluded)' : 'No (Individual)') : null),
    },
    {
      key: 'is_income_tax_payer',
      label: 'Income Tax Payer',
      hindiLabel: 'आयकर दाता',
      field: facts.is_income_tax_payer,
      formatter: (v: any) => (v != null ? (v ? 'Yes' : 'No') : null),
    },
    {
      key: 'is_post_matric_student',
      label: 'Post-Matric Student',
      hindiLabel: '11वीं/12वीं/कॉलेज छात्र',
      field: facts.is_post_matric_student,
      formatter: (v: any) => (v != null ? (v ? 'Yes' : 'No') : null),
    },
    {
      key: 'is_ug_student',
      label: 'Undergraduate (UG) Student',
      hindiLabel: 'स्नातक छात्र (B.A./B.Sc/B.Tech)',
      field: facts.is_ug_student,
      formatter: (v: any) => (v != null ? (v ? 'Yes' : 'No') : null),
    },
    {
      key: 'academic_percentage',
      label: 'Class 12 / Qualifying Score',
      hindiLabel: '12वीं बोर्ड प्राप्तांक (%)',
      field: facts.academic_percentage,
      formatter: (v: any) => (v != null ? `${v}%` : null),
    },
    {
      key: 'is_availing_other_scholarship',
      label: 'Other Scholarship Active',
      hindiLabel: 'अन्य छात्रवृत्ति सक्रिय',
      field: facts.is_availing_other_scholarship,
      formatter: (v: any) => (v != null ? (v ? 'Yes (Exclusion clause)' : 'No') : null),
    },
    {
      key: 'aadhaar_present',
      label: 'Aadhaar Verification',
      hindiLabel: 'आधार कार्ड संलग्न',
      field: facts.aadhaar_present,
      formatter: (v: any) => (v != null ? (v ? 'Yes (Verified)' : 'No') : null),
    },
    {
      key: 'bank_account_present',
      label: 'Bank DBT Seeding',
      hindiLabel: 'बैंक खाता DBT सीडेड',
      field: facts.bank_account_present,
      formatter: (v: any) => (v != null ? (v ? 'Yes (Active)' : 'No') : null),
    },
  ];

  const unclearDocs = facts.documents?.filter((d: any) => !!d.retake_hint) || [];

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-blue-600" />
            <h2 className="text-base font-bold text-slate-900">
              Extracted Facts & Provenance Ledger
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Review the exact statutory facts extracted from your documents before deterministic rules are evaluated.
          </p>
        </div>

        <button
          type="button"
          onClick={onProceedToLedger}
          className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-all cursor-pointer"
        >
          <span>Evaluate Proof Ledger</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Unclear Documents Alert */}
      {unclearDocs.length > 0 && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 space-y-2">
          <div className="flex items-center space-x-2 text-amber-800 font-bold text-xs">
            <Camera className="w-4 h-4" />
            <span>Unclear / Unclassified Document Alert</span>
          </div>
          {unclearDocs.map((doc) => (
            <div key={doc.document_id} className="text-xs text-slate-700">
              <span className="font-semibold text-slate-900">{doc.document_name}: </span>
              <span className="text-amber-800">{doc.retake_hint || 'Document photo was too unclear or blurry to read. Please upload a clear scan.'}</span>
            </div>
          ))}
        </div>
      )}

      {/* Conflict Resolution Alert */}
      {facts.conflicts && facts.conflicts.length > 0 && (
        <div className="p-5 rounded-2xl bg-amber-50 border-2 border-amber-300 shadow-xs space-y-4">
          <div className="flex items-start space-x-3">
            <div className="w-9 h-9 rounded-xl bg-amber-100 border border-amber-300 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-amber-900">
                Conflicting Information Detected (विरोधाभासी जानकारी)
              </h3>
              <p className="text-xs text-slate-600 mt-1">
                ScholarTack does not silently guess between conflicting values. Please confirm which value reflects your official household status:
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {facts.conflicts.map((conflict: ConflictItem) => (
              <div
                key={conflict.field}
                className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    {conflict.label}
                  </span>
                  <span className="text-[11px] text-amber-700 font-semibold">
                    Confirmation Required
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {/* Option 1: Statement */}
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] text-slate-500 font-semibold block uppercase">
                        Your Statement in Narrative:
                      </span>
                      <p className="text-sm font-bold text-slate-900 mt-1">
                        ₹{Number(conflict.narrative_value).toLocaleString('en-IN')}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => onResolveConflict(conflict.field, conflict.narrative_value)}
                      className="mt-3 w-full py-1.5 px-3 rounded-lg bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-300 transition-colors cursor-pointer shadow-xs"
                    >
                      Use Statement Value
                    </button>
                  </div>

                  {/* Option 2: Document Proof */}
                  <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] text-emerald-800 font-semibold block uppercase">
                        Official Document Proof ({conflict.document_type}):
                      </span>
                      <p className="text-sm font-bold text-emerald-900 mt-1">
                        ₹{Number(conflict.document_value).toLocaleString('en-IN')}
                      </p>
                      {conflict.verbatim_snippet && (
                        <p className="text-[10px] text-slate-600 mt-1 italic">
                          "{conflict.verbatim_snippet}"
                        </p>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => onResolveConflict(conflict.field, conflict.document_value)}
                      className="mt-3 w-full py-1.5 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors cursor-pointer shadow-xs"
                    >
                      Confirm Document Value (Recommended)
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Extracted Facts Grid with Inline Edit Support */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {factItems.map(({ key, label, hindiLabel, field, formatter }) => {
          const val = field?.raw_value;
          const prov = field?.provenance || 'UNKNOWN';
          const displayVal = formatter ? formatter(val) : val;
          const isEditing = editingKey === key;

          return (
            <div
              key={key}
              className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs hover:border-blue-300 transition-all flex flex-col justify-between group relative"
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <div>
                    <span className="text-xs font-bold text-slate-800">{label}</span>
                    <span className="text-[10px] text-slate-400 block">{hindiLabel}</span>
                  </div>
                  {renderProvenanceBadge(prov)}
                </div>

                {isEditing ? (
                  <div className="my-2 space-y-2">
                    <input
                      type="text"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-blue-500 text-xs text-slate-900 focus:outline-none"
                      autoFocus
                    />
                    <div className="flex items-center space-x-1.5">
                      <button
                        type="button"
                        onClick={() => handleSaveEdit(key)}
                        className="flex items-center space-x-1 px-2.5 py-1 rounded-md bg-blue-600 text-white font-bold text-[11px] cursor-pointer"
                      >
                        <Check className="w-3 h-3" />
                        <span>Save</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingKey(null)}
                        className="flex items-center space-x-1 px-2 py-1 rounded-md bg-slate-100 text-slate-600 hover:text-slate-900 text-[11px] cursor-pointer border border-slate-200"
                      >
                        <X className="w-3 h-3" />
                        <span>Cancel</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="my-1 flex items-center justify-between">
                    <p className="text-base font-black text-slate-900">
                      {displayVal != null ? String(displayVal) : <span className="text-slate-400 font-normal text-xs">Not detected</span>}
                    </p>
                    <button
                      type="button"
                      onClick={() => handleStartEdit(key, val)}
                      className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-opacity cursor-pointer"
                      title="Edit this fact"
                    >
                      <Edit2 className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>

              {field?.verbatim_snippet && (
                <div className="mt-3 pt-2.5 border-t border-slate-100 text-[11px] text-slate-500">
                  <p className="line-clamp-2 italic">
                    "{field.verbatim_snippet}"
                  </p>
                  {field.source_image_id && (
                    <span className="text-[10px] text-blue-600 font-medium block mt-1">
                      Evidence doc: {field.source_image_id}
                    </span>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};