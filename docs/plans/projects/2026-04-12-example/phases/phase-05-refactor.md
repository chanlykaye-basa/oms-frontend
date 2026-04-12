# Phase 05 — Refactor (코드 개선)

`/refactoring` 명령을 실행하거나 아래 가이드를 따른다.

## 목적
테스트가 깨지지 않는 범위 내에서 Phase 04 리뷰 피드백을 반영한다.

---

## Phase 04 피드백 반영 체크리스트

### 코드 리뷰 피드백
- [ ] (Phase 04 Subagent A 결과 복사)

### 비즈니스 로직 리뷰 피드백
- [ ] (Phase 04 Subagent B 결과 복사)

---

## OMS Frontend 리팩토링 관점

### 컴포넌트 분리
- [ ] 너무 큰 컴포넌트를 적절히 분리했는가?
- [ ] 공통 컴포넌트는 루트 `components/`로 올렸는가?

### 성능
- [ ] 불필요한 Client Component가 없는가?
- [ ] 데이터 패칭 위치가 최적인가? (Server Component에서 직접 패칭)

### 접근성
- [ ] 의미론적 HTML 사용 (button, form, etc.)
- [ ] 적절한 aria 속성

---

## 원칙
- 한 번에 하나의 리팩토링만. 중간에 테스트 실행
- 행위 변경 금지

---

## 완료 기준
- [ ] RTL + Playwright 테스트 모두 통과
- [ ] Phase 04 피드백 모두 반영
- [ ] 완료 후 이 폴더를 `archives/`로 이동
