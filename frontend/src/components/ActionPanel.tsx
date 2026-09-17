import React, { useState } from 'react';
import {
  FileDown,
  ExternalLink,
  CheckSquare,
  Building,
  Printer,
  ArrowLeft,
  Eye,
} from 'lucide-react';
import type { HouseholdFacts, SchemeEvaluation } from '../types';
import { downloadApplicationPdf, downloadLedgerPdf } from '../services/api';

interface ActionPanelProps {
  scheme: SchemeEvaluation;
  facts: HouseholdFacts;
  onBackToLedger: () => void;
  onPreviewPdf: (url: string, title: string) => void;
}

export const ActionPanel: React.FC<ActionPanelProps> = ({
  scheme,
  facts,
  onBackToLedger,
  onPreviewPdf,
}) => {
  const [downloadingApp, setDownloadingApp] = useState(false);
  const [downloadingLedger, setDownloadingLedger] = useState(false);

  const handleDownloadApp = async () => {
    try {
      setDownloadingApp(true);
      const blob = await downloadApplicationPdf(scheme.scheme_id, facts);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ScholarTack_${scheme.scheme_id}_Application.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (e) {
      alert('Error downloading application PDF.');
    } finally {
      setDownloadingApp(false);
    }
  };

  const handlePreviewApp = async () => {
    try {
      setDownloadingApp(true);
      const blob = await downloadApplicationPdf(scheme.scheme_id, facts);
      const url = window.URL.createObjectURL(blob);
      onPreviewPdf(url, `Pre-filled Application - ${scheme.scheme_name}`);
    } catch (e) {
      alert('Error previewing PDF.');
    } finally {
      setDownloadingApp(false);
    }
  };

  const handleDownloadLedger = async () => {
    try {
      setDownloadingLedger(true);
      const blob = await downloadLedgerPdf(scheme.scheme_id, facts);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ScholarTack_${scheme.scheme_id}_ProofLedger.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (e) {
      alert('Error downloading proof ledger PDF.');
    } finally {
      setDownloadingLedger(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      {/* Back button & Scheme title */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
        <div>
          <button
            type="button"
            onClick={onBackToLedger}
            className="flex items-center space-x-1.5 text-xs text-blue-600 hover:text-blue-800 font-bold mb-2 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to All Schemes</span>
          </button>

          <h2 className="text-lg font-bold text-slate-900">
            Action Plan for {scheme.scheme_name}
          </h2>
          <p className="text-xs text-emerald-700 font-bold mt-0.5">
            Entitlement Benefit: {scheme.benefit}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2.5">
          <button
            type="button"
            onClick={handlePreviewApp}
            disabled={downloadingApp}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs border border-slate-300 shadow-xs transition-colors cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5 text-blue-600" />
            <span>Preview Form</span>
          </button>

          <button
            type="button"
            onClick={handleDownloadApp}
            disabled={downloadingApp}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-all cursor-pointer disabled:opacity-50"
          >
            <FileDown className="w-4 h-4" />
            <span>{downloadingApp ? 'Generating...' : 'Download Application PDF'}</span>
          </button>

          <button
            type="button"
            onClick={handleDownloadLedger}
            disabled={downloadingLedger}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs border border-slate-300 shadow-xs transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5 text-slate-500" />
            <span>{downloadingLedger ? 'Generating...' : 'Printable Proof Ledger'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column: Official Submission Destination */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center space-x-2">
            <Building className="w-5 h-5 text-blue-600" />
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">
              Official Submission Destination
            </h3>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-[10px] text-slate-500 font-bold uppercase block">
                Official Online Portal
              </span>
              <p className="text-sm font-bold text-slate-900">
                {scheme.application.portal_name}
              </p>
              <a
                href={scheme.application.portal_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-1 text-blue-600 hover:text-blue-800 text-xs font-semibold underline mt-1"
              >
                <span>Open Government Portal</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-[10px] text-slate-500 font-bold uppercase block">
                Physical Office / Helpdesk
              </span>
              <p className="text-sm font-bold text-slate-900">
                {scheme.application.office_name}
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Visit your nearest Common Service Centre (CSC) or Block Office with your pre-filled form and documents.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="text-[10px] text-slate-500 font-bold uppercase block">
                Submission Workflow Steps
              </span>
              <ol className="space-y-2 text-slate-700">
                {scheme.application.process_steps.map((step, idx) => (
                  <li key={idx} className="flex items-start space-x-2">
                    <span className="w-4 h-4 rounded-full bg-blue-100 text-blue-700 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>

        {/* Right Column: Physical Documents Checklist */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center space-x-2">
            <CheckSquare className="w-5 h-5 text-emerald-600" />
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">
              Physical Documents to Carry
            </h3>
          </div>

          <p className="text-xs text-slate-500">
            Carry original hardcopies for spot verification and biometric authentication:
          </p>

          <div className="space-y-2.5">
            {scheme.application.documents_to_carry.map((doc, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center space-x-3 text-xs"
              >
                <div className="w-5 h-5 rounded bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 font-bold text-xs">
                  ✓
                </div>
                <span className="text-slate-800 font-semibold">{doc}</span>
              </div>
            ))}
          </div>

          <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-200 text-[11px] text-blue-900 space-y-1">
            <span className="text-blue-800 font-bold block">
              ScholarTack Pre-Filled Guarantee
            </span>
            <p className="text-slate-700">
              Your downloaded application PDF already includes all verified evidence references, statutory clauses, and pre-calculated totals ready for official signing.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};