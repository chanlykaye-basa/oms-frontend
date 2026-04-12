'use client'

import { useState, useTransition } from 'react'
import type { OrderItem } from '@/shared/types/api'
import { createShipmentAction } from '../_actions/createShipment'
import { Button, Card, Input } from '@internal/design-system'

interface CreateShipmentFormProps {
  orderId: string
  orderItems: OrderItem[]
}

const CARRIER_OPTIONS = [
  { code: 'CJ', label: 'CJ대한통운' },
  { code: 'LOTTE', label: '롯데택배' },
  { code: 'HANJIN', label: '한진택배' },
  { code: 'POST', label: '우체국택배' },
  { code: 'LOGEN', label: '로젠택배' },
]

export function CreateShipmentForm({ orderId, orderItems }: CreateShipmentFormProps) {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [selectedItems, setSelectedItems] = useState<Record<string, number>>({})

  function handleItemToggle(itemId: string, maxQty: number, checked: boolean) {
    setSelectedItems(prev => {
      if (!checked) {
        const next = { ...prev }
        delete next[itemId]
        return next
      }
      return { ...prev, [itemId]: maxQty }
    })
  }

  function handleQtyChange(itemId: string, qty: number) {
    setSelectedItems(prev => ({ ...prev, [itemId]: qty }))
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)

    const form = e.currentTarget
    const formData = new FormData(form)

    const items = Object.entries(selectedItems)
      .filter(([, qty]) => qty > 0)
      .map(([orderItemId, quantity]) => ({ orderItemId, quantity }))

    formData.set('items', JSON.stringify(items))

    startTransition(async () => {
      const result = await createShipmentAction(orderId, formData)
      if (result?.error) setError(result.error)
    })
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {error && (
        <p
          role="alert"
          style={{
            color: '#F04452',
            fontSize: '14px',
            padding: '10px 14px',
            background: '#FEF2F2',
            borderRadius: '8px',
          }}
        >
          {error}
        </p>
      )}

      <Card
        header={
          <span style={{ fontSize: '15px', fontWeight: 600, color: '#191F28' }}>배송사 정보</span>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label
              htmlFor="carrierCode"
              style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: 500, color: '#4E5968' }}
            >
              배송사 <span style={{ color: '#F04452' }}>*</span>
            </label>
            <select
              id="carrierCode"
              name="carrierCode"
              required
              style={{
                padding: '10px 12px',
                border: '1px solid #E5E8EB',
                borderRadius: '8px',
                fontSize: '14px',
                color: '#191F28',
                background: '#FFFFFF',
                outline: 'none',
                width: '220px',
                cursor: 'pointer',
              }}
            >
              <option value="">배송사 선택</option>
              {CARRIER_OPTIONS.map(carrier => (
                <option key={carrier.code} value={carrier.code}>
                  {carrier.label}
                </option>
              ))}
            </select>
          </div>

          <Input
            label="송장번호"
            name="trackingNumber"
            type="text"
            required
            placeholder="송장번호를 입력하세요"
            style={{ maxWidth: '320px' }}
          />
        </div>
      </Card>

      <Card
        header={
          <span style={{ fontSize: '15px', fontWeight: 600, color: '#191F28' }}>
            배송 상품 선택 <span style={{ color: '#F04452' }}>*</span>
          </span>
        }
      >
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #E5E8EB' }}>
              <th style={{ padding: '8px 0', textAlign: 'left', fontWeight: 600, color: '#4E5968', width: '40px' }}>
                선택
              </th>
              <th style={{ padding: '8px 0', textAlign: 'left', fontWeight: 600, color: '#4E5968' }}>상품명</th>
              <th style={{ padding: '8px 0', textAlign: 'right', fontWeight: 600, color: '#4E5968', width: '80px' }}>
                주문수량
              </th>
              <th style={{ padding: '8px 0', textAlign: 'right', fontWeight: 600, color: '#4E5968', width: '100px' }}>
                배송수량
              </th>
            </tr>
          </thead>
          <tbody>
            {orderItems.map(item => {
              const isSelected = item.id in selectedItems
              return (
                <tr key={item.id} style={{ borderBottom: '1px solid #F2F4F6' }}>
                  <td style={{ padding: '12px 0' }}>
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={e => handleItemToggle(item.id, item.quantity, e.target.checked)}
                      style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                    />
                  </td>
                  <td style={{ padding: '12px 0', color: '#191F28' }}>{item.productName}</td>
                  <td style={{ padding: '12px 0', textAlign: 'right', color: '#4E5968' }}>
                    {item.quantity}
                  </td>
                  <td style={{ padding: '12px 0', textAlign: 'right' }}>
                    {isSelected ? (
                      <input
                        type="number"
                        min={1}
                        max={item.quantity}
                        value={selectedItems[item.id] ?? item.quantity}
                        onChange={e => handleQtyChange(item.id, Number(e.target.value))}
                        style={{
                          width: '80px',
                          padding: '6px 8px',
                          border: '1px solid #E5E8EB',
                          borderRadius: '6px',
                          fontSize: '14px',
                          textAlign: 'right',
                          outline: 'none',
                        }}
                      />
                    ) : (
                      <span style={{ color: '#C8D0DA' }}>-</span>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </Card>

      <div style={{ display: 'flex', gap: '8px' }}>
        <Button
          type="submit"
          variant="primary"
          disabled={isPending}
          loading={isPending}
        >
          송장 등록
        </Button>
      </div>
    </form>
  )
}
