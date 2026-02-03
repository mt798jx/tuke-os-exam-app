export type LoginResult = { token: string; username: string; role: 'student' | 'professor'; id?: number };

export async function login(username: string, password: string, desiredRole?: 'student' | 'professor') : Promise<LoginResult> {
  const body: any = { username, password };
  if (desiredRole) body.desired_role = desiredRole;

  const API_BASE = import.meta.env.VITE_PROFESSOR_BACKEND_API ?? '';

  const resp = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!resp.ok) {
    const err = await resp.json().catch(() => ({}));
    throw new Error(err.detail || 'Login failed');
  }

  const data = await resp.json();
  if (!data.token || !data.username || !data.role) {
    throw new Error('Invalid response from auth server');
  }

  // backend already returns normalized role
  const role = data.role as LoginResult['role'];
  try { localStorage.setItem('auth-token', data.token); } catch (e) {}
  // store returned numeric id for downstream APIs
  if (data.id !== undefined && data.id !== null) {
    try { localStorage.setItem('user-id', String(data.id)); } catch (e) {}
  }
  return { token: data.token, username: data.username, role, id: data.id };
}
