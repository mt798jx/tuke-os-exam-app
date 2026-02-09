type ExamDTO = {
  id: string;
  title: string;
  shortTitle?: string;
  description?: string;
  status?: string;
  requiresProject?: boolean;
  projectConfigured?: boolean;
  estimatedTime?: string;
  score?: string;
};

const API_BASE = import.meta.env.VITE_AI_EVALUATION_API ?? '';

export async function getExams(): Promise<ExamDTO[]> {
  const res = await fetch(`${API_BASE}/evaluate/exams`);
  if (!res.ok) throw new Error(`Failed to fetch exams: ${res.status}`);
  return await res.json();
}

export async function analyze(repoName: string, userId?: number) {
  const body: any = { repo_name: repoName };
  if (userId) body.user_id = userId;
  const res = await fetch(`${API_BASE}/evaluate/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Analyze failed: ${res.status} ${txt}`);
  }
  return await res.json();
}

export default { getExams, analyze };
