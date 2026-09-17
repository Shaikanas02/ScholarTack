import React, { useState } from 'react';
import {
  ListFilter,
  Trash2,
  Award,
  CheckCircle2,
  ExternalLink,
  Edit3,
  Calendar,
  ChevronRight,
} from 'lucide-react';
import type { TrackedApplication, ApplicationTrackingStatus } from '../types';

interface ApplicationTrackerProps {
  applications: TrackedApplication[];
  onUpdateStatus: (schemeId: string, newStatus: ApplicationTrackingStatus) => void;
  onUpdateNotes: (schemeId: string, notes: string, appNum?: string) => void;
  onDeleteApplication: (schemeId: string) => void;
  onCheckEligibilityForScheme?: (schemeId: string) => void;
}

export const ApplicationTracker: React.FC<ApplicationTrackerProps> = ({
  applications,
  onUpdateStatus,
  onUpdateNotes,
  onDeleteApplication,
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editNotes, setEditNotes] = useState('');
  const [editAppNum, setEditAppNum] = useState('');

  const STAGES: {
    status: ApplicationTrackingStatus;
    label: string;
    stepNum: number;
  }[] = [
    { status: 'saved', label: 'Saved', stepNum: 1 },
    { status: 'preparing_docs', label: 'Preparing Docs', stepNum: 2 },
    { status: 'submitted', label: 'Submitted', stepNum: 3 },
    { status: 'under_review', label: 'Under Review', stepNum: 4 },
    { status: 'approved', label: 'Approved', stepNum: 5 },
    { status: 'disbursed', label: 'Disbursed', stepNum: 6 },
  ];

  const getStageIndex = (status: ApplicationTrackingStatus): number => {
    if (status === 'awarded') return 5;
    const idx = STAGES.findIndex((s) => s.status === status);
    return idx >= 0 ? idx : 0;
  };

  const handleStartEdit = (app: TrackedApplication) => {
    setEditingId(app.scheme_id);
    setEditNotes(app.notes || '');
    setEditAppNum(app.application_number || '');
  };

  const handleSaveEdit = (schemeId: string) => {
    onUpdateNotes(schemeId, editNotes, editAppNum);
    setEditingId(null);
  };

  const totalApps = applications.length;
  const inProgress = applications.filter((a) =>
    ['preparing_docs', 'submitted', 'under_review'].includes(a.status)
  ).length;
  const completed = applications.filter((a) =>
    ['approved', 'disbursed', 'awarded'].includes(a.status)
  ).length;

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="card-panel p-6 bg-white border border-slate-200 shadow-sm relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                <ListFilter className="w-4 h-4" />
              </div>
              <h2 className="text-xl font-black text-slate-900">Application Pipeline Tracker</h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Track your scholarship applications through all 6 statutory stages: from document preparation to PFMS bank disbursal.
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-3">
            <div className="px-3.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-center">
              <p className="text-[10px] text-slate-500 uppercase font-semibold">Tracked</p>
              <p className="text-base font-black text-slate-900">{totalApps}</p>
            </div>
            <div className="px-3.5 py-1.5 rounded-xl bg-blue-50 border border-blue-200 text-center">
              <p className="text-[10px] text-blue-700 uppercase font-semibold">In Progress</p>
              <p className="text-base font-black text-blue-700">{inProgress}</p>
            </div>
            <div className="px-3.5 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-center">
              <p className="text-[10px] text-emerald-700 uppercase font-semibold">Disbursed / Done</p>
              <p className="text-base font-black text-emerald-700">{completed}</p>
            </div>
          </div>
        </div>

        {/* 6-Stage Reference Flow Banner */}
        <div className="mt-5 pt-4 border-t border-slate-100 hidden md:flex items-center justify-between text-center gap-2">
          {STAGES.map((st, i) => (
            <div key={st.status} className="flex-1 flex items-center">
              <div className="w-full p-2 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-bold text-slate-500 uppercase">Stage {st.stepNum}</span>
                <p className="text-xs font-bold text-slate-800 mt-0.5">{st.label}</p>
              </div>
              {i < STAGES.length - 1 && <ChevronRight className="w-4 h-4 text-slate-400 shrink-0 mx-1" />}
            </div>
          ))}
        </div>
      </div>

      {applications.length === 0 ? (
        <div className="card-panel p-12 text-center bg-white border border-slate-200 text-slate-500 text-xs space-y-3">
          <Award className="w-12 h-12 mx-auto text-slate-300" />
          <p className="text-base font-bold text-slate-800">No applications currently tracked</p>
          <p className="max-w-md mx-auto text-slate-500">
            Open any scholarship from the directory or your personalized matches and click "Save to Tracker" to begin monitoring your milestones.
          </p>
        </div>
      ) : (
        /* Applications List Cards */
        <div className="space-y-4">
          {applications.map((app) => {
            const currentIdx = getStageIndex(app.status);
            const isEditing = editingId === app.scheme_id;

            return (
              <div
                key={app.scheme_id}
                className="card-panel p-5 bg-white border border-slate-200 hover:border-slate-300 shadow-sm transition-all space-y-4"
              >
                {/* Top Row: Title, Amount, Actions */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-bold px-2.5 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200">
                        {STAGES[currentIdx]?.label || 'Saved'}
                      </span>
                      {app.deadline && (
                        <span className="text-xs text-slate-500 flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span>Deadline: {app.deadline}</span>
                        </span>
                      )}
                    </div>
                    <h3 className="text-base font-bold text-slate-900 mt-1">{app.scheme_name}</h3>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-black text-emerald-700 bg-emerald-50 px-3 py-1 rounded-xl border border-emerald-200">
                      {app.award_amount}
                    </span>

                    <a
                      href={app.portal_url || 'https://scholarships.gov.in/'}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 border border-slate-200 transition-colors cursor-pointer"
                      title="Open Official Government Application Portal"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>

                    <button
                      type="button"
                      onClick={() => onDeleteApplication(app.scheme_id)}
                      className="p-2 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-500 hover:text-rose-600 border border-slate-200 transition-colors cursor-pointer"
                      title="Remove from tracker"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* 6-Stage Timeline Visual Indicator */}
                <div className="pt-2">
                  <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 mb-2">
                    <span>Application Stage Progression:</span>
                    <span className="text-blue-600">Stage {currentIdx + 1} of 6</span>
                  </div>

                  {/* Step Buttons Pipeline */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-1.5">
                    {STAGES.map((st, idx) => {
                      const isPastOrCurrent = idx <= currentIdx;
                      const isCurrent = idx === currentIdx;

                      return (
                        <button
                          key={st.status}
                          type="button"
                          onClick={() => onUpdateStatus(app.scheme_id, st.status)}
                          className={`p-2.5 rounded-xl text-left border transition-all cursor-pointer ${
                            isCurrent
                              ? 'bg-blue-600 border-blue-600 text-white font-bold shadow-xs'
                              : isPastOrCurrent
                              ? 'bg-emerald-50 border-emerald-200 text-emerald-800 hover:bg-emerald-100'
                              : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100'
                          }`}
                        >
                          <div className="flex items-center justify-between text-[10px]">
                            <span>Stage {st.stepNum}</span>
                            {isPastOrCurrent && <CheckCircle2 className="w-3.5 h-3.5 text-current" />}
                          </div>
                          <p className="text-xs truncate mt-0.5">{st.label}</p>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Reference Number & Notes Box */}
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                  {isEditing ? (
                    <div className="space-y-3">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">
                          Official Application Reference Number (e.g. NSP/2026/UG/123456)
                        </label>
                        <input
                          type="text"
                          value={editAppNum}
                          onChange={(e) => setEditAppNum(e.target.value)}
                          placeholder="e.g. NSP/2026/UG/984210"
                          className="w-full px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">
                          Personal Notes & Verification Milestones
                        </label>
                        <textarea
                          rows={2}
                          value={editNotes}
                          onChange={(e) => setEditNotes(e.target.value)}
                          placeholder="e.g. College nodal officer verified Class 12 marksheet on Sept 14."
                          className="w-full px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div className="flex items-center justify-end space-x-2 pt-1">
                        <button
                          type="button"
                          onClick={() => setEditingId(null)}
                          className="px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSaveEdit(app.scheme_id)}
                          className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold cursor-pointer shadow-xs"
                        >
                          Save Changes
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="space-y-1">
                        <p className="text-[11px] text-slate-500">
                          <span className="font-semibold text-slate-700">Application Ref:</span>{' '}
                          <span className="text-slate-900 font-mono bg-white px-2 py-0.5 rounded border border-slate-200">
                            {app.application_number || 'Not yet generated (Draft)'}
                          </span>
                        </p>
                        <p className="text-[11px] text-slate-500">
                          <span className="font-semibold text-slate-700">Notes:</span>{' '}
                          <span className="text-slate-700 italic">{app.notes || 'No notes added yet.'}</span>
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleStartEdit(app)}
                        className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold cursor-pointer shrink-0 shadow-xs"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-blue-600" />
                        <span>Edit Notes / Ref</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
