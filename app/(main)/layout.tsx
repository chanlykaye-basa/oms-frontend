import { headers } from 'next/headers'
import { Sidebar } from '@/shared/components/Sidebar'

export default async function MainLayout({ children }: { children: React.ReactNode }) {
  const headersList = await headers()
  const tenantId = headersList.get('x-tenant-id') ?? ''

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <header style={{ height: '56px', borderBottom: '1px solid #eee', display: 'flex', alignItems: 'center', padding: '0 24px' }}>
          <span style={{ fontSize: '14px', color: '#888' }}>테넌트 ID: {tenantId}</span>
        </header>
        <main style={{ flex: 1, padding: '24px' }}>{children}</main>
      </div>
    </div>
  )
}
