import React from 'react';
import { CheckCircle2, AlertTriangle, Info, XCircle, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'warning' | 'info' | 'error';
  title: string;
  message?: string;
}

interface ToastNotificationProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastNotification: React.FC<ToastNotificationProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col space-y-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0">
      {toasts.map((toast) => {
        const icons = {
          success: <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />,
          warning: <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />,
          info: <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />,
          error: <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />,
        };

        const borderStyles = {
          success: 'border-emerald-200 bg-white shadow-lg shadow-emerald-950/5',
          warning: 'border-amber-200 bg-white shadow-lg shadow-amber-950/5',
          info: 'border-blue-200 bg-white shadow-lg shadow-blue-950/5',
          error: 'border-rose-200 bg-white shadow-lg shadow-rose-950/5',
        };

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start justify-between gap-3 p-3.5 rounded-xl border transition-all duration-300 ${borderStyles[toast.type]}`}
          >
            <div className="flex items-start space-x-2.5">
              {icons[toast.type]}
              <div className="text-xs">
                <p className="font-bold text-slate-900">{toast.title}</p>
                {toast.message && (
                  <p className="text-slate-600 mt-0.5 leading-relaxed">{toast.message}</p>
                )}
              </div>
            </div>
            <button
              type="button"
              onClick={() => onDismiss(toast.id)}
              className="text-slate-400 hover:text-slate-600 p-0.5 rounded transition-colors cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};