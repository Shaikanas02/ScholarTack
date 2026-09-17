import React from 'react';
import {
  GraduationCap,
  Bell,
  User,
  LayoutDashboard,
  ListFilter,
  FileCheck2,
  Sparkles,
  FileText,
} from 'lucide-react';

export type AppView =
  | 'scholarships'
  | 'profile'
  | 'matched'
  | 'tracker'
  | 'checklist'
  | 'checker'
  | 'students_new'
  | 'students_all';


interface HeaderProps {
  serverStatus: { status: string; version: string; packs_loaded: number } | null;
  activeView: AppView;
  onSelectView: (view: AppView) => void;
  unreadNotifsCount: number;
  onOpenNotifications: () => void;
  onOpenReport: () => void;
  matchedCount?: number;
  profileCompletion?: number;
}

export const Header: React.FC<HeaderProps> = ({
  serverStatus,
  activeView,
  onSelectView,
  unreadNotifsCount,
  onOpenNotifications,
  onOpenReport,
  matchedCount = 0,
  profileCompletion = 85,
}) => {
  return (
    <header className="sticky top-0 z-40 border-b border-[#e2ebe5] bg-white/95 backdrop-blur-md shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2 sm:gap-4">
        {/* Logo & Brand */}
        <div
          onClick={() => onSelectView('scholarships')}
          className="flex items-center space-x-3 cursor-pointer shrink-0"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#047857] to-[#065f46] flex items-center justify-center shadow-md shadow-[#047857]/20">
            <GraduationCap className="w-6 h-6 text-white stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-black tracking-tight text-[#0f172a]">
                ScholarTack
              </h1>
            </div>
            <p className="text-[11px] text-[#52665a] font-medium hidden sm:block">
              Institutional Student Scholarship Intelligence Platform
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="hidden lg:flex items-center space-x-1 p-1 rounded-xl bg-[#f1f6f3] border border-[#e2ebe5] text-xs">
          <button
            type="button"
            onClick={() => onSelectView('scholarships')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
              activeView === 'scholarships'
                ? 'bg-white text-[#047857] shadow-xs border border-[#e2ebe5]'
                : 'text-[#52665a] hover:text-[#0f172a] hover:bg-[#e4ede7]'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Scholarships</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectView('profile')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
              activeView === 'profile' || activeView === 'students_new' || activeView === 'students_all'
                ? 'bg-white text-[#047857] shadow-xs border border-[#e2ebe5]'
                : 'text-[#52665a] hover:text-[#0f172a] hover:bg-[#e4ede7]'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>My Profile</span>
            {profileCompletion > 0 && (
              <span className="ml-1 text-[10px] px-1.5 py-0.2 rounded-full bg-[#ecfdf5] text-[#047857] border border-[#a7f3d0] font-bold">
                {profileCompletion}%
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => onSelectView('matched')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
              activeView === 'matched'
                ? 'bg-white text-[#047857] shadow-xs border border-[#e2ebe5]'
                : 'text-[#52665a] hover:text-[#0f172a] hover:bg-[#e4ede7]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#059669]" />
            <span>Matched Schemes</span>
            {matchedCount > 0 && (
              <span className="ml-1 text-[10px] px-1.5 py-0.2 rounded-full bg-[#ecfdf5] text-[#047857] border border-[#a7f3d0] font-extrabold">
                {matchedCount}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => onSelectView('tracker')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
              activeView === 'tracker'
                ? 'bg-white text-[#047857] shadow-xs border border-[#e2ebe5]'
                : 'text-[#52665a] hover:text-[#0f172a] hover:bg-[#e4ede7]'
            }`}
          >
            <ListFilter className="w-3.5 h-3.5" />
            <span>Application Tracker</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectView('checklist')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
              activeView === 'checklist'
                ? 'bg-white text-[#047857] shadow-xs border border-[#e2ebe5]'
                : 'text-[#52665a] hover:text-[#0f172a] hover:bg-[#e4ede7]'
            }`}
          >
            <FileCheck2 className="w-3.5 h-3.5 text-[#059669]" />
            <span>Documents</span>
          </button>
        </nav>

        {/* Right Actions: Institutional Report, Notification Bell, Server status */}
        <div className="flex items-center space-x-2 sm:space-x-2.5">
          {serverStatus && (
            <div className="hidden xl:flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-[11px] text-slate-700 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>{serverStatus.packs_loaded} Statutory Schemes</span>
            </div>
          )}

          {/* Institutional Report Button */}
          <button
            type="button"
            onClick={onOpenReport}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 shadow-xs transition-all cursor-pointer"
            title="Open and print complete institutional eligibility report"
          >
            <FileText className="w-3.5 h-3.5 text-blue-600" />
            <span className="hidden sm:inline">Report</span>
          </button>

          {/* Notification Bell with Badge */}
          <button
            type="button"
            onClick={onOpenNotifications}
            className="relative p-2 rounded-xl text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 shadow-xs transition-colors cursor-pointer"
            title="Open Notifications & Deadlines"
          >
            <Bell className="w-4 h-4" />
            {unreadNotifsCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-600 text-white text-[9px] font-black flex items-center justify-center shadow-xs animate-bounce">
                {unreadNotifsCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Sub-Navigation Bar */}
      <div className="lg:hidden flex items-center justify-around px-2 py-2 bg-white border-t border-[#e2ebe5] text-[11px] overflow-x-auto">
        <button
          type="button"
          onClick={() => onSelectView('scholarships')}
          className={`flex items-center gap-1 py-1 px-2 rounded-lg font-semibold shrink-0 ${
            activeView === 'scholarships' ? 'text-[#047857] bg-[#ecfdf5] font-bold' : 'text-[#52665a]'
          }`}
        >
          <LayoutDashboard className="w-3.5 h-3.5" />
          <span>Scholarships</span>
        </button>

        <button
          type="button"
          onClick={() => onSelectView('profile')}
          className={`flex items-center gap-1 py-1 px-2 rounded-lg font-semibold shrink-0 ${
            activeView === 'profile' || activeView === 'students_new' || activeView === 'students_all'
              ? 'text-[#047857] bg-[#ecfdf5] font-bold'
              : 'text-[#52665a]'
          }`}
        >
          <User className="w-3.5 h-3.5" />
          <span>Profile {profileCompletion > 0 && `(${profileCompletion}%)`}</span>
        </button>

        <button
          type="button"
          onClick={() => onSelectView('matched')}
          className={`flex items-center gap-1 py-1 px-2 rounded-lg font-semibold shrink-0 ${
            activeView === 'matched' ? 'text-[#047857] bg-[#ecfdf5] font-bold' : 'text-[#52665a]'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Matched {matchedCount > 0 && `(${matchedCount})`}</span>
        </button>

        <button
          type="button"
          onClick={() => onSelectView('tracker')}
          className={`flex items-center gap-1 py-1 px-2 rounded-lg font-semibold shrink-0 ${
            activeView === 'tracker' ? 'text-[#047857] bg-[#ecfdf5] font-bold' : 'text-[#52665a]'
          }`}
        >
          <ListFilter className="w-3.5 h-3.5" />
          <span>Tracker</span>
        </button>

        <button
          type="button"
          onClick={() => onSelectView('checklist')}
          className={`flex items-center gap-1 py-1 px-2 rounded-lg font-semibold shrink-0 ${
            activeView === 'checklist' ? 'text-[#047857] bg-[#ecfdf5] font-bold' : 'text-[#52665a]'
          }`}
        >
          <FileCheck2 className="w-3.5 h-3.5" />
          <span>Docs</span>
        </button>
      </div>
    </header>
  );
};
