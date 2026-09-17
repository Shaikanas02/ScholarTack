import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Clock,
  Sparkles,
  ArrowRight,
  GraduationCap,
  Award,
  CheckCircle2,
  Calendar,
  AlertCircle,
  TrendingUp,
  BookmarkPlus,
  Zap,
} from 'lucide-react';
import type { ScholarshipItem, ScholarshipUpdate } from '../types';

interface ScholarshipDashboardProps {
  scholarships: ScholarshipItem[];
  updates: ScholarshipUpdate[];
  loading: boolean;
  onCheckEligibility: (schemeId: string) => void;
  onTrackScholarship: (scholarship: ScholarshipItem) => void;
  onOpenProfile: () => void;
  onOpenDetailsModal?: (scholarship: ScholarshipItem) => void;
}

export const ScholarshipDashboard: React.FC<ScholarshipDashboardProps> = ({
  scholarships,
  updates,
  loading,
  onCheckEligibility,
  onTrackScholarship,
  onOpenProfile,
  onOpenDetailsModal,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedLevel, setSelectedLevel] = useState<string>('ALL');
  const [selectedUrgency, setSelectedUrgency] = useState<'ALL' | 'CLOSING_SOON'>('ALL');
  const [expandedDetails, setExpandedDetails] = useState<Record<string, boolean>>({});

  const toggleDetails = (id: string) => {
    setExpandedDetails((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const categories = [
    'ALL',
    'Merit-Based',
    'Girls in STEM',
    'Social Category (SC)',
    'State & Need-Based',
    'Science & Research',
    'Girls & Minority',
  ];

  const levels = [
    'ALL',
    'Under-Graduate',
    'Post-Matric',
    'Diploma',
  ];

  const filteredScholarships = useMemo(() => {
    return scholarships.filter((s) => {
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matches =
          s.name.toLowerCase().includes(q) ||
          s.authority.toLowerCase().includes(q) ||
          s.benefit.toLowerCase().includes(q) ||
          s.category.toLowerCase().includes(q);
        if (!matches) return false;
      }
      // Category
      if (selectedCategory !== 'ALL') {
        if (!s.category.toLowerCase().includes(selectedCategory.toLowerCase())) return false;
      }
      // Level
      if (selectedLevel !== 'ALL') {
        if (!s.education_level.toLowerCase().includes(selectedLevel.toLowerCase())) return false;
      }
      // Urgency
      if (selectedUrgency === 'CLOSING_SOON') {
        if (s.days_left == null || s.days_left > 20) return false;
      }
      return true;
    });
  }, [scholarships, searchQuery, selectedCategory, selectedLevel, selectedUrgency]);

  const closingSoonCount = scholarships.filter((s) => s.days_left != null && s.days_left <= 20).length;

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      {/* Real-time Updates Ticker */}
      {updates.length > 0 && (
        <div className="p-3 rounded-2xl bg-blue-50/80 border border-blue-200 flex items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center space-x-2.5 overflow-hidden">
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-blue-600 text-white shrink-0 shadow-xs">
              <TrendingUp className="w-3 h-3" /> Live Bulletin
            </span>
            <div className="overflow-x-auto whitespace-nowrap text-xs text-slate-700 font-medium scrollbar-none flex items-center space-x-6">
              {updates.map((u) => (
                <a
                  key={u.id}
                  href={u.source_url}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-blue-700 transition-colors inline-flex items-center gap-1.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                  <span className="font-bold text-slate-900">[{u.tag}]</span>
                  <span>{u.title}</span>
                </a>
              ))}
            </div>
          </div>
          <span className="text-[11px] text-slate-500 font-medium shrink-0 hidden md:inline">
            Official Ministry Feeds
          </span>
        </div>
      )}

      {/* Hero Stats Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="card-panel p-4 bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-semibold">Active Schemes</span>
            <Award className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-2xl font-black text-slate-900">{scholarships.length}</p>
          <p className="text-[11px] text-slate-500 mt-0.5">Central & State Portals</p>
        </div>

        <div className="card-panel p-4 bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-semibold">Closing Soon</span>
            <Clock className="w-4 h-4 text-rose-600" />
          </div>
          <p className="text-2xl font-black text-rose-600">{closingSoonCount}</p>
          <p className="text-[11px] text-slate-500 mt-0.5">&lt; 20 Days Remaining</p>
        </div>

        <div className="card-panel p-4 bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-semibold">Max Annual Benefit</span>
            <Sparkles className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-black text-emerald-700">₹80,000</p>
          <p className="text-[11px] text-slate-500 mt-0.5">Direct DBT Disbursement</p>
        </div>

        <div
          onClick={onOpenProfile}
          className="card-panel p-4 bg-gradient-to-tr from-blue-50 to-indigo-50 border border-blue-200 shadow-xs cursor-pointer hover:border-blue-300 transition-all"
        >
          <div className="flex items-center justify-between text-blue-700 mb-1">
            <span className="text-xs font-bold">Student Profile</span>
            <Zap className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-sm font-bold text-slate-900 mt-1">Smart Eligibility Match</p>
          <p className="text-[11px] text-blue-700 mt-0.5">Configure your profile &rarr;</p>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="card-panel p-5 bg-white border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search bar */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search scholarships by title, ministry, or statutory keywords..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
            />
          </div>

          {/* Quick Urgency Toggle */}
          <div className="flex items-center space-x-2 shrink-0">
            <button
              type="button"
              onClick={() => setSelectedUrgency(selectedUrgency === 'CLOSING_SOON' ? 'ALL' : 'CLOSING_SOON')}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                selectedUrgency === 'CLOSING_SOON'
                  ? 'bg-rose-50 text-rose-700 border border-rose-300 shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Closing Soon Only</span>
            </button>
          </div>
        </div>

        {/* Category Pills */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            <Filter className="w-3.5 h-3.5 text-blue-600" />
            <span>Category:</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Education Level Pills */}
        <div className="space-y-2 pt-2 border-t border-slate-100">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            <GraduationCap className="w-3.5 h-3.5 text-teal-600" />
            <span>Education Level:</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {levels.map((lvl) => (
              <button
                key={lvl}
                type="button"
                onClick={() => setSelectedLevel(lvl)}
                className={`px-3 py-1 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                  selectedLevel === lvl
                    ? 'bg-teal-700 text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Scholarship Cards Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs text-slate-500 px-1">
          <span>Showing {filteredScholarships.length} of {scholarships.length} statutory opportunities</span>
          <span>Verified against statutory rules</span>
        </div>

        {loading ? (
          <div className="py-16 text-center text-slate-500 text-xs">
            <Sparkles className="w-8 h-8 mx-auto mb-2 text-blue-600 animate-spin" />
            <p>Loading latest statutory scholarship directory...</p>
          </div>
        ) : filteredScholarships.length === 0 ? (
          <div className="card-panel p-12 text-center bg-white border border-slate-200 text-slate-500 text-xs space-y-2">
            <AlertCircle className="w-8 h-8 mx-auto text-slate-400" />
            <p className="font-bold text-slate-800 text-sm">No scholarships match your filters</p>
            <p>Try clearing your search query or selecting "ALL" categories.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredScholarships.map((scheme) => {
              const isClosingSoon = scheme.days_left != null && scheme.days_left <= 20;
              const isExpanded = expandedDetails[scheme.id] ?? false;

              return (
                <div
                  key={scheme.id}
                  className={`card-panel p-5 bg-white border transition-all flex flex-col justify-between hover:shadow-md ${
                    isClosingSoon
                      ? 'border-rose-300 border-l-4 border-l-rose-500'
                      : 'border-slate-200 hover:border-blue-300'
                  }`}
                >
                  {/* Top Bar */}
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-100">
                          {scheme.category}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-md text-[10px] font-medium bg-slate-100 text-slate-700">
                          {scheme.education_level}
                        </span>
                      </div>

                      {scheme.deadline ? (
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10px] font-bold shrink-0 ${
                            isClosingSoon
                              ? 'bg-rose-50 text-rose-700 border border-rose-200 animate-pulse'
                              : 'bg-slate-100 text-slate-700 border border-slate-200'
                          }`}
                        >
                          <Clock className="w-3 h-3" />
                          {scheme.days_left != null && scheme.days_left > 0
                            ? `${scheme.days_left} days left`
                            : 'Deadline today'}
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-md text-[10px] bg-slate-100 text-slate-600">
                          Ongoing
                        </span>
                      )}
                    </div>

                    {/* Title & Authority */}
                    <div>
                      <h3 className="text-base font-bold text-slate-900 leading-snug hover:text-blue-600 cursor-pointer"
                          onClick={() => onOpenDetailsModal ? onOpenDetailsModal(scheme) : toggleDetails(scheme.id)}>
                        {scheme.name}
                      </h3>
                      <p className="text-xs text-slate-500 mt-1 leading-normal">
                        {scheme.authority}
                      </p>
                    </div>

                    {/* Award Highlight */}
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">
                          Disbursement / Benefit
                        </span>
                        <p className="text-sm font-black text-emerald-700 mt-0.5">
                          {scheme.award_amount}
                        </p>
                      </div>
                      {scheme.deadline && (
                        <div className="text-right">
                          <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">
                            Last Date
                          </span>
                          <span className="text-xs font-semibold text-slate-700 mt-0.5 flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-slate-400" />
                            {scheme.deadline}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Key Criteria Preview Chips */}
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                        Statutory Rules ({scheme.criteria_count} conditions)
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {scheme.criteria_preview.slice(0, 2).map((crit, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] bg-slate-50 text-slate-700 border border-slate-200 truncate max-w-full"
                          >
                            <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600 shrink-0" />
                            <span className="truncate">{crit}</span>
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Expandable Criteria Details */}
                    {isExpanded && (
                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2 mt-2">
                        <p className="font-bold text-blue-800 text-[11px]">Required Statutory Proofs:</p>
                        <div className="flex flex-wrap gap-1">
                          {scheme.required_documents.map((doc, i) => (
                            <span
                              key={i}
                              className="px-2 py-0.5 rounded text-[10px] bg-blue-50 text-blue-700 border border-blue-200"
                            >
                              {doc.replace(/_/g, ' ')}
                            </span>
                          ))}
                        </div>
                        <p className="font-bold text-slate-700 text-[11px] pt-1">All Eligibility Rules:</p>
                        <ul className="space-y-1 text-[11px] text-slate-600 list-disc pl-4">
                          {scheme.criteria_preview.map((c, i) => (
                            <li key={i}>{c}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* Actions Footer */}
                  <div className="pt-4 mt-3 border-t border-[#e2ebe5] flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center space-x-1.5">
                      <button
                        type="button"
                        onClick={() => onOpenDetailsModal ? onOpenDetailsModal(scheme) : toggleDetails(scheme.id)}
                        className="text-xs font-semibold text-[#047857] hover:text-[#065f46] px-2.5 py-1.5 rounded-lg hover:bg-[#ecfdf5] transition-colors cursor-pointer"
                      >
                        Official Details
                      </button>
                      <button
                        type="button"
                        onClick={() => onTrackScholarship(scheme)}
                        className="text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-2.5 py-1.5 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                        title="Add to Application Tracker"
                      >
                        <BookmarkPlus className="w-3.5 h-3.5" />
                        <span>Track</span>
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => onCheckEligibility(scheme.id)}
                      className="flex items-center space-x-1 px-3.5 py-1.5 rounded-lg bg-[#047857] hover:bg-[#065f46] text-white font-semibold text-xs shadow-xs transition-all cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Check Eligibility</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
