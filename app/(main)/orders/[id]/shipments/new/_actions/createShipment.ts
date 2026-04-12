'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const API_BASE_URL = process.env['API_URL'] ?? 'http://localhost:8080'

const ShipmentItemSchema = z.object({
  orderItemId: z.string().min(1),
  quantity: z.number().int().positive(),
})

const CreateShipmentSchema = z.object({
  carrierCode: z.string().min(1, '배송사를 선택하세요'),
  trackingNumber: z.string().min(1, '송장번호를 입력하세요'),
  items: z.array(ShipmentItemSchema).min(1, '최소 하나 이상의 상품을 선택하세요'),
})

export async function createShipmentAction(
  orderId: string,
  formData: FormData,
): Promise<{ error: string } | void> {
  const cookieStore = await cookies()
  const tenantId = cookieStore.get('tenant_id')?.value ?? '1'

  const carrierCode = formData.get('carrierCode') as string
  const trackingNumber = formData.get('trackingNumber') as string

  // Parse items from form data
  const itemsRaw = formData.get('items')
  let parsedItems: { orderItemId: string; quantity: number }[] = []

  try {
    parsedItems = JSON.parse(itemsRaw as string)
  } catch {
    return { error: '상품 선택 데이터가 잘못되었습니다.' }
  }

  const parsed = CreateShipmentSchema.safeParse({
    carrierCode,
    trackingNumber,
    items: parsedItems,
  })

  if (!parsed.success) {
    return { error: parsed.error.errors[0]?.message ?? '입력값을 확인하세요' }
  }

  const res = await fetch(`${API_BASE_URL}/api/v1/orders/${orderId}/shipments`, {
    method: 'POST',
    headers: {
      'X-Tenant-ID': tenantId,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      carrier_code: parsed.data.carrierCode,
      tracking_number: parsed.data.trackingNumber,
      items: parsed.data.items.map((item) => ({
        order_item_id: item.orderItemId,
        quantity: item.quantity,
      })),
    }),
  })

  if (!res.ok) {
    const data = await res.json().catch(() => ({}))
    return { error: (data as { detail?: string }).detail ?? '송장 등록에 실패했습니다.' }
  }

  revalidatePath('/orders')
  redirect(`/orders/${orderId}`)
}
