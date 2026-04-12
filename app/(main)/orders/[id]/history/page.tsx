import Link from 'next/link'
import { notFound } from 'next/navigation'
import { api, ApiError } from '@/shared/lib/api'
import type { OrderHistory } from '@/shared/types/api'
import { ORDER_STATUS_LABELS } from '@/shared/types/api'
import { PageHeader, Card, Badge, Button, EmptyState } from '@internal/design-system'
import type { OrderStatus } from '@/shared/types/api'

async function getOrderHistory(orderId: string): Promise<OrderHistory[]> {
  try {
    return await api.get<OrderHistory[]>(`/api/v1/orders/${orderId}/history`, { cache: 'no-store' })
  } catch (err) {
    if (err instanceof ApiError && err.isNotFound) notFound()
    throw err
  }
}

const STATUS_BADGE_VARIANT: Record<OrderStatus, 'blue' | 'green' | 'yellow' | 'red' | 'gray' | 'purple' | 'orange' | 'cyan' | 'navy'> = {
  COLLECTED: 'gray',
  PENDING_REVIEW: 'yellow',
  CONFIRMED: 'blue',
  PREPARING_SHIPMENT: 'purple',
  SHIPPING: 'cyan',
  DELIVERED: 'green',
  DELIVERY_ISSUE: 'red',
  PURCHASE_CONFIRMED: 'navy',
  RETURNING: 'orange',
  RETURNED: 'gray',
  CANCELLED: 'gray',
}

export default async function OrderHistoryPage({ params }: { params: { id: string } }) {
  let history: OrderHistory[]

  try {
    history = await getOrderHistory(params.id)
  } catch {
    return (
      <div>
        <PageHeader title="상태 이력" />
        <p style={{ color: '#F04452', fontSize: '14px' }}>이력을 불러오지 못했습니다.</p>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: '720px' }}>
      <PageHeader
        title="상태 이력"
        description="주문 상태 변경 이력을 확인합니다"
        actions={
          <Link href={`/orders/${params.id}`}>
            <Button variant="secondary" size="sm">주문 상세로</Button>
          </Link>
        }
      />

      {history.length === 0 ? (
        <EmptyState title="이력 없음" description="상태 변경 이력이 없습니다." />
      ) : (
        <Card>
          <div style={{ position: 'relative' }}>
            {history.map((entry, index) => (
              <div
                key={entry.id}
                style={{
                  display: 'flex',
                  gap: '16px',
                  paddingBottom: index < history.length - 1 ? '24px' : 0,
                  position: 'relative',
                }}
              >
                {/* Timeline line */}
                {index < history.length - 1 && (
                  <div
                    style={{
                      position: 'absolute',
                      left: '11px',
                      top: '24px',
                      bottom: 0,
                      width: '2px',
                      background: '#E5E8EB',
                    }}
                  />
                )}

                {/* Dot */}
                <div
                  style={{
                    flexShrink: 0,
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    background: '#3182F6',
                    border: '3px solid #EFF6FF',
                    marginTop: '2px',
                    zIndex: 1,
                  }}
                />

                {/* Content */}
                <div style={{ flex: 1, paddingBottom: '4px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', flexWrap: 'wrap' }}>
                    {entry.fromStatus && (
                      <>
                        <Badge variant={STATUS_BADGE_VARIANT[entry.fromStatus]}>
                          {ORDER_STATUS_LABELS[entry.fromStatus] ?? entry.fromStatus}
                        </Badge>
                        <span style={{ color: '#8B95A1', fontSize: '13px' }}>→</span>
                      </>
                    )}
                    <Badge variant={STATUS_BADGE_VARIANT[entry.toStatus]}>
                      {ORDER_STATUS_LABELS[entry.toStatus] ?? entry.toStatus}
                    </Badge>
                  </div>

                  {entry.reason && (
                    <p style={{ fontSize: '13px', color: '#4E5968', marginBottom: '4px' }}>
                      사유: {entry.reason}
                    </p>
                  )}

                  <time style={{ fontSize: '12px', color: '#8B95A1' }}>
                    {new Date(entry.createdAt).toLocaleString('ko-KR')}
                  </time>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  )
}
