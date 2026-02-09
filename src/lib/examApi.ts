const API_BASE = (import.meta as any).env?.VITE_AI_EVALUATION_API || 'http://localhost:8002';

export interface ExamOut {
  id: string;
  name: string;
  type: string;
  enabled: boolean;
  availableFrom?: string | null;
  availableUntil?: string | null;
  customQuestions?: Array<{ id: string; text: string; type?: string }>;
}

export async function getExams(): Promise<ExamOut[]> {
  const res = await fetch(`${API_BASE}/evaluate/exams`);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function updateExam(examId: string, patch: any): Promise<ExamOut> {
  const res = await fetch(`${API_BASE}/evaluate/exams/${examId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(patch),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function addQuestion(examId: string, payload: { text: string; type: string }) {
  const res = await fetch(`${API_BASE}/evaluate/exams/${examId}/questions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function updateQuestion(examId: string, questionId: string, payload: { text?: string; type?: string }) {
  const res = await fetch(`${API_BASE}/evaluate/exams/${examId}/questions/${questionId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function deleteQuestion(examId: string, questionId: string) {
  const res = await fetch(`${API_BASE}/evaluate/exams/${examId}/questions/${questionId}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error(await res.text());
  return true;
}
