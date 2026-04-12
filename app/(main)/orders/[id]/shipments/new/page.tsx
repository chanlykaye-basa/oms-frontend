import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { api, ApiError } from '@/shared/lib/api'
import type { Order } from '@/shared/types/api'
import { CreateShipmentForm } from './_components/CreateShipmentForm'

async function getOrder(id: string): Promise<Order> {
  try {
    return await api.get<Order>(`/api/v1/orders/${id}`, { cache: 'no-store' })
  } catch (err) {
    if (err instanceof ApiError && err.isNotFound) notFound()
    throw err
  }
}

export default async function NewShipmentPage({ params }: { params: { id: string } }) {
  const order = await getOrder(params.id)

  // Only PREPARING_SHIPMENT status allows shipment registration
  if (order.status !== 'PREPARING_SHIPMENT') {
    redirect(`/orders/${params.id}`)
  }

  return (
    <div style={{ maxWidth: '720px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1>송장 등록</h1>
        <Link href={`/orders/${order.id}`}>
          <button style={{ padding: '6px 12px' }}>주문 상세로</button>
        </Link>
      </div>

      <section style={{ marginBottom: '24px', padding: '16px', border: '1px solid #eee', borderRadius: '8px', backgroundColor: '#f8f9fa' }}>
        <h2 style={{ marginBottom: '8px', fontSize: '16px' }}>주문 정보</h2>
        <div style={{ display: 'flex', gap: '24px', fontSize: '14px' }}>
          <span><strong>주문번호:</strong> {order.orderNumber}</span>
          <span><strong>주문자:</strong> {order.ordererName}</span>
          <span><strong>수령인:</strong> {order.recipientName}</span>
        </div>
        <div style={{ marginTop: '8px', fontSize: '14px', color: '#666' }}>
          배송지: {order.recipientAddress.zipCode} {order.recipientAddress.address1} {order.recipientAddress.address2 ?? ''}
        </div>
      </section>

      <CreateShipmentForm orderId={order.id} orderItems={order.items} />
    </div>
  )
}
