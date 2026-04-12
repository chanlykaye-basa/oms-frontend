'use client'

import { useTransition, useState } from 'react'
import { useRouter } from 'next/navigation'
import type { OrderStatus } from '@/shared/types/api'
import { ALLOWED_ACTIONS } from '@/shared/types/api'
import {
  confirmOrderAction,
  rejectOrderAction,
  cancelOrderAction,
  prepareShipmentAction,
} from '../_actions/orderActions'

interface OrderActionsProps {
  orderId: string
  status: OrderStatus
}

export function OrderActions({ orderId, status }: OrderActionsProps) {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [showCancelForm, setShowCancelForm] = useState(false)
  const [cancelReason, setCancelReason] = useState('')
  const router = useRouter()

  const allowedActions = ALLOWED_ACTIONS[status] ?? []

  if (allowedActions.length === 0) {
    return null
  }

  async function handleConfirm() {
    setError(null)
    startTransition(async () => {
      const result = await confirmOrderAction(orderId)
      if (result?.error) setError(result.error)
    })
  }

  async function handleReject() {
    setError(null)
    startTransition(async () => {
      const result = await rejectOrderAction(orderId)
      if (result?.error) setError(result.error)
    })
  }

  async function handleCancel() {
    if (!cancelReason.trim()) {
      setError('취소 사유를 입력하세요.')
      return
    }
    setError(null)
    startTransition(async () => {
      const result = await cancelOrderAction(orderId, cancelReason.trim())
      if (result?.error) setError(result.error)
    })
  }

  async function handlePrepareShipment() {
    setError(null)
    startTransition(async () => {
      const result = await prepareShipmentAction(orderId)
      if (result?.error) setError(result.error)
    })
  }

  function handleAddShipment() {
    router.push(`/orders/${orderId}/shipments/new`)
  }

  return (
    <div style={{ marginTop: '24px' }}>
      {error && (
        <p role="alert" style={{ color: 'red', marginBottom: '12px', fontSize: '14px' }}>
          {error}
        </p>
      )}

      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        {allowedActions.includes('confirm') && (
          <button
            onClick={handleConfirm}
            disabled={isPending}
            style={{ padding: '8px 16px', backgroundColor: '#0d6efd', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            {isPending ? '처리 중...' : '주문 확인'}
          </button>
        )}

        {allowedActions.includes('reject') && (
          <button
            onClick={handleReject}
            disabled={isPending}
            style={{ padding: '8px 16px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            {isPending ? '처리 중...' : '반려'}
          </button>
        )}

        {allowedActions.includes('prepareShipment') && (
          <button
            onClick={handlePrepareShipment}
            disabled={isPending}
            style={{ padding: '8px 16px', backgroundColor: '#6610f2', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            {isPending ? '처리 중...' : '출고 지시'}
          </button>
        )}

        {allowedActions.includes('addShipment') && (
          <button
            onClick={handleAddShipment}
            disabled={isPending}
            style={{ padding: '8px 16px', backgroundColor: '#198754', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            송장 등록
          </button>
        )}

        {allowedActions.includes('cancel') && !showCancelForm && (
          <button
            onClick={() => setShowCancelForm(true)}
            disabled={isPending}
            style={{ padding: '8px 16px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            주문 취소
          </button>
        )}
      </div>

      {showCancelForm && (
        <div style={{ marginTop: '16px', padding: '16px', border: '1px solid #eee', borderRadius: '8px' }}>
          <h3 style={{ marginBottom: '12px' }}>주문 취소</h3>
          <div style={{ marginBottom: '12px' }}>
            <label htmlFor="cancelReason" style={{ display: 'block', marginBottom: '4px', fontSize: '14px' }}>
              취소 사유 <span style={{ color: 'red' }}>*</span>
            </label>
            <textarea
              id="cancelReason"
              value={cancelReason}
              onChange={e => setCancelReason(e.target.value)}
              placeholder="취소 사유를 입력하세요"
              rows={3}
              style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px', resize: 'vertical' }}
            />
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={handleCancel}
              disabled={isPending}
              style={{ padding: '8px 16px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
            >
              {isPending ? '처리 중...' : '취소 확정'}
            </button>
            <button
              onClick={() => { setShowCancelForm(false); setCancelReason(''); setError(null) }}
              disabled={isPending}
              style={{ padding: '8px 16px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
            >
              돌아가기
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
