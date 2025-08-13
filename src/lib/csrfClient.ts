let csrfToken: string | null = null;

const API = `${process.env.NEXT_PUBLIC_API_ENDPOINT}`;

export async function fetchCsrf(): Promise<string> {
  const res = await fetch(`${API}/api/admin/auth/csrf`, { credentials: "include" });
  if (!res.ok) throw new Error("CSRF fetch failed");
  const data = await res.json();
  return data.csrfToken as string;
}

export async function ensureCsrf(): Promise<string> {
  if (!csrfToken) csrfToken = await fetchCsrf();
  return csrfToken;
}

export function invalidateCsrf() {
  csrfToken = null;
}
