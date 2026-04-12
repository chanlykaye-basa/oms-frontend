'use client'

import { usePathname } from 'next/navigation'
import { Sidebar } from '@internal/design-system'

const NAV_ITEMS = [
  { href: '/dashboard', label: '대시보드' },
  { href: '/orders', label: '주문 관리' },
  { href: '/collection-jobs', label: '수집 작업' },
]

export function AppSidebar() {
  const pathname = usePathname()
  return (
    <Sidebar
      title="주문 관리"
      badge="OMS"
      navItems={NAV_ITEMS}
      activePath={pathname}
    />
  )
}
