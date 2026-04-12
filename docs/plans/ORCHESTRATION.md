# OMS Frontend — Plans 폴더 가이드

이 폴더는 PARA 방식으로 기능 개발 계획을 관리합니다.

---

## 폴더 구조

```
plans/
├── projects/                       ← 진행 중인 작업
│   └── YYYY-MM-DD-{기능명}/        ← 날짜+기능명으로 폴더 생성
│       ├── ORCHESTRATION.md        ← ★ 이 기능의 실행 중심 파일
│       ├── README.md               ← 작업 간단 설명
│       └── phases/                 ← 이 기능의 phase 파일들
│           ├── phase-01-domain-review.md
│           ├── phase-02-implement.md
│           ├── phase-03-test.md
│           ├── phase-04-review.md
│           └── phase-05-refactor.md
├── areas/                          ← 지속 관리 영역 (표준, 아키텍처)
├── resources/                      ← 참고 자료
├── archives/                       ← 완료된 작업 (projects/에서 이동)
└── adr/                            ← Architecture Decision Records
```

---

## 새 기능 시작 방법

1. `projects/YYYY-MM-DD-{기능명}/` 폴더 생성
2. `ORCHESTRATION.md` 작성 — 이 기능의 Phase 계획, 관련 도메인 문서, 완료 기준
3. `README.md` 작성 — 목표와 현재 상태 한눈에 보기
4. `phases/` 폴더에 phase-01 ~ phase-05 파일 생성
5. `ORCHESTRATION.md`를 중심으로 Phase 순서대로 실행

---

## 완료 후

해당 `projects/{폴더}/` 전체를 `archives/{폴더}/`로 이동.

---

## Phase 패턴 (모든 기능 공통)

| Phase | 방식 | 내용 |
|-------|------|------|
| 01 | Sequential | docs/domain/ 도메인 컨텍스트 + API 계약 파악 |
| 02 | Sequential | 컴포넌트 구현 (Server Component 우선) |
| 03 | Sequential | RTL + Playwright 테스트 |
| 04 | **Parallel** | `/code_reviewing` + `/business_logic_reviewing` (subagent 동시 실행) |
| 05 | Sequential | `/refactoring` |

---

## OMS Frontend 핵심 원칙

- Server Component 우선 (`"use client"` 최소화)
- 코로케이션: `_components/`, `_actions/`, `_hooks/`, `_lib/`
- 주문 상태 UI: 상태 머신 문서 기준으로 배지/버튼 처리
