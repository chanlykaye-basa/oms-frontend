import { Suspense } from 'react'
import Link from 'next/link'
import { api } from '@/shared/lib/api'
import type { OrdersResponse, OrderStatus } from '@/shared/types/api'
import { ORDER_STATUS_LABELS } from '@/shared/types/api'

const VALID_STATUSES = new Set<string>([
  'COLLECTED', 'PENDING_REVIEW', 'CONFIRMED', 'PREPARING_SHIPMENT',
  'SHIPPING', 'DELIVERED', 'DELIVERY_ISSUE', 'PURCHASE_CONFIRMED',
  'RETURNING', 'RETURNED', 'CANCELLED',
])

async function OrderList({
  status,
  channelId,
  orderedFrom,
  orderedTo,
  search,
  cursor,
}: {
  status?: string
  channelId?: string
  orderedFrom?: string
  orderedTo?: string
  search?: string
  cursor?: string
}) {
  const params = new URLSearchParams({ limit: '20' })
  if (status) params.set('status', status)
  if (channelId) params.set('channel_id', channelId)
  if (orderedFrom) params.set('ordered_from', orderedFrom)
  if (orderedTo) params.set('ordered_to', orderedTo)
  if (search) params.set('search', search)
  if (cursor) params.set('cursor', cursor)

  let data: OrdersResponse
  try {
    data = await api.get<OrdersResponse>(`/api/v1/orders?${params}`, { cache: 'no-store' })
  } catch {
    return <p style={{ color: 'red' }}>주문 목록을 불러오지 못했습니다.</p>
  }

  if (data.content.length === 0) {
    return <p style={{ color: '#999' }}>주문이 없습니다.</p>
  }

  return (
    <>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid #eee', textAlign: 'left' }}>
            <th style={{ padding: '8px' }}>주문번호</th>
            <th style={{ padding: '8px' }}>판매처</th>
            <th style={{ padding: '8px' }}>주문자</th>
            <th style={{ padding: '8px' }}>상태</th>
            <th style={{ padding: '8px' }}>주문일시</th>
            <th style={{ padding: '8px' }}>총액</th>
          </tr>
        </thead>
        <tbody>
          {data.content.map(order => (
            <tr
              key={order.id}
              style={{ borderBottom: '1px solid #eee', cursor: 'pointer' }}
            >
              <td style={{ padding: '8px' }}>
                <Link href={`/orders/${order.id}`} style={{ textDecoration: 'none', color: '#0066cc' }}>
                  {order.orderNumber}
                </Link>
              </td>
              <td style={{ padding: '8px' }}>{order.channelName ?? order.channelId}</td>
              <td style={{ padding: '8px' }}>{order.ordererName}</td>
              <td style={{ padding: '8px' }}>
                <span style={{
                  padding: '2px 8px',
                  borderRadius: '12px',
                  fontSize: '12px',
                  backgroundColor: getStatusColor(order.status),
                  color: 'white',
                }}>
                  {ORDER_STATUS_LABELS[order.status] ?? order.status}
                </span>
              </td>
              <td style={{ padding: '8px' }}>{new Date(order.orderedAt).toLocaleString('ko-KR')}</td>
              <td style={{ padding: '8px' }}>{order.totalAmount.toLocaleString()}원</td>
            </tr>
          ))}
        </tbody>
      </table>
      {data.hasMore && data.nextCursor && (() => {
        const nextParams = new URLSearchParams()
        nextParams.set('limit', '20')
        if (status) nextParams.set('status', status)
        if (channelId) nextParams.set('channel_id', channelId)
        if (orderedFrom) nextParams.set('ordered_from', orderedFrom)
        if (orderedTo) nextParams.set('ordered_to', orderedTo)
        if (search) nextParams.set('search', search)
        nextParams.set('cursor', data.nextCursor)
        return (
          <div style={{ marginTop: '16px', textAlign: 'center' }}>
            <Link href={`?${nextParams.toString()}`} style={{ padding: '8px 16px', background: '#0d6efd', color: '#fff', borderRadius: '4px', textDecoration: 'none' }}>
              다음 페이지
            </Link>
          </div>
        )
      })()}
    </>
  )
}

function getStatusColor(status: OrderStatus): string {
  const colors: Partial<Record<OrderStatus, string>> = {
    COLLECTED: '#6c757d',
    PENDING_REVIEW: '#fd7e14',
    CONFIRMED: '#0d6efd',
    PREPARING_SHIPMENT: '#6610f2',
    SHIPPING: '#0dcaf0',
    DELIVERED: '#198754',
    DELIVERY_ISSUE: '#dc3545',
    PURCHASE_CONFIRMED: '#20c997',
    RETURNING: '#ffc107',
    RETURNED: '#adb5bd',
    CANCELLED: '#343a40',
  }
  return colors[status] ?? '#6c757d'
}

export default function OrdersPage({
  searchParams,
}: {
  searchParams: Record<string, string | undefined>
}) {
  const rawStatus = searchParams['status']
  const status = rawStatus && VALID_STATUSES.has(rawStatus) ? rawStatus : undefined
  const channelId = searchParams['channel_id']
  const orderedFrom = searchParams['ordered_from']
  const orderedTo = searchParams['ordered_to']
  const search = searchParams['search']
  const cursor = searchParams['cursor']

  const statusList = ['', ...Array.from(VALID_STATUSES)] as const

  return (
    <div>
      <h1 style={{ marginBottom: '16px' }}>주문 관리</h1>

      <div style={{ marginBottom: '16px', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
        {statusList.map(s => (
          <Link key={s} href={s ? `?status=${s}` : '/orders'}>
            <button style={{ fontWeight: status === s || (!status && s === '') ? 'bold' : 'normal' }}>
              {s ? (ORDER_STATUS_LABELS[s as OrderStatus] ?? s) : '전체'}
            </button>
          </Link>
        ))}
      </div>

      <form method="get" style={{ marginBottom: '16px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        {status && <input type="hidden" name="status" value={status} />}
        <input
          name="search"
          defaultValue={search}
          placeholder="주문번호, 주문자 검색"
          style={{ padding: '4px 8px', border: '1px solid #ccc', borderRadius: '4px' }}
        />
        <input
          name="ordered_from"
          type="date"
          defaultValue={orderedFrom}
          style={{ padding: '4px 8px', border: '1px solid #ccc', borderRadius: '4px' }}
        />
        <input
          name="ordered_to"
          type="date"
          defaultValue={orderedTo}
          style={{ padding: '4px 8px', border: '1px solid #ccc', borderRadius: '4px' }}
        />
        <button type="submit">검색</button>
      </form>

      <Suspense fallback={<p>로딩 중...</p>}>
        <OrderList
          status={status}
          channelId={channelId}
          orderedFrom={orderedFrom}
          orderedTo={orderedTo}
          search={search}
          cursor={cursor}
        />
      </Suspense>
    </div>
  )
}
