import React, { useRef } from 'react';
import { UploadCloud, X, FileCheck } from 'lucide-react';

interface DocumentUploadProps {
  files: File[];
  onFilesChange: (files: File[]) => void;
  disabled?: boolean;
}

export const DocumentUpload: React.FC<DocumentUploadProps> = ({
  files,
  onFilesChange,
  disabled = false,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (disabled) return;
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      addFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      addFiles(Array.from(e.target.files));
    }
  };

  const addFiles = (newFiles: File[]) => {
    const combined = [...files, ...newFiles];
    if (combined.length > 8) {
      alert('Maximum 8 documents allowed per analysis request.');
      onFilesChange(combined.slice(0, 8));
    } else {
      onFilesChange(combined);
    }
  };

  const removeFile = (index: number) => {
    onFilesChange(files.filter((_, i) => i !== index));
  };

  // Helper to create synthetic sample documents for testing without local images
  const addSampleFile = (name: string) => {
    const jpegHeader = new Uint8Array([0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46, 0x49, 0x46]);
    const blob = new Blob([jpegHeader, `Sample government document content for ${name}`], { type: 'image/jpeg' });
    const file = new (window as any).File([blob], name, { type: 'image/jpeg' }) as File;
    addFiles([file]);
  };

  const sampleButtons = [
    { name: 'marksheet_class12.jpg', label: '+ 12th Marksheet' },
    { name: 'income_certificate.jpg', label: '+ Income Certificate' },
    { name: 'caste_certificate.jpg', label: '+ Caste Certificate' },
    { name: 'fee_receipt.jpg', label: '+ Fee Receipt' },
    { name: 'aadhaar_identity.jpg', label: '+ Aadhaar Card' },
    { name: 'domicile_certificate.jpg', label: '+ Domicile Proof' },
  ];

  return (
    <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs relative">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <UploadCloud className="w-5 h-5 text-blue-600" />
          <h2 className="text-sm font-bold text-slate-900 tracking-wide">
            2. Upload Document Evidence
          </h2>
        </div>
        <span className="text-xs font-semibold text-slate-500">
          {files.length}/8 images attached
        </span>
      </div>

      <p className="text-xs text-slate-500 mb-3">
        Upload 1–8 document photos in any order (Marksheet, Income certificate, Fee receipt, Caste certificate, Aadhaar).
        No manual labelling required — Gemini classifies automatically.
      </p>

      {/* Drag and Drop Zone */}
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        onClick={() => !disabled && fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all ${
          disabled
            ? 'opacity-50 cursor-not-allowed border-slate-200 bg-slate-50'
            : 'border-slate-300 hover:border-blue-400 bg-slate-50/70 hover:bg-blue-50/30'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp,image/heic"
          onChange={handleFileInput}
          className="hidden"
          disabled={disabled}
        />
        <div className="flex flex-col items-center justify-center">
          <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-2">
            <UploadCloud className="w-5 h-5" />
          </div>
          <p className="text-xs font-semibold text-slate-700">
            Drag & drop document images here, or <span className="text-blue-600 font-bold underline">browse files</span>
          </p>
          <p className="text-[11px] text-slate-400 mt-1">
            JPEG, PNG, WEBP, HEIC (Max 8 MB per image, total 25 MB)
          </p>
        </div>
      </div>

      {/* Sample Document Quick Add */}
      <div className="mt-3">
        <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
          Or attach realistic sample student verification documents:
        </p>
        <div className="flex flex-wrap gap-1.5">
          {sampleButtons.map((btn) => (
            <button
              key={btn.name}
              type="button"
              disabled={disabled || files.length >= 8}
              onClick={() => addSampleFile(btn.name)}
              className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-colors cursor-pointer"
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>

      {/* Uploaded File List */}
      {files.length > 0 && (
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {files.map((file, idx) => (
            <div
              key={`${file.name}-${idx}`}
              className="p-2.5 rounded-xl bg-white border border-slate-200 shadow-xs flex items-center justify-between text-xs relative group overflow-hidden"
            >
              <div className="flex items-center space-x-2 min-w-0">
                <FileCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="truncate text-slate-800 text-xs font-medium" title={file.name}>
                  {file.name}
                </span>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeFile(idx);
                }}
                disabled={disabled}
                className="w-5 h-5 rounded-md flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 shrink-0 transition-colors ml-1 cursor-pointer"
                title="Remove file"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};