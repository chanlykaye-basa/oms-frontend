'use client'

import { useState, useTransition } from 'react'
import type { OrderItem } from '@/shared/types/api'
import { createShipmentAction } from '../_actions/createShipment'

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
        <p role="alert" style={{ color: 'red', fontSize: '14px' }}>
          {error}
        </p>
      )}

      <div>
        <label htmlFor="carrierCode" style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>
          배송사 <span style={{ color: 'red' }}>*</span>
        </label>
        <select
          id="carrierCode"
          name="carrierCode"
          required
          style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px', width: '200px' }}
        >
          <option value="">배송사 선택</option>
          {CARRIER_OPTIONS.map(carrier => (
            <option key={carrier.code} value={carrier.code}>
              {carrier.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="trackingNumber" style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>
          송장번호 <span style={{ color: 'red' }}>*</span>
        </label>
        <input
          id="trackingNumber"
          name="trackingNumber"
          type="text"
          required
          placeholder="송장번호를 입력하세요"
          style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px', width: '300px' }}
        />
      </div>

      <div>
        <h3 style={{ marginBottom: '12px' }}>배송 상품 선택 <span style={{ color: 'red' }}>*</span></h3>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #eee', textAlign: 'left' }}>
              <th style={{ padding: '8px', width: '40px' }}>선택</th>
              <th style={{ padding: '8px' }}>상품명</th>
              <th style={{ padding: '8px' }}>주문수량</th>
              <th style={{ padding: '8px' }}>배송수량</th>
            </tr>
          </thead>
          <tbody>
            {orderItems.map(item => {
              const isSelected = item.id in selectedItems
              return (
                <tr key={item.id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '8px' }}>
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={e => handleItemToggle(item.id, item.quantity, e.target.checked)}
                    />
                  </td>
                  <td style={{ padding: '8px' }}>{item.productName}</td>
                  <td style={{ padding: '8px' }}>{item.quantity}</td>
                  <td style={{ padding: '8px' }}>
                    {isSelected ? (
                      <input
                        type="number"
                        min={1}
                        max={item.quantity}
                        value={selectedItems[item.id] ?? item.quantity}
                        onChange={e => handleQtyChange(item.id, Number(e.target.value))}
                        style={{ width: '80px', padding: '4px', border: '1px solid #ccc', borderRadius: '4px' }}
                      />
                    ) : (
                      '-'
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <div style={{ display: 'flex', gap: '8px' }}>
        <button
          type="submit"
          disabled={isPending}
          style={{ padding: '10px 20px', backgroundColor: '#198754', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          {isPending ? '등록 중...' : '송장 등록'}
        </button>
      </div>
    </form>
  )
}
