const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "/_/backend/api";

export type ApiError = {
  detail?: string;
};

export function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("study-rpg-token");
}

export function setToken(token: string) {
  localStorage.setItem("study-rpg-token", token);
}

export function clearToken() {
  localStorage.removeItem("study-rpg-token");
}

export async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers = new Headers(options.headers);
  headers.set("Content-Type", "application/json");
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
    cache: "no-store"
  });

  if (!response.ok) {
    const body = (await response.json().catch(() => ({}))) as ApiError;
    throw new Error(body.detail ?? "Request failed");
  }

  return response.json() as Promise<T>;
}
