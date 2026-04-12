# Phase 02 — 컴포넌트 구현

## 목적
Phase 01에서 파악한 API 계약과 UI 요구사항을 바탕으로 컴포넌트를 구현한다.

---

## 구현 순서

1. **Server Component** (page.tsx) — 데이터 패칭, 레이아웃
2. **_actions/** — Server Action (폼 제출, 뮤테이션)
3. **_components/** — 재사용 UI 조각
4. **_hooks/** — Client 상태 (필요 시)
5. **_lib/** — 유틸 (데이터 변환 등)

---

## OMS Frontend 구현 가이드

### Server Component 우선
```typescript
// 기본: Server Component (파일 상단에 "use client" 없음)
export default async function OrdersPage() {
  const orders = await fetchOrders(); // 직접 fetch
  return <OrderList orders={orders} />;
}
```

### Client Component는 필요 최소한으로
```typescript
"use client"; // 인터랙션(상태, 이벤트)이 필요할 때만
```

### 주문 상태 UI 처리
- docs/domain/05-OMS-주문-상태-머신.md 기준으로 상태별 배지 색상, 버튼 활성화 처리
- 허용되지 않는 액션은 UI에서도 비활성화

### 코로케이션 규칙
- 이 feature에서만 사용하는 컴포넌트 → `_components/`
- 전역 공유 컴포넌트 → `components/` (루트)

---

## 완료 기준
- [ ] 페이지가 브라우저에서 정상 렌더링
- [ ] API 연동 동작
- [ ] TypeScript 오류 없음
