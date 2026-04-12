import Link from 'next/link'
import { notFound } from 'next/navigation'
import { api, ApiError } from '@/shared/lib/api'
import type { Order, Shipment } from '@/shared/types/api'
import { ORDER_STATUS_LABELS } from '@/shared/types/api'
import { OrderActions } from './_components/OrderActions'

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

export default async function OrderDetailPage({ params }: { params: { id: string } }) {
  const [order, shipments] = await Promise.all([
    getOrder(params.id),
    getShipments(params.id),
  ])

  return (
    <div style={{ maxWidth: '800px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1>주문 상세</h1>
        <div style={{ display: 'flex', gap: '8px' }}>
          <Link href={`/orders/${order.id}/history`}>
            <button style={{ padding: '6px 12px' }}>상태 이력</button>
          </Link>
          <Link href="/orders">
            <button style={{ padding: '6px 12px' }}>목록</button>
          </Link>
        </div>
      </div>

      {/* 기본 정보 */}
      <section style={{ marginBottom: '24px', padding: '16px', border: '1px solid #eee', borderRadius: '8px' }}>
        <h2 style={{ marginBottom: '12px', fontSize: '16px' }}>기본 정보</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <tbody>
            <tr style={{ borderBottom: '1px solid #eee' }}>
              <th style={{ padding: '8px', width: '140px', textAlign: 'left', color: '#666', fontWeight: 'normal' }}>주문번호</th>
              <td style={{ padding: '8px' }}>{order.orderNumber}</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #eee' }}>
              <th style={{ padding: '8px', textAlign: 'left', color: '#666', fontWeight: 'normal' }}>판매처</th>
              <td style={{ padding: '8px' }}>{order.channelName ?? order.channelId}</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #eee' }}>
              <th style={{ padding: '8px', textAlign: 'left', color: '#666', fontWeight: 'normal' }}>주문 상태</th>
              <td style={{ padding: '8px' }}>
                <span style={{
                  padding: '2px 8px',
                  borderRadius: '12px',
                  fontSize: '12px',
                  backgroundColor: '#0d6efd',
                  color: 'white',
                }}>
                  {ORDER_STATUS_LABELS[order.status] ?? order.status}
                </span>
              </td>
            </tr>
            <tr style={{ borderBottom: '1px solid #eee' }}>
              <th style={{ padding: '8px', textAlign: 'left', color: '#666', fontWeight: 'normal' }}>주문일시</th>
              <td style={{ padding: '8px' }}>{new Date(order.orderedAt).toLocaleString('ko-KR')}</td>
            </tr>
            <tr>
              <th style={{ padding: '8px', textAlign: 'left', color: '#666', fontWeight: 'normal' }}>총 금액</th>
              <td style={{ padding: '8px', fontWeight: 'bold' }}>{order.totalAmount.toLocaleString()}원</td>
            </tr>
          </tbody>
        </table>
      </section>

      {/* 주문자 / 수령인 */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
        <section style={{ padding: '16px', border: '1px solid #eee', borderRadius: '8px' }}>
          <h2 style={{ marginBottom: '12px', fontSize: '16px' }}>주문자 정보</h2>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <tbody>
              <tr style={{ borderBottom: '1px solid #eee' }}>
                <th style={{ padding: '6px', textAlign: 'left', color: '#666', fontWeight: 'normal', fontSize: '13px' }}>이름</th>
                <td style={{ padding: '6px', fontSize: '13px' }}>{order.ordererName}</td>
              </tr>
              <tr>
                <th style={{ padding: '6px', textAlign: 'left', color: '#666', fontWeight: 'normal', fontSize: '13px' }}>전화번호</th>
                <td style={{ padding: '6px', fontSize: '13px' }}>{order.ordererPhone}</td>
              </tr>
            </tbody>
          </table>
        </section>

        <section style={{ padding: '16px', border: '1px solid #eee', borderRadius: '8px' }}>
          <h2 style={{ marginBottom: '12px', fontSize: '16px' }}>수령인 정보</h2>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <tbody>
              <tr style={{ borderBottom: '1px solid #eee' }}>
                <th style={{ padding: '6px', textAlign: 'left', color: '#666', fontWeight: 'normal', fontSize: '13px' }}>이름</th>
                <td style={{ padding: '6px', fontSize: '13px' }}>{order.recipientName}</td>
              </tr>
              <tr style={{ borderBottom: '1px solid #eee' }}>
                <th style={{ padding: '6px', textAlign: 'left', color: '#666', fontWeight: 'normal', fontSize: '13px' }}>전화번호</th>
                <td style={{ padding: '6px', fontSize: '13px' }}>{order.recipientPhone}</td>
              </tr>
              <tr style={{ borderBottom: '1px solid #eee' }}>
                <th style={{ padding: '6px', textAlign: 'left', color: '#666', fontWeight: 'normal', fontSize: '13px' }}>우편번호</th>
                <td style={{ padding: '6px', fontSize: '13px' }}>{order.recipientAddress.zipCode}</td>
              </tr>
              <tr style={{ borderBottom: '1px solid #eee' }}>
                <th style={{ padding: '6px', textAlign: 'left', color: '#666', fontWeight: 'normal', fontSize: '13px' }}>주소</th>
                <td style={{ padding: '6px', fontSize: '13px' }}>{order.recipientAddress.address1}</td>
              </tr>
              {order.recipientAddress.address2 && (
                <tr>
                  <th style={{ padding: '6px', textAlign: 'left', color: '#666', fontWeight: 'normal', fontSize: '13px' }}>상세주소</th>
                  <td style={{ padding: '6px', fontSize: '13px' }}>{order.recipientAddress.address2}</td>
                </tr>
              )}
            </tbody>
          </table>
        </section>
      </div>

      {/* 주문 항목 */}
      <section style={{ marginBottom: '24px', padding: '16px', border: '1px solid #eee', borderRadius: '8px' }}>
        <h2 style={{ marginBottom: '12px', fontSize: '16px' }}>주문 항목</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #eee', textAlign: 'left' }}>
              <th style={{ padding: '8px' }}>상품명</th>
              <th style={{ padding: '8px' }}>단가</th>
              <th style={{ padding: '8px' }}>수량</th>
              <th style={{ padding: '8px' }}>소계</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map(item => (
              <tr key={item.id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '8px' }}>{item.productName}</td>
                <td style={{ padding: '8px' }}>{item.unitPrice.toLocaleString()}원</td>
                <td style={{ padding: '8px' }}>{item.quantity}</td>
                <td style={{ padding: '8px' }}>{item.totalPrice.toLocaleString()}원</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* 배송 정보 */}
      {shipments.length > 0 && (
        <section style={{ marginBottom: '24px', padding: '16px', border: '1px solid #eee', borderRadius: '8px' }}>
          <h2 style={{ marginBottom: '12px', fontSize: '16px' }}>배송 정보</h2>
          {shipments.map(shipment => (
            <div key={shipment.id} style={{ marginBottom: '12px', padding: '12px', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
              <div style={{ display: 'flex', gap: '16px', marginBottom: '8px' }}>
                <span><strong>배송사:</strong> {CARRIER_LABELS[shipment.carrierCode] ?? shipment.carrierCode}</span>
                <span><strong>송장번호:</strong> {shipment.trackingNumber}</span>
              </div>
              <div style={{ fontSize: '13px', color: '#666' }}>
                등록일: {new Date(shipment.createdAt).toLocaleString('ko-KR')}
              </div>
            </div>
          ))}
        </section>
      )}

      {/* 액션 버튼 */}
      <OrderActions orderId={order.id} status={order.status} />
    </div>
  )
}
