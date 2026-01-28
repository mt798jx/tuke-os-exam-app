type Credentials = {
  user_id: number;
  gitlab_username?: string;
  gitlab_token?: string;
};

const API_BASE = import.meta.env.VITE_API_BASE ?? '';

export async function saveCredentials(userId: number, username: string, token: string) {
  const res = await fetch(`${API_BASE}/credentials`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user_id: userId, gitlab_username: username, gitlab_token: token }),
  });
  if (!res.ok) throw new Error(`Failed to save credentials: ${res.status}`);
  return await res.json();
}

export async function getCredentials(userId: number): Promise<Credentials | null> {
  const res = await fetch(`${API_BASE}/credentials/${userId}`);
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`Failed to fetch credentials: ${res.status}`);
  return await res.json();
}

export async function deleteCredentials(userId: number) {
  const res = await fetch(`${API_BASE}/credentials/${userId}`, { method: 'DELETE' });
  if (!res.ok) throw new Error(`Failed to delete credentials: ${res.status}`);
  return await res.json();
}

export async function cloneRepo(gitlabUrl: string, username?: string, token?: string, userId?: number) {
  const body: any = { gitlab_url: gitlabUrl };
  if (username) body.username = username;
  if (token) body.token = token;
  if (userId) body.user_id = userId;

  const res = await fetch(`${API_BASE}/clone`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Clone failed: ${res.status} ${txt}`);
  }
  return await res.json();
}

export default { saveCredentials, getCredentials, deleteCredentials, cloneRepo };
