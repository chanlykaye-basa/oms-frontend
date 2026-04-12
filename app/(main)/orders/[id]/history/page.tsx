import Link from 'next/link'
import { notFound } from 'next/navigation'
import { api, ApiError } from '@/shared/lib/api'
import type { OrderHistory } from '@/shared/types/api'
import { ORDER_STATUS_LABELS } from '@/shared/types/api'

async function getOrderHistory(orderId: string): Promise<OrderHistory[]> {
  try {
    return await api.get<OrderHistory[]>(`/api/v1/orders/${orderId}/history`, { cache: 'no-store' })
  } catch (err) {
    if (err instanceof ApiError && err.isNotFound) notFound()
    throw err
  }
}

export default async function OrderHistoryPage({ params }: { params: { id: string } }) {
  let history: OrderHistory[]

  try {
    history = await getOrderHistory(params.id)
  } catch {
    return (
      <div>
        <h1>상태 이력</h1>
        <p style={{ color: 'red' }}>이력을 불러오지 못했습니다.</p>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: '720px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1>상태 이력</h1>
        <Link href={`/orders/${params.id}`}>
          <button style={{ padding: '6px 12px' }}>주문 상세로</button>
        </Link>
      </div>

      {history.length === 0 ? (
        <p style={{ color: '#999' }}>이력이 없습니다.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #eee', textAlign: 'left' }}>
              <th style={{ padding: '8px' }}>이전 상태</th>
              <th style={{ padding: '8px' }}>변경 상태</th>
              <th style={{ padding: '8px' }}>사유</th>
              <th style={{ padding: '8px' }}>변경일시</th>
            </tr>
          </thead>
          <tbody>
            {history.map(entry => (
              <tr key={entry.id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '8px', color: '#666' }}>
                  {entry.fromStatus ? (ORDER_STATUS_LABELS[entry.fromStatus] ?? entry.fromStatus) : '-'}
                </td>
                <td style={{ padding: '8px' }}>
                  <span style={{
                    padding: '2px 8px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    backgroundColor: '#0d6efd',
                    color: 'white',
                  }}>
                    {ORDER_STATUS_LABELS[entry.toStatus] ?? entry.toStatus}
                  </span>
                </td>
                <td style={{ padding: '8px', fontSize: '13px', color: '#555' }}>{entry.reason ?? '-'}</td>
                <td style={{ padding: '8px', fontSize: '13px' }}>
                  {new Date(entry.createdAt).toLocaleString('ko-KR')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
