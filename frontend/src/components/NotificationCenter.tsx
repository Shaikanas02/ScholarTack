import React, { useState } from 'react';
import { Bell, Clock, AlertCircle, Sparkles, ExternalLink, X, CheckCheck } from 'lucide-react';
import type { NotificationItem } from '../types';

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationItem[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onSelectScholarshipAction?: (scholarshipId: string) => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onSelectScholarshipAction,
}) => {
  const [filter, setFilter] = useState<'all' | 'unread' | 'deadline'>('all');

  if (!isOpen) return null;

  const filtered = notifications.filter((n) => {
    if (filter === 'unread') return !n.is_read;
    if (filter === 'deadline') return n.type === 'deadline';
    return true;
  });

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end p-4 sm:p-6 bg-slate-900/30 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] mt-12 sm:mt-14 animate-in slide-in-from-right-4 duration-200">
        {/* Header */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                ScholarTack Notifications
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-600 text-white">
                    {unreadCount} new
                  </span>
                )}
              </h3>
              <p className="text-[11px] text-slate-500">Deadlines, portal openings & alerts</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={onMarkAllAsRead}
                className="text-[11px] text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1 cursor-pointer"
                title="Mark all as read"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Mark read</span>
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Filter tabs */}
        <div className="px-4 py-2 bg-slate-50/80 border-b border-slate-200 flex items-center space-x-1.5">
          {(['all', 'unread', 'deadline'] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setFilter(tab)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize transition-colors cursor-pointer ${
                filter === tab
                  ? 'bg-white text-blue-700 border border-slate-200 shadow-xs font-bold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {tab === 'all' ? 'All Updates' : tab === 'unread' ? 'Unread' : 'Deadlines'}
            </button>
          ))}
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5 divide-y divide-slate-100">
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs">
              <Bell className="w-8 h-8 mx-auto mb-2 opacity-30 text-slate-400" />
              <p>No notifications matching this filter.</p>
            </div>
          ) : (
            filtered.map((item) => (
              <div
                key={item.id}
                className={`pt-2.5 first:pt-0 flex items-start gap-3 p-3 rounded-xl transition-all ${
                  item.is_read ? 'bg-white border border-slate-100 hover:border-slate-200' : 'bg-blue-50/60 border border-blue-200/80 shadow-xs'
                }`}
              >
                <div className="mt-0.5">
                  {item.type === 'deadline' ? (
                    <div className="w-6 h-6 rounded-md bg-rose-100 text-rose-600 flex items-center justify-center">
                      <Clock className="w-3.5 h-3.5" />
                    </div>
                  ) : item.type === 'alert' ? (
                    <div className="w-6 h-6 rounded-md bg-amber-100 text-amber-600 flex items-center justify-center">
                      <AlertCircle className="w-3.5 h-3.5" />
                    </div>
                  ) : (
                    <div className="w-6 h-6 rounded-md bg-blue-100 text-blue-600 flex items-center justify-center">
                      <Sparkles className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <p className="text-xs font-bold text-slate-900">{item.title}</p>
                    <span className="text-[10px] text-slate-400 font-medium shrink-0">{item.timestamp}</span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">{item.message}</p>

                  <div className="mt-2.5 flex items-center gap-2">
                    {item.scholarship_id && onSelectScholarshipAction && (
                      <button
                        type="button"
                        onClick={() => {
                          onMarkAsRead(item.id);
                          onSelectScholarshipAction(item.scholarship_id!);
                          onClose();
                        }}
                        className="text-[11px] font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
                      >
                        Check Eligibility & Details
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    )}
                    {!item.is_read && (
                      <button
                        type="button"
                        onClick={() => onMarkAsRead(item.id)}
                        className="text-[10px] text-slate-400 hover:text-slate-700 ml-auto font-medium cursor-pointer"
                      >
                        Mark as read
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};