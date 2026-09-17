import React, { useState, useMemo } from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Clock,
  ExternalLink,
  PlusCircle,
  Eye,
  Search,
  Filter,
  ArrowUpDown,
  Sparkles,
  ChevronRight,
} from 'lucide-react';
import type { ScholarshipRecommendation, ScholarshipItem } from '../types';

interface PersonalizedResultsProps {
  recommendations: ScholarshipRecommendation[];
  allScholarships: ScholarshipItem[];
  loading?: boolean;
  onSelectScholarship: (scholarshipId: string) => void;
  onTrackScholarship: (scholarship: ScholarshipItem) => void;
  onOpenProfile: () => void;
}

export const PersonalizedResults: React.FC<PersonalizedResultsProps> = ({
  recommendations,
  allScholarships,
  onSelectScholarship,
  onTrackScholarship,
  onOpenProfile,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [sortBy, setSortBy] = useState<'match' | 'deadline' | 'amount'>('match');

  const getScholarshipById = (id: string): ScholarshipItem | undefined => {
    return allScholarships.find((s) => s.id === id);
  };

  const categorized = useMemo(() => {
    const eligible: ScholarshipRecommendation[] = [];
    const possible: ScholarshipRecommendation[] = [];
    const notEligible: ScholarshipRecommendation[] = [];
    const closingSoon: ScholarshipRecommendation[] = [];

    recommendations.forEach((rec) => {
      if (rec.days_left != null && rec.days_left >= 0 && rec.days_left <= 15) {
        closingSoon.push(rec);
      }

      if (rec.verdict === 'ELIGIBLE' || (rec.blocking_reasons.length === 0 && rec.match_score >= 85)) {
        eligible.push(rec);
      } else if (rec.verdict === 'INCOMPLETE' || (rec.match_score >= 45 && rec.blocking_reasons.length <= 1)) {
        possible.push(rec);
      } else {
        notEligible.push(rec);
      }
    });

    return { eligible, possible, notEligible, closingSoon };
  }, [recommendations]);

  const filterList = (list: ScholarshipRecommendation[]) => {
    return list
      .filter((item) => {
        if (selectedCategory !== 'ALL') {
          if (!item.category.toLowerCase().includes(selectedCategory.toLowerCase())) {
            return false;
          }
        }
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          return (
            item.scheme_name.toLowerCase().includes(q) ||
            item.authority.toLowerCase().includes(q) ||
            item.category.toLowerCase().includes(q)
          );
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'deadline') {
          const dlA = a.days_left ?? 999;
          const dlB = b.days_left ?? 999;
          return dlA - dlB;
        }
        if (sortBy === 'amount') {
          const amtA = parseInt((a.award_amount || '').replace(/[^0-9]/g, '')) || 0;
          const amtB = parseInt((b.award_amount || '').replace(/[^0-9]/g, '')) || 0;
          return amtB - amtA;
        }
        return b.match_score - a.match_score;
      });
  };

  const filteredEligible = useMemo(() => filterList(categorized.eligible), [categorized.eligible, searchQuery, selectedCategory, sortBy]);
  const filteredPossible = useMemo(() => filterList(categorized.possible), [categorized.possible, searchQuery, selectedCategory, sortBy]);
  const filteredNotEligible = useMemo(() => filterList(categorized.notEligible), [categorized.notEligible, searchQuery, selectedCategory, sortBy]);
  const filteredClosingSoon = useMemo(() => filterList(categorized.closingSoon), [categorized.closingSoon, searchQuery, selectedCategory, sortBy]);

  const totalEvaluated = recommendations.length;

  if (totalEvaluated === 0) {
    return (
      <div className="card-panel p-10 text-center space-y-4 max-w-lg mx-auto my-8 bg-white border border-slate-200">
        <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto shadow-xs">
          <Sparkles className="w-7 h-7" />
        </div>
        <div className="space-y-1">
          <h3 className="text-lg font-bold text-slate-900">No Active Student Profile Matches</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Please create your student profile or select a demo profile to calculate statutory scholarship eligibility.
          </p>
        </div>
        <div className="pt-2">
          <button
            type="button"
            onClick={onOpenProfile}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs cursor-pointer inline-flex items-center space-x-1.5"
          >
            <span>Go to Student Profiles</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Banner: Analysis Summary */}
      <div className="card-panel p-6 bg-white border border-slate-200 shadow-sm space-y-5">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 border border-blue-100 flex items-center justify-center font-bold">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900">Personalized Scholarship Matches</h2>
              <p className="text-xs text-slate-500">
                Statutory evaluation across {totalEvaluated} Central & State government schemes.
              </p>
            </div>
          </div>

          {/* Quick Summary Pill Stats */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="px-3.5 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <div>
                <p className="text-[10px] text-slate-500 uppercase font-bold leading-none">Eligible</p>
                <p className="text-sm font-black text-emerald-700 leading-tight">{categorized.eligible.length} Schemes</p>
              </div>
            </div>

            <div className="px-3.5 py-1.5 rounded-xl bg-amber-50 border border-amber-200 flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <div>
                <p className="text-[10px] text-slate-500 uppercase font-bold leading-none">Possibly Eligible</p>
                <p className="text-sm font-black text-amber-700 leading-tight">{categorized.possible.length} Schemes</p>
              </div>
            </div>

            {categorized.closingSoon.length > 0 && (
              <div className="px-3.5 py-1.5 rounded-xl bg-rose-50 border border-rose-200 flex items-center space-x-2">
                <Clock className="w-4 h-4 text-rose-600" />
                <div>
                  <p className="text-[10px] text-slate-500 uppercase font-bold leading-none">Closing Soon</p>
                  <p className="text-sm font-black text-rose-700 leading-tight">{categorized.closingSoon.length} Critical</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="pt-4 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search matched schemes..."
              className="w-full pl-9 pr-3.5 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
            />
          </div>

          <div className="flex items-center space-x-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
            <div className="flex items-center space-x-1 text-xs text-slate-500">
              <Filter className="w-3.5 h-3.5" />
              <span>Category:</span>
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700 focus:outline-none focus:bg-white"
            >
              <option value="ALL">All Categories</option>
              <option value="Girls">Girls in STEM</option>
              <option value="Merit">Merit & Science</option>
              <option value="SC">Scheduled Caste (SC)</option>
              <option value="ST">Scheduled Tribe (ST)</option>
              <option value="Differently-Abled">Differently-Abled</option>
              <option value="North Eastern">North Eastern Region (NER)</option>
            </select>

            <div className="flex items-center space-x-1 text-xs text-slate-500 ml-2">
              <ArrowUpDown className="w-3.5 h-3.5" />
              <span>Sort:</span>
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700 focus:outline-none focus:bg-white"
            >
              <option value="match">Highest Match Score</option>
              <option value="deadline">Closing Soonest</option>
              <option value="amount">Highest Benefit Amount</option>
            </select>
          </div>
        </div>
      </div>

      {/* SECTION 1: CLOSING SOON (< 15 Days) */}
      {filteredClosingSoon.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <div className="p-1 rounded-md bg-rose-50 text-rose-700 border border-rose-200">
              <Clock className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-black text-rose-800 uppercase tracking-wider">
              Closing Soon (Next 15 Days) — Critical Deadlines
            </h3>
            <span className="text-xs px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 font-bold">
              {filteredClosingSoon.length} Schemes
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredClosingSoon.map((rec) => {
              const fullItem = getScholarshipById(rec.scheme_id);
              const isUrgent = (rec.days_left ?? 99) <= 7;

              return (
                <div
                  key={rec.scheme_id}
                  className="card-panel p-5 bg-white border-l-4 border-l-rose-500 border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                          {rec.category}
                        </span>
                        <h4
                          className="text-base font-bold text-slate-900 mt-1.5 hover:text-blue-600 cursor-pointer"
                          onClick={() => onSelectScholarship(rec.scheme_id)}
                        >
                          {rec.scheme_name}
                        </h4>
                      </div>
                      <div className="text-right shrink-0">
                        <span
                          className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-1 rounded-md ${
                            isUrgent
                              ? 'bg-rose-600 text-white animate-pulse'
                              : 'bg-rose-50 text-rose-700 border border-rose-200'
                          }`}
                        >
                          <Clock className="w-3 h-3" />
                          <span>{rec.days_left} Days Left</span>
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-500 mt-1">
                      Authority: {rec.authority}
                    </p>

                    <div className="mt-3 flex items-center justify-between text-xs p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                      <span className="text-slate-600">Statutory Award:</span>
                      <span className="font-extrabold text-emerald-700">{rec.award_amount}</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => onSelectScholarship(rec.scheme_id)}
                      className="text-xs font-semibold text-blue-700 hover:text-blue-900 flex items-center space-x-1 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View Details & Rules</span>
                    </button>

                    <div className="flex items-center space-x-2">
                      {fullItem && (
                        <button
                          type="button"
                          onClick={() => onTrackScholarship(fullItem)}
                          className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold flex items-center space-x-1 cursor-pointer"
                        >
                          <PlusCircle className="w-3.5 h-3.5" />
                          <span>Track</span>
                        </button>
                      )}
                      <a
                        href={rec.source_url || 'https://scholarships.gov.in/'}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center space-x-1 cursor-pointer shadow-xs"
                      >
                        <span>Apply Portal</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SECTION 2: ELIGIBLE SCHOLARSHIPS */}
      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <div className="p-1 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-black text-emerald-800 uppercase tracking-wider">
            Eligible Scholarships (Statutory Criteria Verified)
          </h3>
          <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
            {filteredEligible.length} Schemes
          </span>
        </div>

        {filteredEligible.length === 0 ? (
          <div className="card-panel p-6 bg-white border border-slate-200 text-center space-y-2">
            <AlertTriangle className="w-7 h-7 text-amber-500 mx-auto" />
            <p className="text-sm font-bold text-slate-800">No fully eligible schemes matched current filter.</p>
            <p className="text-xs text-slate-500">
              Check the "Possibly Eligible" section below or adjust your profile credentials.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredEligible.map((rec) => {
              const fullItem = getScholarshipById(rec.scheme_id);

              return (
                <div
                  key={rec.scheme_id}
                  className="card-panel p-5 bg-white border-l-4 border-l-emerald-500 border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                            {rec.match_score}% Match
                          </span>
                          <span className="text-[10px] font-semibold text-slate-500">
                            {rec.category}
                          </span>
                        </div>
                        <h4
                          className="text-base font-bold text-slate-900 hover:text-blue-600 cursor-pointer"
                          onClick={() => onSelectScholarship(rec.scheme_id)}
                        >
                          {rec.scheme_name}
                        </h4>
                      </div>

                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 shrink-0">
                        ELIGIBLE
                      </span>
                    </div>

                    <p className="text-xs text-slate-500 mt-1">
                      Authority: {rec.authority}
                    </p>

                    <div className="mt-3 p-3 rounded-xl bg-emerald-50/50 border border-emerald-100 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-semibold text-slate-500 uppercase">Benefit Amount</span>
                        <p className="text-sm font-black text-emerald-700">{rec.award_amount}</p>
                      </div>
                      {rec.deadline && (
                        <div className="text-right">
                          <span className="text-[10px] font-semibold text-slate-500 uppercase">Deadline</span>
                          <p className="text-xs font-bold text-slate-700">{rec.deadline}</p>
                        </div>
                      )}
                    </div>

                    {rec.satisfied_criteria && rec.satisfied_criteria.length > 0 && (
                      <div className="mt-3 space-y-1">
                        <p className="text-[10px] font-bold text-slate-500 uppercase">Verified Criteria:</p>
                        <div className="space-y-1 text-xs text-slate-700">
                          {rec.satisfied_criteria.slice(0, 2).map((crit, idx) => (
                            <div key={idx} className="flex items-center space-x-1.5">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                              <span className="truncate">{crit}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => onSelectScholarship(rec.scheme_id)}
                      className="text-xs font-semibold text-blue-700 hover:text-blue-900 flex items-center space-x-1 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View Details</span>
                    </button>

                    <div className="flex items-center space-x-2">
                      {fullItem && (
                        <button
                          type="button"
                          onClick={() => onTrackScholarship(fullItem)}
                          className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold flex items-center space-x-1 cursor-pointer"
                        >
                          <PlusCircle className="w-3.5 h-3.5" />
                          <span>Track</span>
                        </button>
                      )}
                      <a
                        href={rec.source_url || 'https://scholarships.gov.in/'}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center space-x-1 cursor-pointer shadow-xs"
                      >
                        <span>Apply Now</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* SECTION 3: POSSIBLY ELIGIBLE (Pending Actions) */}
      {filteredPossible.length > 0 && (
        <div className="space-y-3 pt-2">
          <div className="flex items-center space-x-2">
            <div className="p-1 rounded-md bg-amber-50 text-amber-700 border border-amber-200">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-black text-amber-800 uppercase tracking-wider">
              Possibly Eligible (Action or Document Verification Required)
            </h3>
            <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold">
              {filteredPossible.length} Schemes
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredPossible.map((rec) => {
              const fullItem = getScholarshipById(rec.scheme_id);

              return (
                <div
                  key={rec.scheme_id}
                  className="card-panel p-5 bg-white border-l-4 border-l-amber-500 border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
                            {rec.match_score}% Potential Match
                          </span>
                          <span className="text-[10px] font-semibold text-slate-500">
                            {rec.category}
                          </span>
                        </div>
                        <h4
                          className="text-base font-bold text-slate-900 mt-1 hover:text-blue-600 cursor-pointer"
                          onClick={() => onSelectScholarship(rec.scheme_id)}
                        >
                          {rec.scheme_name}
                        </h4>
                      </div>

                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200 shrink-0">
                        ACTION NEEDED
                      </span>
                    </div>

                    <p className="text-xs text-slate-500 mt-1">
                      Authority: {rec.authority} • Benefit: <span className="font-bold text-slate-800">{rec.award_amount}</span>
                    </p>

                    {/* What is missing / Required Action */}
                    <div className="mt-3 p-3 rounded-xl bg-amber-50/70 border border-amber-200 space-y-1.5">
                      <p className="text-[10px] font-bold text-amber-800 uppercase">Requirements to Qualify:</p>
                      {rec.blocking_reasons && rec.blocking_reasons.length > 0 ? (
                        rec.blocking_reasons.map((reason, idx) => (
                          <div key={idx} className="flex items-start space-x-1.5 text-xs text-amber-900">
                            <span className="text-amber-600 font-bold">•</span>
                            <span>{reason}</span>
                          </div>
                        ))
                      ) : (
                        <p className="text-xs text-amber-900">
                          Submit required bonafide or income proofs to unlock full verification.
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => onSelectScholarship(rec.scheme_id)}
                      className="text-xs font-semibold text-blue-700 hover:text-blue-900 flex items-center space-x-1 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Review Requirements</span>
                    </button>

                    <div className="flex items-center space-x-2">
                      {fullItem && (
                        <button
                          type="button"
                          onClick={() => onTrackScholarship(fullItem)}
                          className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold flex items-center space-x-1 cursor-pointer"
                        >
                          <PlusCircle className="w-3.5 h-3.5" />
                          <span>Track</span>
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={onOpenProfile}
                        className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold cursor-pointer"
                      >
                        Update Profile
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SECTION 4: NOT ELIGIBLE (Transparent Statutory Reasons) */}
      {filteredNotEligible.length > 0 && (
        <div className="space-y-3 pt-2">
          <div className="flex items-center space-x-2">
            <div className="p-1 rounded-md bg-slate-100 text-slate-600 border border-slate-200">
              <XCircle className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">
              Not Eligible (Statutory Criteria Not Met)
            </h3>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium">
              {filteredNotEligible.length} Schemes
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredNotEligible.map((rec) => (
              <div
                key={rec.scheme_id}
                className="card-panel p-5 bg-white border border-slate-200 shadow-xs opacity-90 hover:opacity-100 transition-opacity flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                        {rec.category}
                      </span>
                      <h4 className="text-sm font-bold text-slate-800 mt-1">
                        {rec.scheme_name}
                      </h4>
                    </div>

                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                      NOT MET
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 mt-1">
                    Authority: {rec.authority}
                  </p>

                  <div className="mt-3 p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1">
                    <p className="text-[10px] font-bold text-slate-500 uppercase">Statutory Blocking Reason:</p>
                    {rec.blocking_reasons && rec.blocking_reasons.length > 0 ? (
                      rec.blocking_reasons.map((reason, idx) => (
                        <p key={idx} className="text-slate-700 leading-snug">• {reason}</p>
                      ))
                    ) : (
                      <p className="text-slate-600">Did not meet minimum academic cutoff or eligibility criteria.</p>
                    )}
                  </div>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => onSelectScholarship(rec.scheme_id)}
                    className="text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
                  >
                    View Official Criteria
                  </button>

                  <a
                    href={rec.source_url || 'https://scholarships.gov.in/'}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center space-x-1"
                  >
                    <span>Portal Guidelines</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
