import Link from 'next/link'

const NAV_ITEMS = [
  { href: '/dashboard', label: '대시보드' },
  { href: '/orders', label: '주문 관리' },
  { href: '/collection-jobs', label: '수집 작업' },
]

export function Sidebar() {
  return (
    <nav
      aria-label="사이드바 네비게이션"
      style={{ width: '240px', backgroundColor: '#1a1a2e', color: 'white', minHeight: '100vh' }}
    >
      <div style={{ padding: '16px', fontWeight: 'bold', fontSize: '18px' }}>OMS</div>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {NAV_ITEMS.map(item => (
          <li key={item.href}>
            <Link
              href={item.href}
              style={{ display: 'block', padding: '10px 16px', color: 'white', textDecoration: 'none' }}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}
