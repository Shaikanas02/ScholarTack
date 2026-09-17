import type { AnalysisResponse, HouseholdFacts } from '../types';

const API_BASE = '';

export async function checkHealth(): Promise<{ status: string; version: string; packs_loaded: number }> {
  const res = await fetch(`${API_BASE}/healthz`);
  if (!res.ok) throw new Error('Health check failed');
  return res.json();
}

export async function analyzeHousehold(
  narrative: string,
  files: File[],
  conflictResolutions: Record<string, any> = {}
): Promise<AnalysisResponse> {
  const formData = new FormData();
  formData.append('narrative', narrative);
  formData.append('conflict_resolutions', JSON.stringify(conflictResolutions));

  files.forEach((file) => {
    formData.append('files', file);
  });

  const res = await fetch(`${API_BASE}/api/analyze`, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.detail || 'Analysis failed. Please check your inputs.');
  }

  return res.json();
}

export async function downloadApplicationPdf(schemeId: string, facts: HouseholdFacts): Promise<Blob> {
  const res = await fetch(`${API_BASE}/api/application/${schemeId}/pdf`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(facts),
  });

  if (!res.ok) {
    throw new Error('Failed to generate application PDF.');
  }

  return res.blob();
}

export async function downloadLedgerPdf(schemeId: string, facts: HouseholdFacts): Promise<Blob> {
  const res = await fetch(`${API_BASE}/api/application/${schemeId}/ledger-pdf`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(facts),
  });

  if (!res.ok) {
    throw new Error('Failed to generate proof ledger PDF.');
  }

  return res.blob();
}

export async function getScholarships(params?: {
  category?: string;
  level?: string;
  q?: string;
}): Promise<import('../types').ScholarshipItem[]> {
  const query = new URLSearchParams();
  if (params?.category && params.category !== 'ALL') query.set('category', params.category);
  if (params?.level && params.level !== 'ALL') query.set('level', params.level);
  if (params?.q) query.set('q', params.q);

  const qs = query.toString() ? `?${query.toString()}` : '';
  const res = await fetch(`${API_BASE}/api/scholarships${qs}`);
  if (!res.ok) throw new Error('Failed to fetch scholarships list');
  return res.json();
}

export async function getScholarshipUpdates(): Promise<import('../types').ScholarshipUpdate[]> {
  const res = await fetch(`${API_BASE}/api/scholarships/updates`);
  if (!res.ok) throw new Error('Failed to fetch scholarship updates');
  return res.json();
}

export async function getNotifications(): Promise<import('../types').NotificationItem[]> {
  const res = await fetch(`${API_BASE}/api/scholarships/notifications`);
  if (!res.ok) throw new Error('Failed to fetch notifications');
  return res.json();
}

export async function getRecommendations(
  profile: Partial<import('../types').StudentProfile>
): Promise<import('../types').ScholarshipRecommendation[]> {
  const res = await fetch(`${API_BASE}/api/scholarships/recommend`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(profile),
  });
  if (!res.ok) throw new Error('Failed to compute scholarship recommendations');
  return res.json();
}

export async function downloadStudentReportPdf(
  payload: import('../types').StudentReportPayload
): Promise<Blob> {
  const res = await fetch(`${API_BASE}/api/student/report-pdf`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error('Failed to generate institutional report PDF.');
  }

  return res.blob();
}

