import { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, ArrowRight, Loader2 } from 'lucide-react';

import { Header } from './components/Header';
import type { AppView } from './components/Header';
import { Stepper } from './components/Stepper';
import { PresetsBar, PRESETS } from './components/PresetsBar';
import type { PresetPersona } from './components/PresetsBar';
import { NarrativeInput } from './components/NarrativeInput';
import { DocumentUpload } from './components/DocumentUpload';
import { FactsReview } from './components/FactsReview';
import { ProofLedger } from './components/ProofLedger';
import { ActionPanel } from './components/ActionPanel';
import { PdfModal } from './components/PdfModal';

// ScholarTack Institutional Components
import { ScholarshipDashboard } from './components/ScholarshipDashboard';
import { StudentProfilesView } from './components/StudentProfilesView';
import { calculateProfileCompletion } from './components/StudentProfileWizard';
import { PersonalizedResults } from './components/PersonalizedResults';
import { ScholarshipDetailsModal } from './components/ScholarshipDetailsModal';
import { ApplicationTracker } from './components/ApplicationTracker';
import { DocumentChecklist, INITIAL_DOCUMENTS } from './components/DocumentChecklist';
import { InstitutionalReportModal } from './components/InstitutionalReportModal';
import { NotificationCenter } from './components/NotificationCenter';
import { ToastNotification } from './components/ToastNotification';
import type { ToastMessage } from './components/ToastNotification';
import { AddNewStudentView } from './components/AddNewStudentView';
import { AllStudentsView } from './components/AllStudentsView';

import type {
  AnalysisResponse,
  SchemeEvaluation,
  ScholarshipItem,
  ScholarshipUpdate,
  NotificationItem,
  StudentProfile,
  TrackedApplication,
  ApplicationTrackingStatus,
  ScholarshipRecommendation,
  DocumentChecklistItem,
} from './types';
import {
  checkHealth,
  analyzeHousehold,
  getScholarships,
  getScholarshipUpdates,
  getNotifications,
  getRecommendations,
} from './services/api';

const INITIAL_TRACKED_APPS: TrackedApplication[] = [
  {
    scheme_id: 'nsp_ug_merit',
    scheme_name: 'PM-USP Central Sector Scheme of Scholarship (NSP UG)',
    award_amount: '₹12,000 / year',
    portal_url: 'https://scholarships.gov.in/',
    status: 'preparing_docs',
    application_number: 'NSP/2026/UG/984210',
    applied_date: '2026-09-12',
    notes: 'Awaiting college endorsement form from HOD.',
    deadline: '2026-10-15',
  },
  {
    scheme_id: 'aicte_pragati_ug',
    scheme_name: 'AICTE Pragati Scholarship for Girls (B.Tech)',
    award_amount: '₹50,000 / year',
    portal_url: 'https://scholarships.gov.in/',
    status: 'saved',
    notes: 'Income certificate under ₹8L verified. Need to upload fee receipt.',
    deadline: '2026-09-30',
  },
];

export function App() {
  const [serverStatus, setServerStatus] = useState<{ status: string; version: string; packs_loaded: number } | null>(null);

  // Active View: default to 'scholarships' (Directory)
  const [activeView, setActiveView] = useState<AppView>('scholarships');

  // ScholarTack Core State
  const [scholarships, setScholarships] = useState<ScholarshipItem[]>([]);
  const [scholarshipsLoading, setScholarshipsLoading] = useState(false);
  const [updates, setUpdates] = useState<ScholarshipUpdate[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [recommendations, setRecommendations] = useState<ScholarshipRecommendation[]>([]);
  const [recommendationsLoading, setRecommendationsLoading] = useState(false);

  // Real Students Roster (persisted in localStorage)
  const [students, setStudents] = useState<StudentProfile[]>(() => {
    try {
      const saved = localStorage.getItem('scholartack_students');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          // Remove any legacy seeded student profiles
          const filtered = parsed.filter(
            (s: StudentProfile) =>
              !s.is_demo &&
              !s.id?.startsWith('student-real-') &&
              ![
                'Tanveer Ahmed',
                'Farhan Pasha',
                'Syeda Fatima',
                'Arjun Gowda',
                'Zeeshan Ali',
                'Darshan K',
                'Sneha Rao',
                'Vikram Joshi',
              ].includes(s.applicant_name)
          );
          localStorage.setItem('scholartack_students', JSON.stringify(filtered));
          return filtered;
        }
      }
      return [];
    } catch {
      return [];
    }
  });

  const [trackedApplications, setTrackedApplications] = useState<TrackedApplication[]>(() => {
    try {
      const saved = localStorage.getItem('scholartack_tracked_apps');
      return saved ? JSON.parse(saved) : INITIAL_TRACKED_APPS;
    } catch {
      return INITIAL_TRACKED_APPS;
    }
  });

  // Current active student profile
  const [studentProfile, setStudentProfile] = useState<StudentProfile | null>(() => {
    try {
      const saved = localStorage.getItem('scholartack_profile');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (
          !parsed ||
          parsed.id?.startsWith('student-real-') ||
          [
            'Tanveer Ahmed',
            'Farhan Pasha',
            'Syeda Fatima',
            'Arjun Gowda',
            'Zeeshan Ali',
            'Darshan K',
            'Sneha Rao',
            'Vikram Joshi',
          ].includes(parsed?.applicant_name)
        ) {
          localStorage.removeItem('scholartack_profile');
          return null;
        }
        return parsed;
      }
      return null;
    } catch {
      return null;
    }
  });

  const [editingStudent, setEditingStudent] = useState<StudentProfile | null>(null);

  const [documentChecklist] = useState<DocumentChecklistItem[]>(INITIAL_DOCUMENTS);

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const addToast = (type: ToastMessage['type'], title: string, message?: string) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };
  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Modals
  const [notifModalOpen, setNotifModalOpen] = useState(false);
  const [institutionalReportOpen, setInstitutionalReportOpen] = useState(false);
  const [selectedScholarshipModal, setSelectedScholarshipModal] = useState<ScholarshipItem | null>(null);
  const [pdfModal, setPdfModal] = useState<{ isOpen: boolean; url: string; title: string }>({
    isOpen: false,
    url: '',
    title: '',
  });

  // Eligibility Proof Checker State (Multimodal + Rule Engine)
  const [currentStep, setCurrentStep] = useState(1);
  const [maxReachedStep, setMaxReachedStep] = useState(1);
  const [narrative, setNarrative] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [conflictResolutions, setConflictResolutions] = useState<Record<string, any>>({});
  const [activePresetId, setActivePresetId] = useState<string | undefined>();
  const [isDemoData, setIsDemoData] = useState(false);
  const [checkerLoading, setCheckerLoading] = useState(false);
  const [checkerError, setCheckerError] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResponse | null>(null);
  const [selectedScheme, setSelectedScheme] = useState<SchemeEvaluation | null>(null);

  // Sync tracked applications to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('scholartack_tracked_apps', JSON.stringify(trackedApplications));
    } catch (e) {
      console.warn('Failed to save tracked applications to localStorage', e);
    }
  }, [trackedApplications]);

  // Sync profile to localStorage
  useEffect(() => {
    try {
      if (studentProfile) {
        localStorage.setItem('scholartack_profile', JSON.stringify(studentProfile));
      } else {
        localStorage.removeItem('scholartack_profile');
      }
    } catch (e) {
      console.warn('Failed to save profile to localStorage', e);
    }
  }, [studentProfile]);

  // Sync students roster to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('scholartack_students', JSON.stringify(students));
    } catch (e) {
      console.warn('Failed to save students to localStorage', e);
    }
  }, [students]);

  // Navigation with browser URL sync
  const navigateToView = (view: AppView, pushState = true) => {
    setActiveView(view);
    if (pushState) {
      if (view === 'students_new') {
        window.history.pushState({ view: 'students_new' }, '', '/students/new');
      } else if (view === 'students_all') {
        window.history.pushState({ view: 'students_all' }, '', '/students/all');
      } else if (view === 'profile') {
        window.history.pushState({ view: 'profile' }, '', '/students');
      } else if (view === 'scholarships') {
        window.history.pushState({ view: 'scholarships' }, '', '/');
      } else {
        window.history.pushState({ view }, '', `/#${view}`);
      }
    }
  };

  // Browser popstate / URL listener
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      const hash = window.location.hash.replace('#', '');
      if (path === '/students/new') {
        setActiveView('students_new');
      } else if (path === '/students/all') {
        setActiveView('students_all');
      } else if (path === '/students' || hash === 'profile') {
        setActiveView('profile');
      } else if (['scholarships', 'matched', 'tracker', 'checklist', 'checker'].includes(hash)) {
        setActiveView(hash as AppView);
      }
    };

    window.addEventListener('popstate', handlePopState);
    handlePopState();
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Update last-used timestamp and bring student to top of Recently Used
  const handleUpdateLastUsed = (studentOrId: StudentProfile | string) => {
    const targetId = typeof studentOrId === 'string' ? studentOrId : (studentOrId.id || studentOrId.student_id);
    const now = new Date().toISOString();

    setStudents((prev) => {
      const found = prev.find((s) => s.id === targetId || s.student_id === targetId);
      if (!found) {
        if (typeof studentOrId !== 'string' && !studentOrId.is_demo) {
          return [{ ...studentOrId, last_used: now }, ...prev];
        }
        return prev;
      }
      const updated = { ...found, last_used: now };
      const others = prev.filter((s) => s.id !== targetId && s.student_id !== targetId);
      return [updated, ...others];
    });

    if (typeof studentOrId !== 'string') {
      setStudentProfile({ ...studentOrId, last_used: now });
    } else {
      setStudentProfile((prev) => {
        if (prev && (prev.id === targetId || prev.student_id === targetId)) {
          return { ...prev, last_used: now };
        }
        return prev;
      });
    }
  };

  // Student Profile Actions
  const handleSelectStudent = (student: StudentProfile) => {
    handleUpdateLastUsed(student);
    addToast('info', 'Student Profile Selected', `Loaded credentials for ${student.applicant_name}.`);
  };

  const handleNavigateToAddNew = () => {
    setEditingStudent(null);
    navigateToView('students_new');
  };

  const handleEditStudent = (student: StudentProfile) => {
    handleUpdateLastUsed(student);
    setEditingStudent(student);
    navigateToView('students_new');
    addToast('info', 'Edit Profile', `Editing ${student.applicant_name}`);
  };

  const handleCheckEligibilityForStudent = (student: StudentProfile) => {
    handleUpdateLastUsed(student);
    navigateToView('matched');
    addToast('info', 'Evaluating Scholarships', `Checking statutory matches for ${student.applicant_name}.`);
  };

  const handleGenerateReportForStudent = (student: StudentProfile) => {
    handleUpdateLastUsed(student);
    setInstitutionalReportOpen(true);
  };

  const handleSaveNewStudent = (newStudent: StudentProfile) => {
    const now = new Date().toISOString();
    const prepared: StudentProfile = {
      ...newStudent,
      last_used: now,
      is_demo: false,
    };
    setStudents((prev) => [
      prepared,
      ...prev.filter((s) => s.id !== prepared.id && s.student_id !== prepared.student_id),
    ]);
    setStudentProfile(prepared);
    setEditingStudent(null);
    navigateToView('profile');
    addToast('success', 'Student Profile Saved', `${prepared.applicant_name} has been added to Recently Used.`);
  };

  const handleDeleteStudent = (studentId: string) => {
    setStudents((prev) => prev.filter((s) => s.id !== studentId && s.student_id !== studentId));
    if (studentProfile?.id === studentId || studentProfile?.student_id === studentId) {
      setStudentProfile(null);
    }
    addToast('info', 'Student Profile Removed');
  };

  // Load server status & ScholarTack data on mount
  useEffect(() => {
    checkHealth()
      .then((status) => setServerStatus(status))
      .catch((err) => console.warn('Could not connect to backend healthz:', err));

    setScholarshipsLoading(true);
    Promise.all([getScholarships(), getScholarshipUpdates(), getNotifications()])
      .then(([schs, upds, notifs]) => {
        setScholarships(schs);
        setUpdates(upds);
        setNotifications(notifs);

        // Check for closing soon deadlines and show initial popup
        const urgent = schs.filter((s) => s.days_left != null && s.days_left <= 15);
        if (urgent.length > 0) {
          addToast(
            'warning',
            'Important Deadline Alert',
            `${urgent[0].name} closes in ${urgent[0].days_left} days! Check eligibility to apply early.`
          );
        }
      })
      .catch((err) => console.warn('Could not load scholarship directory:', err))
      .finally(() => setScholarshipsLoading(false));
  }, []);

  // Compute recommendations whenever studentProfile changes
  useEffect(() => {
    if (!studentProfile) {
      setRecommendations([]);
      return;
    }
    setRecommendationsLoading(true);
    getRecommendations(studentProfile)
      .then((recs) => {
        setRecommendations(recs);
      })
      .catch((err) => {
        console.warn('Could not compute recommendations:', err);
      })
      .finally(() => setRecommendationsLoading(false));
  }, [studentProfile]);

  // Handlers: Notifications
  const handleMarkAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
    );
  };
  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    addToast('info', 'All notifications marked as read');
  };
  const unreadNotifsCount = notifications.filter((n) => !n.is_read).length;

  // Handlers: Track Scholarship
  const handleTrackScholarship = (scholarship: ScholarshipItem) => {
    const existing = trackedApplications.find((a) => a.scheme_id === scholarship.id);
    if (existing) {
      addToast('info', 'Already in Tracker', `${scholarship.name} is already in your application pipeline.`);
      setActiveView('tracker');
      return;
    }
    const newApp: TrackedApplication = {
      scheme_id: scholarship.id,
      scheme_name: scholarship.name,
      award_amount: scholarship.award_amount,
      portal_url: scholarship.source_url,
      status: 'saved',
      deadline: scholarship.deadline,
      notes: `Targeting submission before ${scholarship.deadline || 'deadline'}.`,
    };
    setTrackedApplications((prev) => [newApp, ...prev]);
    addToast('success', 'Added to Application Tracker', `${scholarship.name} has been added.`);
    setActiveView('tracker');
  };

  const handleUpdateAppStatus = (schemeId: string, newStatus: ApplicationTrackingStatus) => {
    setTrackedApplications((prev) =>
      prev.map((a) => (a.scheme_id === schemeId ? { ...a, status: newStatus } : a))
    );
    addToast('success', 'Application Status Updated', `Moved to ${newStatus.replace('_', ' ')}.`);
  };

  const handleUpdateAppNotes = (schemeId: string, notes: string, appNum?: string) => {
    setTrackedApplications((prev) =>
      prev.map((a) =>
        a.scheme_id === schemeId
          ? { ...a, notes, application_number: appNum !== undefined ? appNum : a.application_number }
          : a
      )
    );
    addToast('info', 'Notes & Application Reference Saved');
  };

  const handleDeleteApplication = (schemeId: string) => {
    setTrackedApplications((prev) => prev.filter((a) => a.scheme_id !== schemeId));
    addToast('info', 'Removed from Application Tracker');
  };



  // Open Scholarship Details Modal
  const handleOpenScholarshipDetailsById = (schemeId: string) => {
    const found = scholarships.find((s) => s.id === schemeId);
    if (found) {
      setSelectedScholarshipModal(found);
    }
  };

  // Check Eligibility For Scheme (Routes to Checker)
  const handleCheckEligibilityForScheme = (schemeId: string) => {
    const matchedPreset = PRESETS.find(
      (p) => p.id.toLowerCase().includes(schemeId.toLowerCase()) || p.tag.toLowerCase().includes(schemeId.replace(/_/g, ' '))
    );
    if (matchedPreset) {
      handleSelectPreset(matchedPreset);
    } else {
      const incStr = studentProfile?.annual_family_income ? `My annual family income is ₹${studentProfile.annual_family_income}.` : '';
      const pctStr = studentProfile?.academic_percentage ? `I have scored ${studentProfile.academic_percentage}% marks in qualifying exams.` : '';
      setNarrative(
        `I am a student seeking financial aid for my college studies. ${incStr} ${pctStr}`.trim()
      );
    }
    setActiveView('checker');
    setCurrentStep(1);
    addToast('info', 'Checking Scheme Rules', `Pre-loaded verification for ${schemeId}.`);
  };

  // Eligibility Checker Handlers
  const handleSelectPreset = (preset: PresetPersona) => {
    setActivePresetId(preset.id);
    setIsDemoData(true);
    setNarrative(preset.narrative);
    setFiles([]);
    setConflictResolutions({});
  };

  const handleTryDemoCase = async () => {
    const preset = PRESETS[0];
    setActivePresetId(preset.id);
    setIsDemoData(true);
    setNarrative(preset.narrative);
    setFiles([]);
    setConflictResolutions({});
    setCheckerLoading(true);
    setCheckerError(null);

    try {
      const result = await analyzeHousehold(preset.narrative, [], {});
      setAnalysisResult(result);
      setCurrentStep(3); // Directly to proof ledger
      setMaxReachedStep((prev) => Math.max(prev, 3));
      confetti({ particleCount: 60, spread: 50, origin: { y: 0.6 } });
      addToast('success', 'Verification Complete', `Evaluated ${result.schemes_evaluated.length} schemes.`);
    } catch (err: any) {
      setCheckerError(err.message || 'Analysis failed. Please check inputs.');
      addToast('error', 'Analysis Failed', err.message);
    } finally {
      setCheckerLoading(false);
    }
  };

  const handleManualAnalyze = async () => {
    if (!narrative.trim() && files.length === 0) {
      addToast('warning', 'Input Required', 'Please enter your academic background or attach documents.');
      return;
    }

    setCheckerLoading(true);
    setCheckerError(null);

    try {
      const result = await analyzeHousehold(narrative, files, conflictResolutions);
      setAnalysisResult(result);

      if (result.household_facts.conflicts && result.household_facts.conflicts.length > 0) {
        setCurrentStep(2); // Facts review
        setMaxReachedStep((prev) => Math.max(prev, 2));
      } else {
        setCurrentStep(3); // Proof ledger
        setMaxReachedStep((prev) => Math.max(prev, 3));
        confetti({ particleCount: 60, spread: 50, origin: { y: 0.6 } });
      }
    } catch (err: any) {
      setCheckerError(err.message || 'Analysis failed. Please try again.');
      addToast('error', 'Verification Failed', err.message);
    } finally {
      setCheckerLoading(false);
    }
  };

  const handleResolveConflict = (field: string, chosenValue: any) => {
    setConflictResolutions((prev) => ({
      ...prev,
      [field]: chosenValue,
    }));
  };

  const completionPercent = calculateProfileCompletion(studentProfile);
  const eligibleCount = recommendations.filter(
    (r) => r.verdict === 'ELIGIBLE' || (r.blocking_reasons.length === 0 && r.match_score >= 85)
  ).length;

  return (
    <div className="min-h-screen bg-[#f4f8f5] text-[#0f172a] flex flex-col selection:bg-[#047857] selection:text-white font-sans">
      {/* Toast Notification Container */}
      <ToastNotification toasts={toasts} onDismiss={dismissToast} />

      {/* Global Institutional Header */}
      <Header
        serverStatus={serverStatus}
        activeView={activeView}
        onSelectView={(view) => navigateToView(view)}
        unreadNotifsCount={unreadNotifsCount}
        onOpenNotifications={() => setNotifModalOpen(true)}
        onOpenReport={() => setInstitutionalReportOpen(true)}
        matchedCount={eligibleCount}
        profileCompletion={completionPercent}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* VIEW: ADD NEW STUDENT REGISTRATION (/students/new) */}
        {activeView === 'students_new' && (
          <AddNewStudentView
            initialProfile={editingStudent}
            onSaveStudent={handleSaveNewStudent}
            onCancel={() => {
              setEditingStudent(null);
              navigateToView('profile');
            }}
          />
        )}

        {/* VIEW: ALL STUDENT PROFILES (/students/all) */}
        {activeView === 'students_all' && (
          <AllStudentsView
            students={students.filter((s) => !s.is_demo)}
            onSelectStudent={handleSelectStudent}
            onEditStudent={handleEditStudent}
            onCheckEligibility={handleCheckEligibilityForStudent}
            onGenerateReport={handleGenerateReportForStudent}
            onDeleteStudent={handleDeleteStudent}
            onNavigateToAddNew={handleNavigateToAddNew}
            onBackToRecent={() => navigateToView('profile')}
          />
        )}

        {/* VIEW 1: SCHOLARSHIPS DIRECTORY */}
        {activeView === 'scholarships' && (
          <ScholarshipDashboard
            scholarships={scholarships}
            updates={updates}
            loading={scholarshipsLoading}
            onCheckEligibility={handleCheckEligibilityForScheme}
            onTrackScholarship={handleTrackScholarship}
            onOpenProfile={() => navigateToView('profile')}
            onOpenDetailsModal={(sch) => setSelectedScholarshipModal(sch)}
          />
        )}

        {/* VIEW 2: STUDENT PROFILES (5 Recently Used + 4 Demo Personas) */}
        {activeView === 'profile' && (
          <StudentProfilesView
            currentProfile={studentProfile}
            recentStudents={students}
            onSelectStudent={handleSelectStudent}
            onEditStudent={handleEditStudent}
            onCheckEligibility={handleCheckEligibilityForStudent}
            onGenerateReport={handleGenerateReportForStudent}
            onNavigateToAddNew={handleNavigateToAddNew}
            onNavigateToAllStudents={() => navigateToView('students_all')}
            totalStudentsCount={students.filter((s) => !s.is_demo).length}
            loading={recommendationsLoading}
          />
        )}

        {/* VIEW 3: MATCHED SCHEMES (4 Distinct Tiers) */}
        {activeView === 'matched' && (
          <PersonalizedResults
            recommendations={recommendations}
            allScholarships={scholarships}
            loading={recommendationsLoading}
            onSelectScholarship={handleOpenScholarshipDetailsById}
            onTrackScholarship={handleTrackScholarship}
            onOpenProfile={() => setActiveView('profile')}
          />
        )}

        {/* VIEW 4: APPLICATION TRACKER (6-Stage Pipeline) */}
        {activeView === 'tracker' && (
          <ApplicationTracker
            applications={trackedApplications}
            onUpdateStatus={handleUpdateAppStatus}
            onUpdateNotes={handleUpdateAppNotes}
            onDeleteApplication={handleDeleteApplication}
            onCheckEligibilityForScheme={handleCheckEligibilityForScheme}
          />
        )}

        {/* VIEW 5: DOCUMENT READINESS CHECKLIST */}
        {activeView === 'checklist' && (
          <DocumentChecklist
            onCheckEligibilityFromDocs={() => {
              setActiveView('checker');
              setCurrentStep(1);
            }}
          />
        )}

        {/* VIEW 6: ELIGIBILITY PROOF LEDGER CHECKER (Advanced multimodal & rule engine) */}
        {activeView === 'checker' && (
          <div className="space-y-6">
            {/* Presets Bar */}
            <PresetsBar
              onSelectPreset={handleSelectPreset}
              onTryDemoCase={handleTryDemoCase}
              activePresetId={activePresetId}
              loading={checkerLoading}
            />

            {/* Stepper Navigation */}
            <Stepper
              currentStep={currentStep}
              onStepClick={(step) => setCurrentStep(step)}
              maxReachedStep={maxReachedStep}
            />

            {checkerError && (
              <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
                {checkerError}
              </div>
            )}

            {/* Step 1: Input (Story + Documents) */}
            {currentStep === 1 && (
              <div className="max-w-5xl mx-auto space-y-6">
                <NarrativeInput
                  value={narrative}
                  onChange={setNarrative}
                  disabled={checkerLoading}
                />

                <DocumentUpload
                  files={files}
                  onFilesChange={setFiles}
                  disabled={checkerLoading}
                />

                {/* Action Bar */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-2xl card-panel bg-white border border-slate-200 shadow-xs">
                  <div>
                    <p className="text-xs font-bold text-slate-900">
                      Ready to verify statutory scholarship eligibility?
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Gemini extracts facts from your marksheets and story. Pure Python rules verify statutory clauses.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleManualAnalyze}
                    disabled={checkerLoading}
                    className="w-full sm:w-auto flex items-center justify-center space-x-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-xs transition-all cursor-pointer disabled:opacity-50"
                  >
                    {checkerLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Verifying Documents...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        <span>Verify Eligibility & Proof Ledger</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Facts & Conflict Review */}
            {currentStep === 2 && analysisResult && (
              <FactsReview
                facts={analysisResult.household_facts}
                onResolveConflict={handleResolveConflict}
                onProceedToLedger={() => {
                  setCurrentStep(3);
                  setMaxReachedStep((prev) => Math.max(prev, 3));
                }}
              />
            )}

            {/* Step 3: Proof Ledger */}
            {currentStep === 3 && analysisResult && (
              <ProofLedger
                evaluations={analysisResult.schemes_evaluated}
                isDemoData={isDemoData}
                onSelectSchemeForAction={(scheme) => {
                  setSelectedScheme(scheme);
                  setCurrentStep(4);
                  setMaxReachedStep((prev) => Math.max(prev, 4));
                }}
              />
            )}

            {/* Step 4: Claim / Action Panel */}
            {currentStep === 4 && analysisResult && selectedScheme && (
              <ActionPanel
                scheme={selectedScheme}
                facts={analysisResult.household_facts}
                onBackToLedger={() => setCurrentStep(3)}
                onPreviewPdf={(url, title) => setPdfModal({ isOpen: true, url, title })}
              />
            )}
          </div>
        )}
      </main>

      {/* MODAL 1: Comprehensive Scholarship Details Modal */}
      {selectedScholarshipModal && (
        <ScholarshipDetailsModal
          scholarship={selectedScholarshipModal}
          recommendation={recommendations.find((r) => r.scheme_id === selectedScholarshipModal.id)}
          studentProfile={studentProfile}
          isOpen={true}
          onClose={() => setSelectedScholarshipModal(null)}
          onTrack={handleTrackScholarship}
          isTracked={trackedApplications.some((a) => a.scheme_id === selectedScholarshipModal.id)}
        />
      )}

      {/* MODAL 2: Institutional Report & Print Modal */}
      <InstitutionalReportModal
        isOpen={institutionalReportOpen}
        onClose={() => setInstitutionalReportOpen(false)}
        student={studentProfile}
        eligibleScholarships={recommendations.filter(
          (r) => r.verdict === 'ELIGIBLE' || (r.blocking_reasons.length === 0 && r.match_score >= 85)
        )}
        trackedApplications={trackedApplications}
        documentChecklist={documentChecklist}
        onAddToast={addToast}
      />

      {/* MODAL 3: Floating Notification Center Drawer */}
      <NotificationCenter
        isOpen={notifModalOpen}
        onClose={() => setNotifModalOpen(false)}
        notifications={notifications}
        onMarkAsRead={handleMarkAsRead}
        onMarkAllAsRead={handleMarkAllAsRead}
        onSelectScholarshipAction={(schemeId) => {
          handleOpenScholarshipDetailsById(schemeId);
        }}
      />

      {/* MODAL 4: In-App PDF Previewer */}
      <PdfModal
        isOpen={pdfModal.isOpen}
        onClose={() => setPdfModal({ isOpen: false, url: '', title: '' })}
        pdfUrl={pdfModal.url}
        title={pdfModal.title}
      />

      {/* Institutional Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© 2026 ScholarTack • Institutional Student Scholarship Intelligence Platform</p>
          <p className="text-[11px] text-slate-500">
            Source: National Scholarship Portal, AICTE, UGC, and State Portals
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;