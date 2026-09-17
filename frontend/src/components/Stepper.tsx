import React from 'react';
import { FileText, Search, CheckCircle2, Award } from 'lucide-react';

interface StepperProps {
  currentStep: number;
  onStepClick: (step: number) => void;
  maxReachedStep: number;
}

export const Stepper: React.FC<StepperProps> = ({
  currentStep,
  onStepClick,
  maxReachedStep,
}) => {
  const steps = [
    { number: 1, label: 'Story & Documents', icon: FileText, desc: 'Messy input' },
    { number: 2, label: 'Facts & Provenance', icon: Search, desc: 'Gemini extraction' },
    { number: 3, label: 'Proof Ledger', icon: CheckCircle2, desc: 'Deterministic rules' },
    { number: 4, label: 'Claim & PDF', icon: Award, desc: 'Official next steps' },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto my-4 px-2">
      <div className="grid grid-cols-4 gap-2 sm:gap-3">
        {steps.map((s) => {
          const Icon = s.icon;
          const isActive = currentStep === s.number;
          const isCompleted = currentStep > s.number;
          const isClickable = s.number <= maxReachedStep;

          return (
            <button
              key={s.number}
              onClick={() => isClickable && onStepClick(s.number)}
              disabled={!isClickable}
              className={`flex flex-col sm:flex-row items-center sm:items-start p-3 rounded-xl text-left border transition-all ${
                isActive
                  ? 'bg-blue-50/70 border-blue-400 shadow-xs ring-1 ring-blue-300'
                  : isCompleted
                  ? 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 cursor-pointer shadow-xs'
                  : 'bg-slate-50 border-slate-200/60 text-slate-400 opacity-60 cursor-not-allowed'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mb-1 sm:mb-0 sm:mr-3 ${
                  isActive
                    ? 'bg-blue-600 text-white font-bold shadow-xs'
                    : isCompleted
                    ? 'bg-emerald-100 text-emerald-700 font-semibold'
                    : 'bg-slate-200 text-slate-500 font-medium'
                }`}
              >
                {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
              </div>
              <div className="hidden sm:block min-w-0">
                <p
                  className={`text-xs font-bold truncate ${
                    isActive ? 'text-blue-900' : isCompleted ? 'text-slate-800' : 'text-slate-500'
                  }`}
                >
                  {s.label}
                </p>
                <p className="text-[11px] text-slate-500 truncate">{s.desc}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};