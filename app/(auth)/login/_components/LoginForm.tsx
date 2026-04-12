'use client'

import { useActionState } from 'react'
import { Input, Button, Card } from '@internal/design-system'
import { loginAction } from '../_actions/login'

export function LoginForm() {
  const [state, action, pending] = useActionState(loginAction, null)

  return (
    <Card style={{ width: '380px', padding: '40px' }}>
      <div style={{ marginBottom: '32px', textAlign: 'center' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #3182F6 0%, #1B64DA 100%)',
            color: '#FFFFFF',
            fontSize: '18px',
            fontWeight: 700,
            margin: '0 auto',
          }}
        >
          O
        </div>
        <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#191F28', marginTop: '12px' }}>
          OMS 로그인
        </h1>
        <p style={{ fontSize: '14px', color: '#8B95A1', marginTop: '4px' }}>
          주문 관리 시스템에 로그인하세요
        </p>
      </div>

      {state?.error && (
        <p
          role="alert"
          style={{
            color: '#F04452',
            fontSize: '13px',
            marginBottom: '16px',
            padding: '10px 14px',
            background: '#FEF2F2',
            borderRadius: '6px',
          }}
        >
          {state.error}
        </p>
      )}

      <form action={action} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <Input
          label="테넌트 ID"
          name="tenantId"
          type="text"
          required
          defaultValue="1"
          placeholder="테넌트 ID를 입력하세요"
        />
        <Button
          variant="primary"
          type="submit"
          loading={pending}
          fullWidth
          style={{ marginTop: '8px' }}
        >
          로그인
        </Button>
      </form>
    </Card>
  )
}
