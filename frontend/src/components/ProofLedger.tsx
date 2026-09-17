import React, { useState } from 'react';
import {
  CheckCircle2,
  XCircle,
  AlertCircle,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  FileCheck,
  Award,
  ArrowRight,
  Download,
  BadgeAlert,
  ArrowUpRight,
} from 'lucide-react';
import type { CriterionResult, CriterionStatus, SchemeEvaluation, SchemeVerdict } from '../types';

interface ProofLedgerProps {
  evaluations: SchemeEvaluation[];
  onSelectSchemeForAction: (scheme: SchemeEvaluation) => void;
  isDemoData?: boolean;
}

export const ProofLedger: React.FC<ProofLedgerProps> = ({
  evaluations,
  onSelectSchemeForAction,
  isDemoData = false,
}) => {
  const [filter, setFilter] = useState<'ALL' | SchemeVerdict>('ALL');
  const [expandedSchemes, setExpandedSchemes] = useState<Record<string, boolean>>({
    pm_kisan: true,
    post_matric_sc: true,
    pmay_gramin: true,
    nsp_ug_merit: true,
    ssp_post_matric_ug: true,
  });
  const [expandedCriteria, setExpandedCriteria] = useState<Record<string, boolean>>({});

  const toggleExpandScheme = (schemeId: string) => {
    setExpandedSchemes((prev) => ({
      ...prev,
      [schemeId]: !prev[schemeId],
    }));
  };

  const toggleExpandCriterion = (ruleId: string) => {
    setExpandedCriteria((prev) => ({
      ...prev,
      [ruleId]: !prev[ruleId],
    }));
  };

  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(evaluations, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', 'ScholarTack_Proof_Ledger_Audit.json');
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const filtered = evaluations.filter((e) => {
    if (filter === 'ALL') return true;
    return e.verdict === filter;
  });

  const eligibleCount = evaluations.filter((e) => e.verdict === 'ELIGIBLE').length;
  const incompleteCount = evaluations.filter((e) => e.verdict === 'INCOMPLETE').length;
  const notEligibleCount = evaluations.filter((e) => e.verdict === 'NOT_ELIGIBLE').length;

  // Determine dynamic Next Best Action from deterministic evaluation
  let nextBestActionText = '';
  const firstEligible = evaluations.find((e) => e.verdict === 'ELIGIBLE');
  const firstIncomplete = evaluations.find((e) => e.verdict === 'INCOMPLETE' && e.missing_documents.length > 0);

  if (firstEligible) {
    nextBestActionText = `You appear eligible for ${firstEligible.scheme_name}! Review the Proof Ledger below and generate your official pre-filled application PDF.`;
  } else if (firstIncomplete) {
    const missingDocName = firstIncomplete.missing_documents[0].replace(/_/g, ' ').toUpperCase();
    nextBestActionText = `Upload ${missingDocName} to complete verification for ${firstIncomplete.scheme_name}.`;
  } else {
    nextBestActionText = 'Review the criteria below to understand statutory exclusions or update your household facts.';
  }

  // Visual status badge helper
  const renderStatusBadge = (status: CriterionStatus) => {
    switch (status) {
      case 'PASS':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
            PROVEN (सत्यापित)
          </span>
        );
      case 'FAIL':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-600" />
            FAILED (अपात्र)
          </span>
        );
      case 'MISSING_PROOF':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            MISSING PROOF (प्रमाण आवश्यक)
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
            UNCERTAIN (अज्ञात)
          </span>
        );
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      {/* Demo Mode Notice if viewing demo data */}
      {isDemoData && (
        <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <BadgeAlert className="w-4 h-4 text-amber-600 shrink-0" />
            <span className="font-bold">Demo Mode — for demonstration only</span>
          </div>
          <span className="text-[11px] text-slate-500">Deterministic pipeline evaluated sample household facts</span>
        </div>
      )}

      {/* FEATURE 6 — Stronger Results Summary Banner */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
          <div>
            <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-blue-600" />
              Your Eligibility Assessment
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {evaluations.length} government schemes evaluated against your verified evidence
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              {eligibleCount} Potentially Eligible
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5" />
              {incompleteCount} Needs More Proof
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-800 border border-rose-200 flex items-center gap-1.5">
              <XCircle className="w-3.5 h-3.5" />
              {notEligibleCount} Ineligible
            </span>
          </div>
        </div>

        {/* Dynamic Next Best Action Callout */}
        <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-200 flex items-start space-x-3">
          <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 mt-0.5">
            <Award className="w-4 h-4" />
          </div>
          <div className="text-xs">
            <span className="font-bold text-blue-700 uppercase tracking-wider block text-[10px]">
              Next Best Action
            </span>
            <p className="text-slate-800 mt-0.5 font-medium leading-relaxed">
              {nextBestActionText}
            </p>
          </div>
        </div>

        {/* Filter bar and JSON export */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pt-1">
          <div className="flex items-center space-x-1.5 p-1 rounded-xl bg-slate-100 border border-slate-200 text-xs">
            {(['ALL', 'ELIGIBLE', 'INCOMPLETE', 'NOT_ELIGIBLE'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${
                  filter === tab
                    ? 'bg-white text-blue-700 font-bold shadow-xs border border-slate-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab.replace('_', ' ')}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={handleExportJson}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-300 text-xs text-slate-700 font-semibold shadow-xs transition-colors cursor-pointer"
            title="Export Ledger as JSON"
          >
            <Download className="w-3.5 h-3.5 text-blue-600" />
            <span>Export Ledger JSON</span>
          </button>
        </div>
      </div>

      {/* Scheme Cards */}
      <div className="space-y-4">
        {filtered.map((scheme) => {
          const isExpanded = expandedSchemes[scheme.scheme_id] ?? false;
          const passCount = scheme.criteria_results.filter((c) => c.status === 'PASS').length;
          const totalCount = scheme.criteria_results.length;

          // Find blocking reason for ineligible schemes
          const failedCriterion = scheme.criteria_results.find((c) => c.status === 'FAIL');
          // Find missing proof criterion for incomplete schemes
          const missingCriterion = scheme.criteria_results.find((c) => c.status === 'MISSING_PROOF' || c.status === 'UNKNOWN');

          return (
            <div
              key={scheme.scheme_id}
              className={`rounded-2xl border transition-all ${
                scheme.verdict === 'ELIGIBLE'
                  ? 'bg-white border-emerald-300 shadow-sm'
                  : scheme.verdict === 'INCOMPLETE'
                  ? 'bg-white border-amber-300 shadow-sm'
                  : 'bg-white border-slate-200 shadow-xs'
              }`}
            >
              {/* Header */}
              <div
                onClick={() => toggleExpandScheme(scheme.scheme_id)}
                className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer hover:bg-slate-50/60 rounded-t-2xl transition-colors"
              >
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                      {scheme.scheme_name}
                    </h3>
                    {scheme.verdict === 'ELIGIBLE' ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> ✅ Eligible
                      </span>
                    ) : scheme.verdict === 'INCOMPLETE' ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
                        <AlertCircle className="w-3.5 h-3.5 text-amber-600" /> 🟡 More proof required
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-800 border border-rose-200">
                        <XCircle className="w-3.5 h-3.5 text-rose-600" /> ❌ Not eligible
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500">{scheme.authority}</p>
                  <p className="text-xs text-emerald-700 font-bold">
                    Benefit: {scheme.benefit}
                  </p>
                </div>

                <div className="flex items-center space-x-3 shrink-0">
                  <span className="text-xs font-semibold text-slate-500">
                    {passCount}/{totalCount} Satisfied
                  </span>

                  {scheme.verdict === 'ELIGIBLE' && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectSchemeForAction(scheme);
                      }}
                      className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
                    >
                      <span>Claim Benefit</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}

                  <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500">
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </div>
              </div>

              {/* Expandable Section */}
              {isExpanded && (
                <div className="px-5 pb-5 pt-2 border-t border-slate-100 space-y-5">
                  {/* FEATURE 1 — "WHY AM I ELIGIBLE?" / EXPLAINABILITY BLOCK */}
                  {scheme.verdict === 'ELIGIBLE' ? (
                    <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          Why you qualify
                        </span>
                        <span className="text-xs font-bold text-emerald-700">
                          {passCount} / {totalCount} required criteria satisfied
                        </span>
                      </div>
                      <ul className="space-y-1 text-xs text-slate-700">
                        {scheme.criteria_results.map((c) => (
                          <li key={c.rule_id} className="flex items-center space-x-2">
                            <span className="text-emerald-600 font-bold">✅</span>
                            <span>{c.label}: <b className="text-slate-900">{String(c.extracted_value)}</b> ({c.proving_document || 'Verified'})</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : scheme.verdict === 'NOT_ELIGIBLE' ? (
                    <div className="p-4 rounded-xl bg-rose-50/70 border border-rose-200 space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-rose-800 uppercase tracking-wider flex items-center gap-1.5">
                          <XCircle className="w-4 h-4 text-rose-600" />
                          Evaluation Summary (Not Eligible)
                        </span>
                        <span className="text-xs font-bold text-rose-700">
                          {passCount} / {totalCount} criteria satisfied
                        </span>
                      </div>
                      {failedCriterion && (
                        <div className="p-3 rounded-lg bg-white border border-rose-200 text-xs text-rose-800">
                          <span className="font-bold text-rose-700 block text-[11px] uppercase">
                            Blocking reason:
                          </span>
                          <p className="mt-0.5 font-medium">
                            {failedCriterion.label} — {failedCriterion.explanation}
                          </p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-amber-800 uppercase tracking-wider flex items-center gap-1.5">
                          <AlertCircle className="w-4 h-4 text-amber-600" />
                          More Proof Required
                        </span>
                        <span className="text-xs font-bold text-amber-700">
                          {passCount} / {totalCount} criteria satisfied
                        </span>
                      </div>
                      {missingCriterion && (
                        <div className="p-3 rounded-lg bg-white border border-amber-200 text-xs text-amber-800">
                          <span className="font-bold text-amber-700 block text-[11px] uppercase">
                            Action required:
                          </span>
                          <p className="mt-0.5 font-medium">
                            {missingCriterion.remediation || `Upload valid documentary proof for ${missingCriterion.label}.`}
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* FEATURE 2 & FEATURE 4 — EVIDENCE DETAILS FOR EVERY CRITERION */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                        Criterion-by-Criterion Evidence Ledger
                      </h4>
                      <span className="text-[11px] text-slate-500">
                        Click any criterion to inspect verbatim evidence details
                      </span>
                    </div>

                    {scheme.criteria_results.map((c: CriterionResult) => {
                      const isCriterionExpanded = expandedCriteria[c.rule_id] ?? false;

                      return (
                        <div
                          key={c.rule_id}
                          className="rounded-xl bg-white border border-slate-200 hover:border-slate-300 transition-all text-xs overflow-hidden"
                        >
                          {/* Criterion Row Header */}
                          <div
                            onClick={() => toggleExpandCriterion(c.rule_id)}
                            className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 cursor-pointer hover:bg-slate-50/60 transition-colors"
                          >
                            <div className="space-y-1">
                              <div className="flex flex-wrap items-center gap-2">
                                {renderStatusBadge(c.status)}
                                <span className="font-bold text-slate-900">{c.label}</span>
                              </div>
                              <div className="flex items-center space-x-3 text-[11px] text-slate-500">
                                <span>
                                  Extracted: <b className="text-slate-800">{c.extracted_value != null ? String(c.extracted_value) : 'None'}</b>
                                </span>
                                <span>•</span>
                                <span>
                                  Provenance: <b className="text-blue-700">{c.provenance}</b>
                                </span>
                                <span>•</span>
                                <span>
                                  Doc: <b className="text-slate-700">{c.proving_document || 'None'}</b>
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center space-x-2 shrink-0 self-end sm:self-auto">
                              <span className="text-[11px] text-blue-600 font-semibold flex items-center gap-1">
                                {isCriterionExpanded ? 'Hide Evidence' : 'Inspect Evidence'}
                                {isCriterionExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                              </span>
                            </div>
                          </div>

                          {/* FEATURE 2 — EXPANDED EVIDENCE DRAWER */}
                          {isCriterionExpanded && (
                            <div className="px-4 pb-4 pt-2 border-t border-slate-100 bg-slate-50/60 space-y-3">
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                                <div className="p-2.5 rounded-lg bg-white border border-slate-200 space-y-1">
                                  <span className="text-[10px] text-slate-500 font-bold uppercase block">
                                    Extracted Value & Status
                                  </span>
                                  <p className="text-xs font-bold text-slate-900">
                                    {c.extracted_value != null ? String(c.extracted_value) : <span className="text-slate-400 font-normal">Evidence unavailable</span>}
                                  </p>
                                  <p className="text-[11px] text-slate-500">
                                    Provenance State: <span className="text-blue-700 font-medium">{c.provenance}</span>
                                  </p>
                                </div>

                                <div className="p-2.5 rounded-lg bg-white border border-slate-200 space-y-1">
                                  <span className="text-[10px] text-slate-500 font-bold uppercase block">
                                    Source File & Consuming Rule
                                  </span>
                                  <p className="text-xs font-bold text-slate-900">
                                    {c.proving_document || 'None (Self-declared)'}
                                  </p>
                                  <p className="text-[11px] text-slate-500">
                                    Rule ID: <span className="font-mono text-slate-600">{c.rule_id}</span>
                                  </p>
                                </div>
                              </div>

                              {/* Verbatim snippet or unavailable indicator */}
                              <div className="p-3 rounded-lg bg-white border border-slate-200 text-xs">
                                <span className="text-[10px] text-slate-500 font-bold uppercase block mb-1">
                                  Verbatim Document Quote
                                </span>
                                {c.verbatim_snippet ? (
                                  <p className="text-slate-800 italic font-mono text-[11px]">
                                    "{c.verbatim_snippet}"
                                  </p>
                                ) : (
                                  <p className="text-slate-400 italic">
                                    Evidence unavailable — no documentary proof attached for this criterion.
                                  </p>
                                )}
                              </div>

                              {/* Uncertainty callout if missing proof */}
                              {c.status === 'MISSING_PROOF' && (
                                <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-800 space-y-1">
                                  <span className="font-bold flex items-center gap-1 text-[11px] uppercase">
                                    <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                                    No valid document was provided for this criterion
                                  </span>
                                  <p className="text-slate-600 text-[11px]">
                                    ScholarTack does not assume self-declared information is true without statutory proof.
                                  </p>
                                  {c.remediation && (
                                    <p className="font-semibold text-amber-800 mt-1">
                                      Action: {c.remediation}
                                    </p>
                                  )}
                                </div>
                              )}

                              {/* Statutory Clause & Official Source Link */}
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[10px] text-slate-500 pt-2 border-t border-slate-200">
                                <span>
                                  Statutory Clause: <span className="text-slate-700 font-medium">{c.source_clause}</span>
                                </span>

                                <a
                                  href={c.source_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center space-x-1 text-blue-600 hover:text-blue-800 underline"
                                >
                                  <span>Official Guidelines</span>
                                  <ExternalLink className="w-2.5 h-2.5" />
                                </a>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* FEATURE 7 — SOURCE / RULE TRANSPARENCY BAR */}
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-500 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="space-y-0.5">
                      <span className="font-semibold text-slate-700">Rule Source: </span>
                      <span>{scheme.authority}</span>
                      <span className="mx-2">•</span>
                      <span>Version: <b className="text-slate-800">{scheme.version || 'v2024.1'}</b></span>
                      <span className="mx-2">•</span>
                      <span>Last verified: <b className="text-emerald-700">{scheme.last_verified || 'Current'}</b></span>
                    </div>

                    <a
                      href={scheme.source_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-1 text-blue-600 hover:text-blue-800 underline shrink-0 font-medium"
                    >
                      <span>Official Portal Source</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </a>
                  </div>

                  {/* Claim Action CTA */}
                  <div className="pt-1 flex justify-end">
                    <button
                      type="button"
                      onClick={() => onSelectSchemeForAction(scheme)}
                      className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs border border-slate-300 shadow-xs transition-colors cursor-pointer"
                    >
                      <Award className="w-4 h-4 text-blue-600" />
                      <span>View Next Actions & Generate Application PDF</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};