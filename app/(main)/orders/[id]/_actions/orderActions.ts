'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const API_BASE_URL = process.env['API_URL'] ?? 'http://localhost:8080'

async function getTenantId(): Promise<string> {
  const cookieStore = await cookies()
  return cookieStore.get('tenant_id')?.value ?? '1'
}

export async function confirmOrderAction(orderId: string): Promise<{ error: string } | void> {
  const tenantId = await getTenantId()

  const res = await fetch(`${API_BASE_URL}/api/v1/orders/${orderId}/confirm`, {
    method: 'PATCH',
    headers: { 'X-Tenant-ID': tenantId, 'Content-Type': 'application/json' },
  })

  if (!res.ok) {
    const data = await res.json().catch(() => ({}))
    return { error: (data as { detail?: string }).detail ?? '주문 확인 처리에 실패했습니다.' }
  }

  revalidatePath('/orders')
  redirect(`/orders/${orderId}`)
}

export async function rejectOrderAction(orderId: string): Promise<{ error: string } | void> {
  const tenantId = await getTenantId()

  const res = await fetch(`${API_BASE_URL}/api/v1/orders/${orderId}/reject`, {
    method: 'PATCH',
    headers: { 'X-Tenant-ID': tenantId, 'Content-Type': 'application/json' },
  })

  if (!res.ok) {
    const data = await res.json().catch(() => ({}))
    return { error: (data as { detail?: string }).detail ?? '주문 반려 처리에 실패했습니다.' }
  }

  revalidatePath('/orders')
  redirect(`/orders/${orderId}`)
}

export async function cancelOrderAction(
  orderId: string,
  reason: string,
): Promise<{ error: string } | void> {
  const tenantId = await getTenantId()

  const parsed = z.string().min(1, '취소 사유를 입력하세요.').safeParse(reason)
  if (!parsed.success) {
    return { error: parsed.error.errors[0]?.message ?? '취소 사유를 입력하세요.' }
  }

  const res = await fetch(`${API_BASE_URL}/api/v1/orders/${orderId}/cancel`, {
    method: 'PATCH',
    headers: { 'X-Tenant-ID': tenantId, 'Content-Type': 'application/json' },
    body: JSON.stringify({ reason }),
  })

  if (!res.ok) {
    const data = await res.json().catch(() => ({}))
    return { error: (data as { detail?: string }).detail ?? '주문 취소 처리에 실패했습니다.' }
  }

  revalidatePath('/orders')
  redirect(`/orders/${orderId}`)
}

export async function prepareShipmentAction(orderId: string): Promise<{ error: string } | void> {
  const tenantId = await getTenantId()

  const res = await fetch(`${API_BASE_URL}/api/v1/orders/${orderId}/prepare-shipment`, {
    method: 'PATCH',
    headers: { 'X-Tenant-ID': tenantId, 'Content-Type': 'application/json' },
  })

  if (!res.ok) {
    const data = await res.json().catch(() => ({}))
    return { error: (data as { detail?: string }).detail ?? '출고 지시 처리에 실패했습니다.' }
  }

  revalidatePath('/orders')
  redirect(`/orders/${orderId}`)
}
