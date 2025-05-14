
export async function refreshAccessToken() {
  const res = await fetch('/api/refresh_token');
  if (!res.ok) throw new Error('Failed to refresh token');
  return await res.json();
}
