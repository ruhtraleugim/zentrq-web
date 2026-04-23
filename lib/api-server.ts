import { cookies } from 'next/headers'

const BASE = process.env.API_URL!

export async function apiFetchServer(
  path: string,
  options: RequestInit = {}
): Promise<Response> {
  const cookieStore = await cookies()
  const token = cookieStore.get('token')?.value

  return fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers as Record<string, string> | undefined),
    },
    cache: 'no-store',
  })
}

export async function apiGet<T>(path: string): Promise<T> {
  const res = await apiFetchServer(path)
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`GET ${path} → ${res.status}: ${text}`)
  }
  return res.json() as Promise<T>
}

export async function apiMutate(
  path: string,
  method: string,
  body?: unknown
): Promise<Response> {
  return apiFetchServer(path, {
    method,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })
}
