export const apiUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "";

export async function apiRequest<T>(path: string, token: string, method = "GET", body?: unknown): Promise<T> {
  if (!apiUrl) throw new Error("Configure NEXT_PUBLIC_API_URL no frontend.");
  const response = await fetch(`${apiUrl}/api/v1${path}`, {
    method,
    headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(typeof data.detail === "string" ? data.detail : "Falha na comunicação com a API.");
  return data as T;
}
