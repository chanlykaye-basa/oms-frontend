import { api } from '@/shared/lib/api'
import type { DashboardSummary } from '@/shared/types/api'
import { ORDER_STATUS_LABELS } from '@/shared/types/api'
import { Card, PageHeader, Badge } from '@internal/design-system'
import type { OrderStatus } from '@/shared/types/api'

async function getDashboardSummary(): Promise<DashboardSummary> {
  return api.get<DashboardSummary>('/api/v1/dashboard/summary', { cache: 'no-store' })
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

export default async function DashboardPage() {
  let summary: DashboardSummary

  try {
    summary = await getDashboardSummary()
  } catch {
    summary = { statusCounts: {}, totalOrders: 0 }
  }

  const statusEntries = Object.entries(ORDER_STATUS_LABELS) as [OrderStatus, string][]

  return (
    <div>
      <PageHeader
        title="대시보드"
        description="전체 주문 현황을 확인합니다"
      />

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
          gap: '16px',
          marginBottom: '24px',
        }}
      >
        {statusEntries.map(([status, label]) => {
          const count = summary.statusCounts[status] ?? 0
          return (
            <Card key={status}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <Badge variant={STATUS_BADGE_VARIANT[status]}>{label}</Badge>
                <div style={{ fontSize: '32px', fontWeight: 700, color: '#191F28', lineHeight: 1 }}>
                  {count.toLocaleString()}
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      <Card style={{ background: '#EFF6FF', borderColor: '#BFDBFE' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: '14px', color: '#3B82F6', fontWeight: 600, marginBottom: '8px' }}>
              총 주문 수
            </div>
            <div style={{ fontSize: '40px', fontWeight: 700, color: '#1D4ED8' }}>
              {summary.totalOrders.toLocaleString()}
            </div>
          </div>
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '16px',
              background: '#3B82F6',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px',
            }}
          >
            📦
          </div>
        </div>
      </Card>
    </div>
  )
}
