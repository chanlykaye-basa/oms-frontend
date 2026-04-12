import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { api, ApiError } from '@/shared/lib/api'
import type { Order } from '@/shared/types/api'
import { CreateShipmentForm } from './_components/CreateShipmentForm'
import { PageHeader, Card, Button } from '@internal/design-system'

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
      <PageHeader
        title="송장 등록"
        description="배송 정보를 입력하여 송장을 등록합니다"
        actions={
          <Link href={`/orders/${order.id}`}>
            <Button variant="secondary" size="sm">주문 상세로</Button>
          </Link>
        }
      />

      <Card
        header={
          <span style={{ fontSize: '15px', fontWeight: 600, color: '#191F28' }}>주문 정보</span>
        }
        style={{ marginBottom: '20px' }}
      >
        <div style={{ display: 'flex', gap: '32px', fontSize: '14px', flexWrap: 'wrap' }}>
          <div>
            <span style={{ color: '#8B95A1', marginRight: '6px' }}>주문번호</span>
            <strong style={{ color: '#191F28' }}>{order.orderNumber}</strong>
          </div>
          <div>
            <span style={{ color: '#8B95A1', marginRight: '6px' }}>주문자</span>
            <strong style={{ color: '#191F28' }}>{order.ordererName}</strong>
          </div>
          <div>
            <span style={{ color: '#8B95A1', marginRight: '6px' }}>수령인</span>
            <strong style={{ color: '#191F28' }}>{order.recipientName}</strong>
          </div>
        </div>
        <div style={{ marginTop: '10px', fontSize: '13px', color: '#8B95A1' }}>
          배송지: {order.recipientAddress.zipCode} {order.recipientAddress.address1}{' '}
          {order.recipientAddress.address2 ?? ''}
        </div>
      </Card>

      <CreateShipmentForm orderId={order.id} orderItems={order.items} />
    </div>
  )
}
