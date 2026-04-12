'use client'

import { useActionState } from 'react'
import { loginAction } from '../_actions/login'

export function LoginForm() {
  const [state, action, pending] = useActionState(loginAction, null)

  return (
    <form action={action} style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '320px' }}>
      <h1>OMS 로그인</h1>
      {state?.error && (
        <p role="alert" aria-live="polite" style={{ color: 'red', fontSize: '14px' }}>
          {state.error}
        </p>
      )}
      <div>
        <label htmlFor="tenantId">테넌트 ID</label>
        <input
          id="tenantId"
          name="tenantId"
          type="text"
          required
          defaultValue="1"
          placeholder="테넌트 ID를 입력하세요"
          style={{ display: 'block', width: '100%' }}
        />
      </div>
      <button type="submit" disabled={pending}>
        {pending ? '로그인 중...' : '로그인'}
      </button>
    </form>
  )
}
