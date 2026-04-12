import { headers } from 'next/headers'
import { Sidebar } from '@/shared/components/Sidebar'

export default async function MainLayout({ children }: { children: React.ReactNode }) {
  const headersList = await headers()
  const tenantId = headersList.get('x-tenant-id') ?? ''

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: '#F9FAFB' }}>
        <header
          style={{
            height: '56px',
            borderBottom: '1px solid #E5E8EB',
            backgroundColor: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            padding: '0 24px',
            justifyContent: 'space-between',
          }}
        >
          <span style={{ fontSize: '13px', color: '#8B95A1' }}>
            테넌트: <strong style={{ color: '#4E5968' }}>{tenantId || '-'}</strong>
          </span>
        </header>
        <main style={{ flex: 1, padding: '24px' }}>{children}</main>
      </div>
    </div>
  )
}
