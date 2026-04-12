import { Suspense } from 'react'
import Link from 'next/link'
import { api } from '@/shared/lib/api'
import type { OrdersResponse, OrderStatus } from '@/shared/types/api'
import { ORDER_STATUS_LABELS } from '@/shared/types/api'
import { PageHeader, Badge, FullPageSpinner, EmptyState } from '@internal/design-system'

const VALID_STATUSES = new Set<string>([
  'COLLECTED', 'PENDING_REVIEW', 'CONFIRMED', 'PREPARING_SHIPMENT',
  'SHIPPING', 'DELIVERED', 'DELIVERY_ISSUE', 'PURCHASE_CONFIRMED',
  'RETURNING', 'RETURNED', 'CANCELLED',
])

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
    return (
      <p style={{ color: '#F04452', padding: '16px', fontSize: '14px' }}>
        주문 목록을 불러오지 못했습니다.
      </p>
    )
  }

  if (data.content.length === 0) {
    return (
      <EmptyState
        title="주문 없음"
        description="조건에 맞는 주문이 없습니다."
      />
    )
  }

  return (
    <>
      <div style={{ overflowX: 'auto', borderRadius: '12px', border: '1px solid #E5E8EB', background: '#FFFFFF' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #E5E8EB', background: '#F9FAFB' }}>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: '#4E5968', whiteSpace: 'nowrap' }}>주문번호</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: '#4E5968', whiteSpace: 'nowrap' }}>판매처</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: '#4E5968', whiteSpace: 'nowrap' }}>주문자</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: '#4E5968', whiteSpace: 'nowrap' }}>상태</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: '#4E5968', whiteSpace: 'nowrap' }}>주문일시</th>
              <th style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 600, color: '#4E5968', whiteSpace: 'nowrap' }}>총액</th>
            </tr>
          </thead>
          <tbody>
            {data.content.map(order => (
              <tr
                key={order.id}
                style={{ borderBottom: '1px solid #F2F4F6', transition: 'background 0.1s' }}
                onMouseEnter={e => (e.currentTarget.style.background = '#F9FAFB')}
                onMouseLeave={e => (e.currentTarget.style.background = '')}
              >
                <td style={{ padding: '12px 16px' }}>
                  <Link
                    href={`/orders/${order.id}`}
                    style={{ textDecoration: 'none', color: '#3182F6', fontWeight: 500 }}
                  >
                    {order.orderNumber}
                  </Link>
                </td>
                <td style={{ padding: '12px 16px', color: '#4E5968' }}>
                  {order.channelName ?? order.channelId}
                </td>
                <td style={{ padding: '12px 16px', color: '#191F28' }}>{order.ordererName}</td>
                <td style={{ padding: '12px 16px' }}>
                  <Badge variant={STATUS_BADGE_VARIANT[order.status]}>
                    {ORDER_STATUS_LABELS[order.status] ?? order.status}
                  </Badge>
                </td>
                <td style={{ padding: '12px 16px', color: '#4E5968', whiteSpace: 'nowrap' }}>
                  {new Date(order.orderedAt).toLocaleString('ko-KR')}
                </td>
                <td style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 500, color: '#191F28' }}>
                  {order.totalAmount.toLocaleString()}원
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

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
            <Link
              href={`?${nextParams.toString()}`}
              style={{
                display: 'inline-block',
                padding: '8px 24px',
                background: '#3182F6',
                color: '#FFFFFF',
                borderRadius: '8px',
                textDecoration: 'none',
                fontSize: '14px',
                fontWeight: 500,
              }}
            >
              다음 페이지
            </Link>
          </div>
        )
      })()}
    </>
  )
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
      <PageHeader title="주문 관리" description="전체 주문 목록을 조회하고 관리합니다" />

      {/* Status filter tabs */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '6px',
          marginBottom: '16px',
          padding: '4px',
          background: '#F2F4F6',
          borderRadius: '10px',
          width: 'fit-content',
        }}
      >
        {statusList.map(s => {
          const isActive = status === s || (!status && s === '')
          return (
            <Link
              key={s}
              href={s ? `?status=${s}` : '/orders'}
              style={{
                display: 'inline-block',
                padding: '6px 14px',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: isActive ? 600 : 400,
                color: isActive ? '#191F28' : '#8B95A1',
                background: isActive ? '#FFFFFF' : 'transparent',
                textDecoration: 'none',
                transition: 'all 0.15s',
                boxShadow: isActive ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
                whiteSpace: 'nowrap',
              }}
            >
              {s ? (ORDER_STATUS_LABELS[s as OrderStatus] ?? s) : '전체'}
            </Link>
          )
        })}
      </div>

      {/* Search form */}
      <form
        method="get"
        style={{
          marginBottom: '20px',
          display: 'flex',
          gap: '8px',
          flexWrap: 'wrap',
          alignItems: 'center',
          padding: '16px',
          background: '#FFFFFF',
          border: '1px solid #E5E8EB',
          borderRadius: '12px',
        }}
      >
        {status && <input type="hidden" name="status" value={status} />}
        <input
          name="search"
          defaultValue={search}
          placeholder="주문번호, 주문자 검색"
          style={{
            padding: '8px 12px',
            border: '1px solid #E5E8EB',
            borderRadius: '8px',
            fontSize: '14px',
            color: '#191F28',
            outline: 'none',
            minWidth: '220px',
          }}
        />
        <input
          name="ordered_from"
          type="date"
          defaultValue={orderedFrom}
          style={{
            padding: '8px 12px',
            border: '1px solid #E5E8EB',
            borderRadius: '8px',
            fontSize: '14px',
            color: '#191F28',
            outline: 'none',
          }}
        />
        <input
          name="ordered_to"
          type="date"
          defaultValue={orderedTo}
          style={{
            padding: '8px 12px',
            border: '1px solid #E5E8EB',
            borderRadius: '8px',
            fontSize: '14px',
            color: '#191F28',
            outline: 'none',
          }}
        />
        <button
          type="submit"
          style={{
            padding: '8px 20px',
            background: '#3182F6',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: 500,
            cursor: 'pointer',
          }}
        >
          검색
        </button>
      </form>

      <Suspense fallback={<FullPageSpinner />}>
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
