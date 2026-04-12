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
      <head>
        <link rel="preconnect" href="https://cdn.jsdelivr.net" />
        <link
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.min.css"
          rel="stylesheet"
        />
        <style>{`
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body { font-family: 'Pretendard Variable', -apple-system, sans-serif; background: #F9FAFB; color: #191F28; }
          @keyframes ds-spin { to { transform: rotate(360deg); } }
          @keyframes spin { to { transform: rotate(360deg); } }
        `}</style>
      </head>
      <body>{children}</body>
    </html>
  )
}
