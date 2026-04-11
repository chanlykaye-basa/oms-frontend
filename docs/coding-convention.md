# OMS Frontend Coding Convention

Next.js App Router 공식 문서의 권장 사항을 기반으로, OMS 프론트엔드의 코딩 컨벤션을 정의한다.

---

## 1. 프로젝트 구조

Feature 기반 코로케이션을 사용한다. 도메인별로 관련 코드를 함께 배치한다.

```
app/
├── layout.tsx                    # Root Layout (html, body, 글로벌 Provider)
├── page.tsx                      # / 랜딩 페이지
├── global-error.tsx              # Root Layout 에러 처리
├── not-found.tsx                 # 전역 404
├── (auth)/                       # Route Group: 인증 관련
│   ├── layout.tsx
│   ├── login/page.tsx
│   └── register/page.tsx
├── (main)/                       # Route Group: 인증 후 메인
│   ├── layout.tsx                # 사이드바, GNB 등 공통 레이아웃
│   ├── orders/                   # 주문 도메인
│   │   ├── page.tsx              # 주문 목록
│   │   ├── loading.tsx           # 목록 로딩 스켈레톤
│   │   ├── error.tsx             # 주문 목록 에러
│   │   ├── [id]/
│   │   │   ├── page.tsx          # 주문 상세
│   │   │   ├── loading.tsx
│   │   │   └── error.tsx
│   │   ├── _components/          # 주문 전용 컴포넌트
│   │   │   ├── OrderStatusBadge.tsx
│   │   │   ├── OrderTable.tsx
│   │   │   └── OrderFilter.tsx
│   │   ├── _actions/             # 주문 Server Actions
│   │   │   └── order-actions.ts
│   │   ├── _hooks/               # 주문 전용 클라이언트 훅
│   │   │   └── use-order-filter.ts
│   │   └── _lib/                 # 주문 전용 유틸/타입
│   │       ├── types.ts
│   │       └── constants.ts
│   ├── shipments/                # 배송 도메인
│   │   ├── page.tsx
│   │   └── [id]/page.tsx
│   └── tracking/                 # 배송 추적 도메인
│       └── page.tsx
shared/                           # 2곳 이상에서 사용하는 공유 코드
├── components/
│   ├── ui/                       # 기본 UI 컴포넌트 (Button, Modal, Input 등)
│   ├── layout/                   # 레이아웃 컴포넌트 (Sidebar, Header 등)
│   └── data-display/             # 테이블, 페이지네이션 등
├── hooks/
├── lib/
│   ├── api.ts                    # API 클라이언트 설정
│   └── utils.ts
└── types/
    └── api.ts                    # API 응답 타입
```

### 구조 원칙

- **`_` 접두사**: Private Folder. 라우팅에서 제외되며, 해당 feature 전용 코드를 담는다.
- **`shared/`**: 2곳 이상에서 사용될 때만 이동한다. 처음부터 shared에 만들지 않는다.
- **Route Group `()`**: URL에 영향을 주지 않고 레이아웃과 관심사를 분리한다.
- **코로케이션**: 한 feature에서만 쓰이는 컴포넌트/훅/타입은 해당 라우트 폴더의 `_components/`, `_hooks/`, `_lib/`에 둔다.

---

## 2. Server Component vs Client Component

### 기본 원칙

모든 컴포넌트는 **기본적으로 Server Component**이다. `"use client"`는 인터랙션이 필요한 **최소 단위(leaf)**에만 선언한다.

### 판단 기준

| Server Component 사용 | Client Component 사용 |
|---|---|
| 데이터 fetching (API 호출) | useState, useEffect 등 React hooks |
| 민감 정보 접근 (API key, 토큰) | onClick, onChange 등 이벤트 리스너 |
| 무거운 의존성 (번들 크기 감소) | 브라우저 API (localStorage, window) |
| Metadata 생성 | 실시간 인터랙션 (폼, 검색, 필터) |

### 컴포지션 패턴

Client Component 안에서 Server Component를 사용해야 할 때, **children으로 전달**한다. Client Component가 Server Component를 직접 import하지 않는다.

```tsx
// shared/components/ui/Collapsible.tsx
"use client"
export default function Collapsible({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <div>
      <button onClick={() => setIsOpen(!isOpen)}>Toggle</button>
      {isOpen && children}
    </div>
  )
}

// app/(main)/orders/[id]/page.tsx (Server Component)
import Collapsible from '@/shared/components/ui/Collapsible'
import OrderHistory from './_components/OrderHistory' // Server Component

export default async function OrderDetailPage({ params }) {
  return (
    <Collapsible>
      <OrderHistory orderId={(await params).id} />  {/* Server Component가 children으로 전달 */}
    </Collapsible>
  )
}
```

### 주의 사항

- Server Component → Client Component로 전달하는 props는 **직렬화 가능**해야 한다. 함수, Date 객체 등은 직접 전달할 수 없다.
- `"use client"` 경계: 해당 파일에서 import하는 모든 모듈도 클라이언트 번들에 포함된다. 무거운 서버 전용 라이브러리를 실수로 import하지 않도록 주의한다.
- 서버 전용 코드에는 `import 'server-only'`를 추가하여 클라이언트 번들에 포함되면 빌드 에러가 발생하도록 한다.

```tsx
// shared/lib/server-utils.ts
import 'server-only'

export async function getOrderFromAPI(orderId: string) {
  // API_SECRET_KEY는 서버에서만 접근 가능
  const res = await fetch(`${process.env.API_URL}/orders/${orderId}`, {
    headers: { Authorization: `Bearer ${process.env.API_SECRET_KEY}` },
  })
  return res.json()
}
```

---

## 3. 데이터 페칭

### Server Component에서 직접 fetch (기본 패턴)

데이터가 필요한 컴포넌트에서 직접 fetch한다. Request Memoization이 동일 요청의 중복을 자동으로 제거한다.

```tsx
// app/(main)/orders/page.tsx
export default async function OrderListPage({ searchParams }) {
  const { status, page } = await searchParams
  const orders = await fetch(`${process.env.API_URL}/orders?status=${status}&page=${page}`, {
    next: { tags: ['orders'] },  // 태그 기반 캐시
  }).then(res => res.json())

  return <OrderTable orders={orders} />
}
```

### 병렬 fetch

여러 데이터를 가져올 때는 `Promise.all`로 waterfall을 방지한다.

```tsx
// app/(main)/orders/[id]/page.tsx
export default async function OrderDetailPage({ params }) {
  const { id } = await params
  const [order, shipments, statusHistory] = await Promise.all([
    getOrder(id),
    getShipments(id),
    getStatusHistory(id),
  ])
  return <div>...</div>
}
```

### 캐싱 전략

```tsx
// 주문 목록: 태그 기반 재검증 (mutation 후 revalidateTag('orders'))
fetch(`/api/orders`, { next: { tags: ['orders'] } })

// 주문 상세: 태그 기반 재검증
fetch(`/api/orders/${id}`, { next: { tags: [`order-${id}`] } })

// 실시간 데이터 (배송 추적 등): 캐시 비활성화
fetch(`/api/tracking/${id}`, { cache: 'no-store' })
```

### 클라이언트 데이터 페칭

실시간 업데이트가 필요한 경우에만 클라이언트에서 fetch한다. SWR이나 React Query를 사용한다.

```tsx
// 배송 추적처럼 실시간 갱신이 필요한 경우
"use client"
import useSWR from 'swr'

export function TrackingStatus({ trackingId }: { trackingId: string }) {
  const { data, error, isLoading } = useSWR(
    `/api/tracking/${trackingId}`,
    fetcher,
    { refreshInterval: 30000 }  // 30초마다 갱신
  )
  if (isLoading) return <Skeleton />
  if (error) return <ErrorMessage error={error} />
  return <TrackingTimeline data={data} />
}
```

---

## 4. Server Actions

### 파일 구조

Server Action은 feature의 `_actions/` 디렉토리에 별도 파일로 정의한다.

```tsx
// app/(main)/orders/_actions/order-actions.ts
"use server"

import { revalidateTag } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'
import { auth } from '@/shared/lib/auth'

const confirmOrderSchema = z.object({
  orderId: z.string().uuid(),
})

export async function confirmOrder(prevState: any, formData: FormData) {
  // 1. 인증 검사 (Server Action = 공개 엔드포인트이므로 필수)
  const session = await auth()
  if (!session) throw new Error('Unauthorized')

  // 2. 입력값 검증
  const parsed = confirmOrderSchema.safeParse({
    orderId: formData.get('orderId'),
  })
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors }
  }

  // 3. 비즈니스 로직 (백엔드 API 호출)
  const res = await fetch(`${process.env.API_URL}/orders/${parsed.data.orderId}/confirm`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${session.token}` },
  })

  if (!res.ok) {
    const body = await res.json()
    return { error: body.message }
  }

  // 4. 캐시 무효화
  revalidateTag(`order-${parsed.data.orderId}`)
  revalidateTag('orders')
}
```

### Server Action 원칙

- **인증/권한 검사는 항상 수행한다.** Server Action은 공개 HTTP 엔드포인트와 동일하다.
- **입력값은 항상 검증한다.** Zod 같은 스키마 라이브러리를 사용한다.
- **에러는 return으로 반환한다.** throw 대신 `{ error: '...' }` 형태로 반환하여 UI에서 처리한다.
- **캐시 무효화를 잊지 않는다.** `revalidateTag()` 또는 `revalidatePath()`를 호출한다.

### 폼 연동 패턴

```tsx
// app/(main)/orders/_components/ConfirmOrderButton.tsx
"use client"
import { useActionState } from 'react'
import { confirmOrder } from '../_actions/order-actions'

export function ConfirmOrderButton({ orderId }: { orderId: string }) {
  const [state, formAction, isPending] = useActionState(confirmOrder, null)

  return (
    <form action={formAction}>
      <input type="hidden" name="orderId" value={orderId} />
      <button type="submit" disabled={isPending}>
        {isPending ? '처리 중...' : '주문 확인'}
      </button>
      {state?.error && <p className="text-red-500">{state.error}</p>}
    </form>
  )
}
```

### Optimistic Update

상태 전이 액션처럼 즉각적인 피드백이 필요한 곳에 사용한다.

```tsx
"use client"
import { useOptimistic } from 'react'

export function OrderStatusActions({ order, availableTransitions }) {
  const [optimisticStatus, setOptimisticStatus] = useOptimistic(
    order.status,
    (_, newStatus) => newStatus
  )

  async function handleTransition(newStatus: string) {
    setOptimisticStatus(newStatus)  // 즉시 UI 반영
    await transitionOrder(order.id, newStatus)  // Server Action 호출
  }

  return (
    <div>
      <OrderStatusBadge status={optimisticStatus} />
      {availableTransitions.map(status => (
        <button key={status} onClick={() => handleTransition(status)}>
          {status}로 변경
        </button>
      ))}
    </div>
  )
}
```

---

## 5. 라우팅 & 레이아웃

### 특수 파일 활용

모든 라우트 세그먼트에 적절한 특수 파일을 배치한다.

| 파일 | 용도 | OMS 적용 예시 |
|---|---|---|
| `layout.tsx` | 공통 UI, 네비게이션 시 상태 유지 | 사이드바, GNB |
| `page.tsx` | 해당 경로의 고유 UI | 주문 목록, 주문 상세 |
| `loading.tsx` | Suspense 기반 로딩 UI | 스켈레톤 UI |
| `error.tsx` | Error Boundary 기반 에러 UI | "주문을 불러올 수 없습니다" + 재시도 |
| `not-found.tsx` | 404 UI | "주문을 찾을 수 없습니다" |

### error.tsx 패턴

```tsx
// app/(main)/orders/error.tsx
"use client"  // 반드시 Client Component

export default function OrderError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div>
      <h2>주문 목록을 불러올 수 없습니다</h2>
      <p>{error.message}</p>
      <button onClick={reset}>다시 시도</button>
    </div>
  )
}
```

### URL Search Params로 필터/정렬 상태 관리

주문 목록의 필터/정렬/페이지네이션은 URL search params로 관리한다. 공유 가능하고 새로고침에도 유지된다.

```tsx
// app/(main)/orders/page.tsx (Server Component)
export default async function OrderListPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; page?: string; sort?: string }>
}) {
  const { status, page = '1', sort = 'createdAt' } = await searchParams
  const orders = await getOrders({ status, page: Number(page), sort })
  return (
    <div>
      <OrderFilter currentStatus={status} />  {/* Client Component */}
      <OrderTable orders={orders} />
    </div>
  )
}
```

```tsx
// app/(main)/orders/_components/OrderFilter.tsx
"use client"
import { useRouter, useSearchParams, usePathname } from 'next/navigation'

export function OrderFilter({ currentStatus }: { currentStatus?: string }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  function handleStatusChange(status: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (status) params.set('status', status)
    else params.delete('status')
    params.set('page', '1')  // 필터 변경 시 첫 페이지로
    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <select value={currentStatus} onChange={e => handleStatusChange(e.target.value)}>
      <option value="">전체</option>
      <option value="COLLECTED">수집완료</option>
      <option value="CONFIRMED">주문확인</option>
      {/* ... 도메인 문서의 상태 목록 참조 */}
    </select>
  )
}
```

---

## 6. 컴포넌트 설계

### 단일 책임

한 컴포넌트는 한 가지 역할만 한다. "이 컴포넌트가 뭐하는 거야?"에 한 문장으로 답할 수 없으면 분리한다.

### props 설계

- props가 5개를 넘으면 객체로 묶거나 컴포넌트를 분리한다.
- 조건부 렌더링이 3단 이상 중첩되면 별도 컴포넌트로 추출한다.
- boolean props보다 명시적 값을 사용한다: `variant="primary"` > `isPrimary`

### 네이밍 규칙

| 대상 | 규칙 | 예시 |
|---|---|---|
| 컴포넌트 파일 | PascalCase.tsx | `OrderStatusBadge.tsx` |
| 유틸/훅/액션 파일 | kebab-case.ts | `use-order-filter.ts`, `order-actions.ts` |
| 컴포넌트 이름 | PascalCase, 역할이 드러나게 | `OrderStatusBadge`, `ShipmentTimeline` |
| 훅 이름 | use + 동사/명사 | `useOrderFilter`, `useTrackingStatus` |
| Server Action 이름 | 동사 + 명사 | `confirmOrder`, `cancelOrder` |
| 상수 | UPPER_SNAKE_CASE | `ORDER_STATUS_LABELS` |
| 타입/인터페이스 | PascalCase | `OrderDetail`, `ShipmentItem` |

---

## 7. 타입 안전성

### API 응답 타입 관리

백엔드 API 명세와 일치하는 타입을 한 곳에서 관리한다.

```tsx
// shared/types/api.ts
export interface ApiResponse<T> {
  data: T
  meta?: { page: number; totalPages: number; totalCount: number }
}

export interface ApiError {
  message: string
  code: string
  details?: Record<string, string[]>
}
```

```tsx
// app/(main)/orders/_lib/types.ts
export type OrderStatus =
  | 'COLLECTED'
  | 'PENDING_REVIEW'
  | 'CONFIRMED'
  | 'PREPARING_SHIPMENT'
  | 'SHIPPING'
  | 'DELIVERED'
  | 'DELIVERY_ISSUE'
  | 'PURCHASE_CONFIRMED'
  | 'RETURNING'
  | 'RETURNED'
  | 'CANCELLED'

export interface Order {
  id: string
  status: OrderStatus
  externalOrderId: string
  // ... 도메인 문서의 엔티티 정의 참조
}
```

### 타입 원칙

- `any` 사용 금지. `unknown` + type guard를 사용한다.
- 도메인 상태값은 union type으로 제한한다 (`OrderStatus`).
- API 응답은 반드시 타입을 정의하고, 런타임 검증이 필요하면 Zod를 사용한다.
- `as` 타입 단언은 최소화한다. 타입이 안 맞으면 타입 정의를 수정한다.

---

## 8. 에러/로딩/빈 상태 처리

모든 비동기 UI에 **로딩, 에러, 빈 상태** 3가지를 반드시 처리한다.

### loading.tsx + Suspense

```tsx
// app/(main)/orders/loading.tsx
export default function OrderListLoading() {
  return (
    <div>
      <div className="skeleton h-10 w-48" />  {/* 필터 스켈레톤 */}
      <div className="space-y-2">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="skeleton h-16 w-full" />  {/* 행 스켈레톤 */}
        ))}
      </div>
    </div>
  )
}
```

### 부분 Streaming

페이지 내에서 느린 부분만 Suspense로 감싼다.

```tsx
// app/(main)/orders/[id]/page.tsx
import { Suspense } from 'react'

export default async function OrderDetailPage({ params }) {
  const { id } = await params
  const order = await getOrder(id)

  return (
    <div>
      <OrderHeader order={order} />

      {/* 배송 이력은 느릴 수 있으므로 별도 Suspense */}
      <Suspense fallback={<ShipmentSkeleton />}>
        <ShipmentHistory orderId={id} />
      </Suspense>

      {/* 상태 변경 이력도 별도 Suspense */}
      <Suspense fallback={<StatusHistorySkeleton />}>
        <StatusHistory orderId={id} />
      </Suspense>
    </div>
  )
}
```

### 빈 상태

```tsx
export function OrderTable({ orders }: { orders: Order[] }) {
  if (orders.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p>조건에 맞는 주문이 없습니다</p>
      </div>
    )
  }
  return <table>...</table>
}
```

---

## 9. 성능 최적화

### next/image

모든 이미지에 `next/image`를 사용한다. `<img>` 태그를 직접 사용하지 않는다.

```tsx
import Image from 'next/image'

// priority: LCP(Largest Contentful Paint) 이미지에만 사용
<Image src={product.imageUrl} alt={product.name} width={200} height={200} priority />

// fill: 부모 컨테이너에 맞출 때. sizes 필수
<div style={{ position: 'relative', width: '100%', height: 300 }}>
  <Image src={hero} alt="Hero" fill sizes="100vw" style={{ objectFit: 'cover' }} />
</div>
```

### next/font

```tsx
// app/layout.tsx
import { Noto_Sans_KR } from 'next/font/google'

const notoSansKR = Noto_Sans_KR({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  display: 'swap',
  variable: '--font-noto-sans-kr',
})

export default function RootLayout({ children }) {
  return (
    <html lang="ko" className={notoSansKR.variable}>
      <body className={notoSansKR.className}>{children}</body>
    </html>
  )
}
```

### Dynamic Import

무거운 컴포넌트는 `next/dynamic`으로 lazy loading한다.

```tsx
import dynamic from 'next/dynamic'

const HeavyChart = dynamic(() => import('./_components/OrderChart'), {
  loading: () => <ChartSkeleton />,
  ssr: false,  // 클라이언트에서만 렌더링 (차트 라이브러리 등)
})
```

### 기타

- `useMemo`, `useCallback`은 측정 후 필요한 곳에만 사용한다. 기본적으로 쓰지 않는다.
- 대량 목록(1000행 이상)은 가상화 라이브러리(react-virtual 등)를 사용한다.

---

## 10. 환경변수 & 보안

### 환경변수 규칙

```env
# 서버에서만 접근 (클라이언트 번들에 포함되지 않음)
API_URL=http://oms-backend:8080
API_SECRET_KEY=secret

# 클라이언트에 노출 (NEXT_PUBLIC_ 접두사)
NEXT_PUBLIC_APP_URL=https://oms.example.com
```

- `NEXT_PUBLIC_` 없는 변수는 Server Component, Server Action, Route Handler에서만 접근 가능하다.
- API key, secret, 내부 서비스 URL은 절대 `NEXT_PUBLIC_`을 붙이지 않는다.

### 보안 원칙

- Server Action에서 반드시 인증/권한 검사를 수행한다.
- 입력값은 Zod 등으로 서버 측에서 반드시 검증한다.
- 서버 전용 유틸에 `import 'server-only'`를 추가한다.

---

## 11. i18n

하드코딩된 문자열을 사용하지 않는다. i18n 라이브러리(next-intl 또는 react-i18next)를 통해 관리한다.

- 도메인 용어는 `docs/domain/08-OMS-용어사전.md`의 한글/영문 매핑을 따른다.
- i18n 키는 페이지/기능 단위로 네임스페이스를 분리한다: `orders.status.COLLECTED`, `shipments.tracking.title`

---

## 12. 접근성 (a11y)

- 시맨틱 HTML 사용: `<button>`, `<nav>`, `<main>`, `<table>` 등
- 인터랙티브 요소에 적절한 `aria-` 속성: `aria-label`, `aria-describedby`, `aria-live`
- Modal에 `aria-modal="true"`, focus trap 적용
- 키보드 내비게이션 가능: Tab, Enter, Escape 동작 보장
- 색상만으로 정보를 전달하지 않는다 (주문 상태 뱃지에 색상 + 텍스트)
