# Code Review - OMS Frontend

OMS 프론트엔드(Next.js) 코드의 품질, 접근성, 성능을 검토합니다.

## 입력

$ARGUMENTS

(비어있으면 `git diff --name-only`로 변경 파일 대상)

## 체크리스트

### Next.js 아키텍처
- [ ] **App Router**: Server Component / Client Component 구분이 적절한가?
- [ ] `"use client"` 선언이 필요한 곳에만 있는가? (불필요한 클라이언트 번들 방지)
- [ ] **Server Actions**: form 처리, mutation이 Server Action으로 적절히 구현되었는가?
- [ ] **라우팅**: `app/` 디렉토리 구조가 URL과 일치하고, layout/page/loading/error 활용
- [ ] **데이터 페칭**: Server Component에서 fetch, 필요시 `cache`/`revalidate` 설정
- [ ] **Middleware**: 인증/인가 체크가 middleware에서 적절히 처리되는가?

### React 코드 품질
- [ ] 컴포넌트 단일 책임
- [ ] props 인터페이스가 명확하고 필요한 것만 받는가?
- [ ] 상태 관리: 불필요한 전역 상태, props drilling 없는가?
- [ ] Client Component에서 useMemo/useCallback 적절한 사용
- [ ] useEffect 의존성 배열 정확성, 불필요한 effect 없는가?

### OMS UI 특화
- [ ] **주문 상태 표시**: 상태별 색상/라벨이 일관되고, 상태 머신과 매핑
- [ ] **주문 목록**: 필터/정렬/페이지네이션 — URL search params 활용하는가?
- [ ] **상태 전이 액션**: 허용된 전이만 버튼으로 노출되는가?
- [ ] **배송 추적**: 실시간 갱신 전략 (polling, Server-Sent Events)
- [ ] **에러 상태**: API 실패 시 error.tsx 또는 사용자 친화적 에러 표시

### Next.js 성능
- [ ] **Image 최적화**: `next/image` 사용, width/height 명시
- [ ] **Font 최적화**: `next/font` 사용
- [ ] **Dynamic import**: 무거운 컴포넌트의 lazy loading (`next/dynamic`)
- [ ] **Streaming**: loading.tsx, Suspense 활용으로 TTFB 개선
- [ ] 대량 목록의 가상화 (virtualization) 필요성

### i18n / 접근성
- [ ] 하드코딩된 문자열 없이 i18n 처리 (next-intl 또는 react-i18next)
- [ ] 시맨틱 HTML, aria 속성
- [ ] 키보드 내비게이션, Modal focus trap

## 출력 형식

```
[CRITICAL/WARNING/INFO] 파일:라인 - 설명
  현재: ...
  제안: ...
  이유: ...
```
