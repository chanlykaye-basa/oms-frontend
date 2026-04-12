# Phase 04 — Review (병렬 subagent 실행)

## 목적
코드 컨벤션 준수와 비즈니스 로직 정합성을 동시에 검토한다.

---

## 병렬 실행 (두 subagent 동시 실행)

### Subagent A: 코드 리뷰
```
/code_reviewing
```
- 기준: `docs/coding-convention.md`
- 체크 항목:
  - [ ] Server Component 우선 원칙 준수
  - [ ] `"use client"` 최소화
  - [ ] 코로케이션 구조 준수 (`_components/`, `_actions/` 등)
  - [ ] TypeScript strict 모드 위반 없음
  - [ ] 불필요한 `any` 타입 없음
  - [ ] Server Action에서 적절한 에러 처리

### Subagent B: 비즈니스 로직 리뷰
```
/business_logic_reviewing
```
- 기준: `docs/domain/` 전체 문서
- 체크 항목:
  - [ ] 주문 상태별 UI 처리가 상태 머신과 일치
  - [ ] 허용 불가 액션이 UI에서 차단됨
  - [ ] API 호출 엔드포인트가 API 명세와 일치
  - [ ] 용어사전 기준 UI 레이블 사용

---

## 취합 후 Phase 05 진행
두 리뷰 결과를 취합하여 개선 목록 작성 → Phase 05 Refactor 진행
