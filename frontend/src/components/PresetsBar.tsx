import React from 'react';
import { GraduationCap, Sparkles, Rocket, ArrowRight } from 'lucide-react';

export interface PresetPersona {
  id: string;
  name: string;
  role: string;
  tag: string;
  badgeColor: string;
  icon: React.ComponentType<{ className?: string }>;
  narrative: string;
  mockFiles: { name: string; type: string; label: string }[];
}

export const PRESETS: PresetPersona[] = [
  {
    id: 'anas',
    name: 'Shaik Mohammed Anas',
    role: 'B.E. Computer Science (1GC23CS138) • Ghousia College Of Engineering',
    tag: 'Central Sector + State Merit',
    badgeColor: 'text-emerald-700 bg-emerald-50 border-emerald-200',
    icon: GraduationCap,
    narrative:
      'I am Shaik Mohammed Anas (USN: 1GC23CS138), age 19. I am studying 2nd year B.E. Computer Science & Engineering at Ghousia College Of Engineering. I scored 84.5% in qualifying examinations. Our family annual income is ₹2,20,000. I have my marks card, Ghousia college admission receipt, income certificate under ₹2.5L, and Aadhaar card.',
    mockFiles: [
      { name: 'marksheet_1gc23cs138_84.5pct.jpg', type: 'image/jpeg', label: 'Marks Card (84.5%)' },
      { name: 'income_certificate_2.2lakh.jpg', type: 'image/jpeg', label: 'Income Certificate (₹2.2L)' },
      { name: 'ghousia_admission_receipt.jpg', type: 'image/jpeg', label: 'Ghousia College Fee Receipt' },
      { name: 'aadhaar_anas_demo.jpg', type: 'image/jpeg', label: 'Aadhaar Card' },
    ],
  },
  {
    id: 'shiyaz',
    name: 'Shiyaz Abdul Azeez',
    role: 'B.E. Computer Science (1GC23CS144) • Ghousia College Of Engineering',
    tag: 'Post-Matric SC & SSP Karnataka',
    badgeColor: 'text-emerald-700 bg-emerald-50 border-emerald-200',
    icon: GraduationCap,
    narrative:
      'My name is Shiyaz Abdul Azeez (USN: 1GC23CS144), age 20. I am studying 2nd year B.E. Computer Science & Engineering at Ghousia College Of Engineering, Karnataka. I belong to the Scheduled Caste (SC) category and our family annual income is ₹1,80,000. I scored 76% in qualifying exams. I have my caste certificate, income certificate, and domicile proof.',
    mockFiles: [
      { name: 'caste_certificate_sc.jpg', type: 'image/jpeg', label: 'SC Caste Certificate' },
      { name: 'income_certificate_1.8lakh.jpg', type: 'image/jpeg', label: 'Income Certificate' },
      { name: 'ghousia_marksheet_shiyaz.jpg', type: 'image/jpeg', label: 'Ghousia College Marks Card' },
      { name: 'aadhaar_shiyaz_demo.jpg', type: 'image/jpeg', label: 'Aadhaar Card' },
    ],
  },
  {
    id: 'saqib',
    name: 'Saqib Khan',
    role: 'Differently-Abled B.E. (1GC23CS134) • Ghousia College Of Engineering',
    tag: 'AICTE Saksham & Top Class PwD',
    badgeColor: 'text-teal-700 bg-teal-50 border-teal-200',
    icon: GraduationCap,
    narrative:
      'My name is Saqib Khan (USN: 1GC23CS134), age 19. I am a 2nd year B.E. Computer Science & Engineering student at Ghousia College Of Engineering. I have a qualifying disability of 40%+ (PwD certificate available). Our family annual income is ₹3,00,000 and I scored 82% in my qualifying board examinations.',
    mockFiles: [
      { name: 'disability_certificate_pwd.jpg', type: 'image/jpeg', label: 'Disability Certificate (40%+)' },
      { name: 'marksheet_saqib_82pct.jpg', type: 'image/jpeg', label: 'Marks Card (82%)' },
      { name: 'ghousia_college_id_saqib.jpg', type: 'image/jpeg', label: 'Ghousia College ID Card' },
      { name: 'aadhaar_saqib_demo.jpg', type: 'image/jpeg', label: 'Aadhaar Card' },
    ],
  },
  {
    id: 'rumaiz',
    name: 'Mohammed Rumaiz',
    role: 'B.E. Computer Science (1GC23CS083) • Ghousia College Of Engineering',
    tag: 'Post-Matric ST & National Fellowship',
    badgeColor: 'text-emerald-700 bg-emerald-50 border-emerald-200',
    icon: GraduationCap,
    narrative:
      'I am Mohammed Rumaiz (USN: 1GC23CS083), age 20. I am studying 2nd year B.E. Computer Science & Engineering at Ghousia College Of Engineering. I belong to the ST category with family annual income ₹2,40,000. I have my marks card (81%), college bonafide certificate, caste certificate, and income certificate.',
    mockFiles: [
      { name: 'caste_certificate_st.jpg', type: 'image/jpeg', label: 'ST Caste Certificate' },
      { name: 'income_certificate_2.4lakh.jpg', type: 'image/jpeg', label: 'Income Certificate (₹2.4L)' },
      { name: 'ghousia_transcript_81pct.jpg', type: 'image/jpeg', label: 'Marks Card (81%)' },
      { name: 'aadhaar_rumaiz_demo.jpg', type: 'image/jpeg', label: 'Aadhaar Card' },
    ],
  },
];

interface PresetsBarProps {
  onSelectPreset: (preset: PresetPersona) => void;
  onTryDemoCase: () => void;
  activePresetId?: string;
  loading?: boolean;
}

export const PresetsBar: React.FC<PresetsBarProps> = ({
  onSelectPreset,
  onTryDemoCase,
  activePresetId,
  loading = false,
}) => {
  return (
    <div className="w-full max-w-5xl mx-auto mb-6 px-2 space-y-3">
      {/* FEATURE 3 — ONE-CLICK DEMO MODE HERO BUTTON */}
      <div className="p-5 rounded-2xl bg-blue-50/70 border border-blue-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start space-x-2">
            <Rocket className="w-4 h-4 text-blue-600 animate-bounce" />
            <span className="text-xs font-bold uppercase tracking-wider text-blue-700">
              One-Click Verification Demo
            </span>
          </div>
          <h3 className="text-base font-bold text-slate-900">
            Evaluate ScholarTack in One Click
          </h3>
          <p className="text-xs text-slate-600 max-w-xl">
            Loads a realistic student case to demonstrate the complete pipeline:
            <strong className="text-emerald-700"> 1 Eligible Scheme</strong>, <strong className="text-rose-700">1 Ineligible Scheme</strong>, and <strong className="text-amber-700">1 Missing-Proof Scheme</strong> with full Proof Ledger & PDF output.
          </p>
        </div>

        <button
          type="button"
          onClick={onTryDemoCase}
          disabled={loading}
          className="w-full sm:w-auto px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs flex items-center justify-center space-x-2 transition-all cursor-pointer shrink-0 disabled:opacity-50"
        >
          <Rocket className="w-4 h-4" />
          <span>🚀 Try Demo Case</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Persona Presets Row */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
              Or Select Specific Test Persona:
            </h4>
          </div>
          <span className="text-[11px] text-slate-500 hidden sm:inline">
            Click any persona to load custom inputs
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {PRESETS.map((preset) => {
            const Icon = preset.icon;
            const isSelected = activePresetId === preset.id;

            return (
              <button
                key={preset.id}
                onClick={() => onSelectPreset(preset)}
                disabled={loading}
                className={`p-3 rounded-xl text-left border transition-all relative overflow-hidden cursor-pointer ${
                  isSelected
                    ? 'bg-blue-50/80 border-blue-400 shadow-xs ring-1 ring-blue-300'
                    : 'bg-slate-50 hover:bg-slate-100 border-slate-200'
                }`}
              >
                <div className="flex items-start justify-between mb-1.5">
                  <div className="flex items-center space-x-2">
                    <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900 leading-tight">{preset.name}</p>
                      <p className="text-[10px] text-slate-500">{preset.role}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-2 flex items-center justify-between">
                  <span
                    className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold border ${preset.badgeColor}`}
                  >
                    {preset.tag}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {preset.mockFiles.length} docs
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};