# [OMS Frontend] 주문 목록 페이지 구현 — Orchestration

> 이 파일은 이 기능의 실행 중심입니다. Phase 순서대로 진행하세요.

## Feature 요약
주문 목록을 표시하고 상태별 필터링이 가능한 페이지 구현

## 관련 도메인 문서
- `docs/domain/02-OMS-주문처리-도메인.md`
- `docs/domain/05-OMS-주문-상태-머신.md`
- `docs/domain/07-OMS-API-명세-요약.md`

## 라우트 위치
`app/(main)/orders/`

---

## Phase 실행 순서

| Phase | 실행 방식    | 명령 / 작업                          | 파일                                  | 상태 |
|-------|------------|--------------------------------------|---------------------------------------|------|
| 01    | Sequential | 도메인 컨텍스트 + API 계약 파악        | phases/phase-01-domain-review.md      | ✅   |
| 02    | Sequential | 컴포넌트 구현                         | phases/phase-02-implement.md         | ⬜   |
| 03    | Sequential | 테스트 작성 (RTL + Playwright)        | phases/phase-03-test.md              | ⬜   |
| 04    | **Parallel** | `/code_reviewing` + `/business_logic_reviewing` | phases/phase-04-review.md | ⬜   |
| 05    | Sequential | `/refactoring` — 코드 개선           | phases/phase-05-refactor.md          | ⬜   |

> Phase 04: 두 리뷰를 **동시에** subagent로 실행. 둘 다 완료 후 Phase 05 진행.

---

## 핵심 확인 사항
- Server Component 우선 여부
- 주문 상태별 UI 처리 (상태 머신 기준)
- API 연동 엔드포인트

---

## 완료 기준
- [ ] RTL + Playwright 테스트 모두 통과
- [ ] 코드 리뷰 + 비즈니스 로직 리뷰 피드백 반영
- [ ] 완료 후 이 폴더 전체를 `../../archives/`로 이동
