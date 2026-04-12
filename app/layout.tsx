import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'OMS - 주문 관리 시스템',
  description: '주문 수집 및 처리 관리 시스템',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  )
}
