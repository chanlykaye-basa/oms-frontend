# Phase 03 — 테스트 작성 (RTL + Playwright)

## 목적
구현한 컴포넌트와 핵심 user flow를 테스트로 검증한다.

---

## 테스트 전략

### React Testing Library (컴포넌트 단위 테스트)
- 위치: 컴포넌트와 같은 폴더 내 `*.test.tsx`
- Server/Client Component 모두 테스트
- API mock: `jest.fn()` 또는 `msw`

### Playwright (E2E 테스트)
- 위치: `e2e/` 폴더
- 파일명: `{feature}.spec.ts`
- 실제 브라우저에서 핵심 user flow 검증

---

## OMS Frontend 특화 테스트 관점

### 주문 상태 UI 테스트 (docs/domain/05-OMS-주문-상태-머신.md 기준)
- [ ] 각 주문 상태별 배지가 올바르게 표시
- [ ] 허용되지 않는 액션 버튼이 비활성화
- [ ] 상태 전이 성공 후 UI 업데이트

### 알려진 컴포넌트 패턴 주의사항
- `getByLabel()` 대신 `getByPlaceholder()` 또는 `locator('form input').nth(N)` 사용
  (Input.tsx의 Label이 htmlFor 없이 렌더링됨)
- 모달: `page.getByRole('dialog')` 범위로 스코프 지정
- 삭제 확인 모달: `confirmText="삭제"` 확인

### Playwright E2E 핵심 flow
- [ ] 주문 목록 조회
- [ ] 주문 상태 필터링
- [ ] 주문 상세 확인
- [ ] 상태 변경 액션 (해당 시)

---

## 완료 기준
- [ ] RTL 테스트 모두 통과
- [ ] Playwright E2E 핵심 flow 통과
- [ ] 테스트 커버리지 주요 경로 포함
