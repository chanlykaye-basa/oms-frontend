import 'server-only'
import { headers } from 'next/headers'

const API_BASE_URL = process.env['API_URL'] ?? 'http://localhost:8080'

async function getTenantId(): Promise<string> {
  const headersList = await headers()
  const tenantId = headersList.get('x-tenant-id')
  if (!tenantId) throw new Error('테넌트 ID가 없습니다.')
  return tenantId
}

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message)
    this.name = 'ApiError'
  }
  get isConflict() { return this.status === 409 }
  get isNotFound() { return this.status === 404 }
}

async function fetchApi<T>(path: string, options: RequestInit = {}): Promise<T> {
  const tenantId = await getTenantId()
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'X-Tenant-ID': tenantId,
      ...options.headers,
    },
  })
  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: response.statusText }))
    throw new ApiError(response.status, (error as { detail?: string }).detail ?? '오류가 발생했습니다.')
  }
  if (response.status === 204) return undefined as T
  return response.json() as Promise<T>
}

export const api = {
  get: <T>(path: string, init?: RequestInit) => fetchApi<T>(path, { ...init, method: 'GET' }),
  post: <T>(path: string, body: unknown, init?: RequestInit) =>
    fetchApi<T>(path, { ...init, method: 'POST', body: JSON.stringify(body) }),
  put: <T>(path: string, body: unknown, init?: RequestInit) =>
    fetchApi<T>(path, { ...init, method: 'PUT', body: JSON.stringify(body) }),
  patch: <T>(path: string, body: unknown, init?: RequestInit) =>
    fetchApi<T>(path, { ...init, method: 'PATCH', body: JSON.stringify(body) }),
  delete: <T>(path: string, init?: RequestInit) => fetchApi<T>(path, { ...init, method: 'DELETE' }),
}
