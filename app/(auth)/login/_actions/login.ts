'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function loginAction(
  _prevState: { error: string } | null,
  formData: FormData,
): Promise<{ error: string } | null> {
  const tenantId = formData.get('tenantId') as string

  if (!tenantId || tenantId.trim() === '') {
    return { error: '테넌트 ID를 입력하세요' }
  }

  const cookieStore = await cookies()
  cookieStore.set('tenant_id', tenantId.trim(), { httpOnly: true, path: '/' })

  redirect('/dashboard')
}
