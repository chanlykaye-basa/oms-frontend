import Link from 'next/link'
import { notFound } from 'next/navigation'
import { api, ApiError } from '@/shared/lib/api'
import type { Order, Shipment } from '@/shared/types/api'
import { ORDER_STATUS_LABELS } from '@/shared/types/api'
import { OrderActions } from './_components/OrderActions'
import { Card, PageHeader, Badge, Button } from '@internal/design-system'
import type { OrderStatus } from '@/shared/types/api'

async function getOrder(id: string): Promise<Order> {
  try {
    return await api.get<Order>(`/api/v1/orders/${id}`, { cache: 'no-store' })
  } catch (err) {
    if (err instanceof ApiError && err.isNotFound) notFound()
    throw err
  }
}

async function getShipments(orderId: string): Promise<Shipment[]> {
  try {
    return await api.get<Shipment[]>(`/api/v1/orders/${orderId}/shipments`, { cache: 'no-store' })
  } catch {
    return []
  }
}

const CARRIER_LABELS: Record<string, string> = {
  CJ: 'CJ대한통운',
  LOTTE: '롯데택배',
  HANJIN: '한진택배',
  POST: '우체국택배',
  LOGEN: '로젠택배',
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

function InfoRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div
      style={{
        display: 'flex',
        padding: '10px 0',
        borderBottom: '1px solid #F2F4F6',
        fontSize: '14px',
      }}
    >
      <dt style={{ width: '140px', flexShrink: 0, color: '#8B95A1', fontWeight: 400 }}>{label}</dt>
      <dd style={{ flex: 1, color: '#191F28' }}>{children}</dd>
    </div>
  )
}

export default async function OrderDetailPage({ params }: { params: { id: string } }) {
  const [order, shipments] = await Promise.all([
    getOrder(params.id),
    getShipments(params.id),
  ])

  return (
    <div style={{ maxWidth: '860px' }}>
      <PageHeader
        title={`주문 ${order.orderNumber}`}
        description="주문 상세 정보를 확인하고 처리합니다"
        actions={
          <div style={{ display: 'flex', gap: '8px' }}>
            <Link href={`/orders/${order.id}/history`}>
              <Button variant="outline" size="sm">상태 이력</Button>
            </Link>
            <Link href="/orders">
              <Button variant="secondary" size="sm">목록으로</Button>
            </Link>
          </div>
        }
      />

      {/* 기본 정보 */}
      <Card
        header={
          <span style={{ fontSize: '15px', fontWeight: 600, color: '#191F28' }}>기본 정보</span>
        }
        style={{ marginBottom: '16px' }}
      >
        <dl style={{ margin: 0 }}>
          <InfoRow label="주문번호">{order.orderNumber}</InfoRow>
          <InfoRow label="판매처">{order.channelName ?? order.channelId}</InfoRow>
          <InfoRow label="주문 상태">
            <Badge variant={STATUS_BADGE_VARIANT[order.status]}>
              {ORDER_STATUS_LABELS[order.status] ?? order.status}
            </Badge>
          </InfoRow>
          <InfoRow label="주문일시">{new Date(order.orderedAt).toLocaleString('ko-KR')}</InfoRow>
          <InfoRow label="총 금액">
            <strong>{order.totalAmount.toLocaleString()}원</strong>
          </InfoRow>
        </dl>
      </Card>

      {/* 주문자 / 수령인 */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
        <Card
          header={
            <span style={{ fontSize: '15px', fontWeight: 600, color: '#191F28' }}>주문자 정보</span>
          }
        >
          <dl style={{ margin: 0 }}>
            <InfoRow label="이름">{order.ordererName}</InfoRow>
            <InfoRow label="전화번호">{order.ordererPhone}</InfoRow>
          </dl>
        </Card>

        <Card
          header={
            <span style={{ fontSize: '15px', fontWeight: 600, color: '#191F28' }}>수령인 정보</span>
          }
        >
          <dl style={{ margin: 0 }}>
            <InfoRow label="이름">{order.recipientName}</InfoRow>
            <InfoRow label="전화번호">{order.recipientPhone}</InfoRow>
            <InfoRow label="우편번호">{order.recipientAddress.zipCode}</InfoRow>
            <InfoRow label="주소">{order.recipientAddress.address1}</InfoRow>
            {order.recipientAddress.address2 && (
              <InfoRow label="상세주소">{order.recipientAddress.address2}</InfoRow>
            )}
          </dl>
        </Card>
      </div>

      {/* 주문 항목 */}
      <Card
        header={
          <span style={{ fontSize: '15px', fontWeight: 600, color: '#191F28' }}>주문 항목</span>
        }
        style={{ marginBottom: '16px' }}
      >
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #E5E8EB' }}>
              <th style={{ padding: '8px 0', textAlign: 'left', fontWeight: 600, color: '#4E5968' }}>상품명</th>
              <th style={{ padding: '8px 0', textAlign: 'right', fontWeight: 600, color: '#4E5968' }}>단가</th>
              <th style={{ padding: '8px 0', textAlign: 'right', fontWeight: 600, color: '#4E5968' }}>수량</th>
              <th style={{ padding: '8px 0', textAlign: 'right', fontWeight: 600, color: '#4E5968' }}>소계</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map(item => (
              <tr key={item.id} style={{ borderBottom: '1px solid #F2F4F6' }}>
                <td style={{ padding: '10px 0', color: '#191F28' }}>{item.productName}</td>
                <td style={{ padding: '10px 0', textAlign: 'right', color: '#4E5968' }}>
                  {item.unitPrice.toLocaleString()}원
                </td>
                <td style={{ padding: '10px 0', textAlign: 'right', color: '#4E5968' }}>{item.quantity}</td>
                <td style={{ padding: '10px 0', textAlign: 'right', fontWeight: 500, color: '#191F28' }}>
                  {item.totalPrice.toLocaleString()}원
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      {/* 배송 정보 */}
      {shipments.length > 0 && (
        <Card
          header={
            <span style={{ fontSize: '15px', fontWeight: 600, color: '#191F28' }}>배송 정보</span>
          }
          style={{ marginBottom: '16px' }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {shipments.map(shipment => (
              <div
                key={shipment.id}
                style={{
                  padding: '14px 16px',
                  background: '#F9FAFB',
                  borderRadius: '8px',
                  border: '1px solid #F2F4F6',
                }}
              >
                <div style={{ display: 'flex', gap: '24px', marginBottom: '6px', fontSize: '14px' }}>
                  <span>
                    <span style={{ color: '#8B95A1' }}>배송사: </span>
                    <strong>{CARRIER_LABELS[shipment.carrierCode] ?? shipment.carrierCode}</strong>
                  </span>
                  <span>
                    <span style={{ color: '#8B95A1' }}>송장번호: </span>
                    <strong>{shipment.trackingNumber}</strong>
                  </span>
                </div>
                <div style={{ fontSize: '12px', color: '#8B95A1' }}>
                  등록일: {new Date(shipment.createdAt).toLocaleString('ko-KR')}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* 액션 버튼 */}
      <OrderActions orderId={order.id} status={order.status} />
    </div>
  )
}
