import { api } from '@/shared/lib/api'
import type { DashboardSummary } from '@/shared/types/api'
import { ORDER_STATUS_LABELS } from '@/shared/types/api'

async function getDashboardSummary(): Promise<DashboardSummary> {
  return api.get<DashboardSummary>('/api/v1/dashboard/summary', { cache: 'no-store' })
}

export default async function DashboardPage() {
  let summary: DashboardSummary

  try {
    summary = await getDashboardSummary()
  } catch {
    summary = { statusCounts: {}, totalOrders: 0 }
  }

  const statusEntries = Object.entries(ORDER_STATUS_LABELS) as [keyof typeof ORDER_STATUS_LABELS, string][]

  return (
    <div>
      <h1 style={{ marginBottom: '24px' }}>대시보드</h1>

      <section style={{ marginBottom: '32px' }}>
        <h2 style={{ marginBottom: '16px' }}>전체 주문 현황</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '16px' }}>
          {statusEntries.map(([status, label]) => {
            const count = summary.statusCounts[status] ?? 0
            return (
              <div
                key={status}
                style={{
                  padding: '16px',
                  border: '1px solid #eee',
                  borderRadius: '8px',
                  backgroundColor: '#fafafa',
                }}
              >
                <div style={{ fontSize: '12px', color: '#888', marginBottom: '8px' }}>{label}</div>
                <div style={{ fontSize: '28px', fontWeight: 'bold' }}>{count.toLocaleString()}</div>
              </div>
            )
          })}
        </div>
      </section>

      <section>
        <div
          style={{
            padding: '16px',
            border: '1px solid #eee',
            borderRadius: '8px',
            backgroundColor: '#f0f4ff',
            display: 'inline-block',
          }}
        >
          <div style={{ fontSize: '14px', color: '#555', marginBottom: '8px' }}>총 주문 수</div>
          <div style={{ fontSize: '36px', fontWeight: 'bold' }}>{summary.totalOrders.toLocaleString()}</div>
        </div>
      </section>
    </div>
  )
}
