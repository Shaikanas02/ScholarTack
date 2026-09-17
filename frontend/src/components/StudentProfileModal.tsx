import React, { useState, useEffect } from 'react';
import {
  X,
  Sparkles,
  Save,
  CheckCircle2,
  AlertCircle,
  GraduationCap,
  ArrowRight,
  RotateCcw,
} from 'lucide-react';
import type { StudentProfile, ScholarshipRecommendation } from '../types';
import { getRecommendations } from '../services/api';

interface StudentProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: StudentProfile;
  onSaveProfile: (profile: StudentProfile) => void;
  onSelectScholarshipAction?: (scholarshipId: string) => void;
}

export const StudentProfileModal: React.FC<StudentProfileModalProps> = ({
  isOpen,
  onClose,
  profile,
  onSaveProfile,
  onSelectScholarshipAction,
}) => {
  const [formData, setFormData] = useState<StudentProfile>(profile);
  const [recommendations, setRecommendations] = useState<ScholarshipRecommendation[]>([]);
  const [loadingRecs, setLoadingRecs] = useState(false);
  const [activeTab, setActiveTab] = useState<'edit' | 'recommendations'>('edit');

  useEffect(() => {
    setFormData(profile);
  }, [profile]);

  if (!isOpen) return null;

  const handleFetchRecommendations = async () => {
    try {
      setLoadingRecs(true);
      setActiveTab('recommendations');
      const recs = await getRecommendations(formData);
      setRecommendations(recs);
    } catch (e) {
      console.error('Failed to get recommendations', e);
    } finally {
      setLoadingRecs(false);
    }
  };

  const handleSave = () => {
    onSaveProfile(formData);
    handleFetchRecommendations();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-5 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Student Academic Profile</h2>
              <p className="text-xs text-slate-400">
                Personalize your scholarship matching engine & statutory parameters
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="px-5 py-2.5 bg-slate-950/40 border-b border-slate-800/80 flex items-center space-x-2">
          <button
            type="button"
            onClick={() => setActiveTab('edit')}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'edit'
                ? 'bg-indigo-500 text-white shadow-md shadow-indigo-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Profile Information
          </button>
          <button
            type="button"
            onClick={handleFetchRecommendations}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'recommendations'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Matching Scholarships ({recommendations.length})</span>
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {activeTab === 'edit' ? (
            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Student Full Name</label>
                  <input
                    type="text"
                    value={formData.applicant_name}
                    onChange={(e) => setFormData({ ...formData, applicant_name: e.target.value })}
                    placeholder="e.g. Ananya Sharma"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Age (Years)</label>
                  <input
                    type="number"
                    value={formData.applicant_age}
                    onChange={(e) => setFormData({ ...formData, applicant_age: parseInt(e.target.value) || 18 })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Gender</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="female">Female</option>
                    <option value="male">Male</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Social / Caste Category</label>
                  <select
                    value={formData.social_category}
                    onChange={(e) => setFormData({ ...formData, social_category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="General">General / Unreserved</option>
                    <option value="OBC">OBC (Other Backward Classes)</option>
                    <option value="SC">SC (Scheduled Caste)</option>
                    <option value="ST">ST (Scheduled Tribe)</option>
                    <option value="Minority">Minority Community</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    Qualifying Academic Marks (%)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.academic_percentage}
                    onChange={(e) => setFormData({ ...formData, academic_percentage: parseFloat(e.target.value) || 0 })}
                    placeholder="e.g. 84.5"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    Annual Family Income (₹ per year)
                  </label>
                  <input
                    type="number"
                    value={formData.annual_family_income}
                    onChange={(e) => setFormData({ ...formData, annual_family_income: parseFloat(e.target.value) || 0 })}
                    placeholder="e.g. 220000"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* Toggles */}
              <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800/80 space-y-2.5">
                <span className="font-bold text-slate-200 block text-[11px] uppercase tracking-wider">
                  Enrollment & Statutory Status
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.is_ug_student}
                      onChange={(e) => setFormData({ ...formData, is_ug_student: e.target.checked })}
                      className="rounded border-slate-700 text-indigo-500 focus:ring-0"
                    />
                    <span className="text-slate-300">Under-Graduate (UG) College Student</span>
                  </label>

                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.is_post_matric_student}
                      onChange={(e) => setFormData({ ...formData, is_post_matric_student: e.target.checked })}
                      className="rounded border-slate-700 text-indigo-500 focus:ring-0"
                    />
                    <span className="text-slate-300">Post-Matric (Class 11, 12, or Diploma)</span>
                  </label>

                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.aadhaar_present}
                      onChange={(e) => setFormData({ ...formData, aadhaar_present: e.target.checked })}
                      className="rounded border-slate-700 text-indigo-500 focus:ring-0"
                    />
                    <span className="text-slate-300">Possess Valid Aadhaar Card</span>
                  </label>

                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.bank_account_present}
                      onChange={(e) => setFormData({ ...formData, bank_account_present: e.target.checked })}
                      className="rounded border-slate-700 text-indigo-500 focus:ring-0"
                    />
                    <span className="text-slate-300">Aadhaar Seeded Bank Account (DBT)</span>
                  </label>

                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.is_availing_other_scholarship}
                      onChange={(e) => setFormData({ ...formData, is_availing_other_scholarship: e.target.checked })}
                      className="rounded border-slate-700 text-indigo-500 focus:ring-0"
                    />
                    <span className="text-slate-300">Already Availing Other Govt Scholarship</span>
                  </label>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {loadingRecs ? (
                <div className="py-12 text-center text-slate-400 text-xs">
                  <Sparkles className="w-8 h-8 mx-auto mb-2 text-indigo-400 animate-spin" />
                  <p>Evaluating your profile against all statutory scheme packs...</p>
                </div>
              ) : recommendations.length === 0 ? (
                <div className="py-12 text-center text-slate-400 text-xs">
                  <AlertCircle className="w-8 h-8 mx-auto mb-2 text-slate-500" />
                  <p>No matching scholarships evaluated yet. Click "Calculate Matches".</p>
                </div>
              ) : (
                recommendations.map((rec) => (
                  <div
                    key={rec.scheme_id}
                    className="p-4 rounded-2xl bg-slate-950 border border-slate-800/90 shadow-md space-y-2.5"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="text-xs font-bold text-white">{rec.scheme_name}</h4>
                        <p className="text-[11px] text-slate-400">{rec.authority}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-black ${
                            rec.match_score >= 80
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                              : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                          }`}
                        >
                          {rec.match_score}% Match
                        </span>
                        <p className="text-[10px] text-slate-400 mt-0.5">{rec.match_tier}</p>
                      </div>
                    </div>

                    <div className="text-xs font-extrabold text-emerald-400">
                      Benefit: {rec.award_amount}
                    </div>

                    {rec.satisfied_criteria.length > 0 && (
                      <div className="text-[11px] text-emerald-300/90 space-y-0.5">
                        <p className="font-semibold text-slate-300">Satisfied Conditions:</p>
                        {rec.satisfied_criteria.slice(0, 3).map((c, idx) => (
                          <div key={idx} className="flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                            <span>{c}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {rec.blocking_reasons.length > 0 && (
                      <div className="text-[11px] text-rose-300/90 space-y-0.5 pt-1">
                        <p className="font-semibold text-slate-300">Exclusion Reasons:</p>
                        {rec.blocking_reasons.map((r, idx) => (
                          <div key={idx} className="flex items-start gap-1">
                            <AlertCircle className="w-3 h-3 text-rose-400 shrink-0 mt-0.5" />
                            <span>{r}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="pt-2 border-t border-slate-900 flex items-center justify-end">
                      {onSelectScholarshipAction && (
                        <button
                          type="button"
                          onClick={() => {
                            onSelectScholarshipAction(rec.scheme_id);
                            onClose();
                          }}
                          className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 cursor-pointer"
                        >
                          <span>Run Complete Evidence Verification</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <button
            type="button"
            onClick={() => {
              setFormData({
                applicant_name: 'Ananya Sharma',
                applicant_age: 18,
                gender: 'female',
                social_category: 'General',
                annual_family_income: 220000,
                is_ug_student: true,
                is_post_matric_student: true,
                academic_percentage: 84.0,
                is_availing_other_scholarship: false,
                aadhaar_present: true,
                bank_account_present: true,
              });
            }}
            className="text-xs text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Load Sample Student</span>
          </button>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white cursor-pointer"
            >
              Close
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-400 hover:to-purple-400 text-white font-bold text-xs shadow-lg shadow-indigo-500/20 flex items-center gap-1.5 cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save & Calculate Matches</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
