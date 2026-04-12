'use client'

import { useTransition, useState } from 'react'
import { useRouter } from 'next/navigation'
import type { OrderStatus } from '@/shared/types/api'
import { ALLOWED_ACTIONS } from '@/shared/types/api'
import { Button, Card } from '@internal/design-system'
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
        <p
          role="alert"
          style={{
            color: '#F04452',
            marginBottom: '12px',
            fontSize: '14px',
            padding: '10px 14px',
            background: '#FEF2F2',
            borderRadius: '8px',
          }}
        >
          {error}
        </p>
      )}

      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        {allowedActions.includes('confirm') && (
          <Button
            variant="primary"
            onClick={handleConfirm}
            disabled={isPending}
            loading={isPending}
          >
            주문 확인
          </Button>
        )}

        {allowedActions.includes('reject') && (
          <Button
            variant="danger"
            onClick={handleReject}
            disabled={isPending}
            loading={isPending}
          >
            반려
          </Button>
        )}

        {allowedActions.includes('prepareShipment') && (
          <Button
            variant="secondary"
            onClick={handlePrepareShipment}
            disabled={isPending}
            loading={isPending}
          >
            출고 지시
          </Button>
        )}

        {allowedActions.includes('addShipment') && (
          <Button
            variant="primary"
            onClick={handleAddShipment}
            disabled={isPending}
          >
            송장 등록
          </Button>
        )}

        {allowedActions.includes('cancel') && !showCancelForm && (
          <Button
            variant="danger"
            onClick={() => setShowCancelForm(true)}
            disabled={isPending}
          >
            주문 취소
          </Button>
        )}
      </div>

      {showCancelForm && (
        <Card
          header={
            <span style={{ fontSize: '15px', fontWeight: 600, color: '#191F28' }}>주문 취소</span>
          }
          style={{ marginTop: '16px' }}
        >
          <div style={{ marginBottom: '16px' }}>
            <label
              htmlFor="cancelReason"
              style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: 500, color: '#4E5968' }}
            >
              취소 사유 <span style={{ color: '#F04452' }}>*</span>
            </label>
            <textarea
              id="cancelReason"
              value={cancelReason}
              onChange={e => setCancelReason(e.target.value)}
              placeholder="취소 사유를 입력하세요"
              rows={3}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid #E5E8EB',
                borderRadius: '8px',
                resize: 'vertical',
                fontSize: '14px',
                color: '#191F28',
                outline: 'none',
                fontFamily: 'inherit',
              }}
            />
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <Button
              variant="danger"
              onClick={handleCancel}
              disabled={isPending}
              loading={isPending}
            >
              취소 확정
            </Button>
            <Button
              variant="secondary"
              onClick={() => { setShowCancelForm(false); setCancelReason(''); setError(null) }}
              disabled={isPending}
            >
              돌아가기
            </Button>
          </div>
        </Card>
      )}
    </div>
  )
}
