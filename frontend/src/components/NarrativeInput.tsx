import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, MessageSquareText, Volume2, AlertCircle, Languages } from 'lucide-react';

interface NarrativeInputProps {
  value: string;
  onChange: (val: string) => void;
  disabled?: boolean;
}

export const NarrativeInput: React.FC<NarrativeInputProps> = ({
  value,
  onChange,
  disabled = false,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);
  const [speechError, setSpeechError] = useState<string | null>(null);
  const [speechLang, setSpeechLang] = useState<'en-IN' | 'hi-IN'>('en-IN');
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setSpeechSupported(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = speechLang;

      recognition.onresult = (event: any) => {
        let currentTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }
        if (currentTranscript.trim()) {
          onChange(value ? `${value} ${currentTranscript.trim()}` : currentTranscript.trim());
        }
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        if (event.error === 'not-allowed') {
          setSpeechError('Microphone permission denied. Please allow microphone access in browser.');
        } else {
          setSpeechError(`Voice error: ${event.error}`);
        }
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
    } catch (e) {
      setSpeechSupported(false);
    }
  }, [value, onChange, speechLang]);

  const toggleRecording = () => {
    if (!speechSupported || !recognitionRef.current) return;
    setSpeechError(null);

    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsRecording(true);
      } catch (e) {
        console.error('Failed to start speech recognition', e);
      }
    }
  };

  const charCount = value.length;
  const maxChars = 1000;

  return (
    <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs relative">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 mb-3">
        <div className="flex items-center space-x-2">
          <MessageSquareText className="w-5 h-5 text-blue-600" />
          <h2 className="text-sm font-bold text-slate-900 tracking-wide">
            1. Tell Us About Your Academic & Household Situation <span className="text-xs text-slate-500 font-normal">(अपनी स्थिति बताएं)</span>
          </h2>
        </div>

        {/* Voice Input & Language Selector */}
        <div className="flex items-center space-x-2">
          {/* Language selector toggle */}
          <div className="flex items-center bg-slate-100 border border-slate-200 rounded-lg p-0.5 text-xs">
            <Languages className="w-3.5 h-3.5 text-slate-500 ml-1.5 mr-1" />
            <button
              type="button"
              onClick={() => setSpeechLang('en-IN')}
              className={`px-2 py-1 rounded-md text-[11px] font-semibold transition-colors cursor-pointer ${
                speechLang === 'en-IN' ? 'bg-white text-blue-700 font-bold shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              English
            </button>
            <button
              type="button"
              onClick={() => setSpeechLang('hi-IN')}
              className={`px-2 py-1 rounded-md text-[11px] font-semibold transition-colors cursor-pointer ${
                speechLang === 'hi-IN' ? 'bg-white text-blue-700 font-bold shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              हिन्दी
            </button>
          </div>

          {speechSupported ? (
            <button
              type="button"
              onClick={toggleRecording}
              disabled={disabled}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                isRecording
                  ? 'bg-rose-600 text-white'
                  : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-300 shadow-xs'
              }`}
            >
              {isRecording ? (
                <>
                  <MicOff className="w-3.5 h-3.5" />
                  <span>Listening (Stop)</span>
                </>
              ) : (
                <>
                  <Mic className="w-3.5 h-3.5 text-blue-600" />
                  <span>Voice Record</span>
                </>
              )}
            </button>
          ) : (
            <span className="text-[11px] text-slate-500 flex items-center gap-1">
              <Volume2 className="w-3 h-3" /> Voice degrades to text
            </span>
          )}
        </div>
      </div>

      <p className="text-xs text-slate-500 mb-2.5">
        Describe your course, college, marks, annual family income, category, or challenges. Voice supports both English & हिन्दी.
      </p>

      {speechError && (
        <div className="mb-2.5 p-2 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center space-x-2">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{speechError}</span>
        </div>
      )}

      <div className="relative">
        <textarea
          rows={4}
          value={value}
          maxLength={maxChars}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
          placeholder="e.g. I am a 1st year B.Tech student at NITK. My 12th percentage is 84.5% and our family annual income is ₹2,20,000. I belong to General category and hold all required marksheets... (या हिन्दी में: मैं बी.टेक प्रथम वर्ष का छात्र हूँ...)"
          className="w-full p-3.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 resize-none transition-all leading-relaxed shadow-xs"
        />

        <div className="flex items-center justify-between mt-1 text-[11px] text-slate-500">
          <span>ScholarTack uses Gemini to extract facts. Pure Python rules verify statutory eligibility.</span>
          <span className={charCount > maxChars * 0.9 ? 'text-amber-600 font-bold' : ''}>
            {charCount}/{maxChars}
          </span>
        </div>
      </div>
    </div>
  );
};