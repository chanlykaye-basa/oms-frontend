# Phase 01 — 도메인 컨텍스트 + API 계약 파악

## 목적
구현 전 관련 도메인 문서를 읽고 UI 상태, API 계약, 비즈니스 규칙을 파악한다.

---

## 읽어야 할 문서 체크리스트

### 필수
- [ ] `docs/domain/00-OMS-서비스-개요.md` — 서비스 전체 맥락
- [ ] `docs/domain/07-OMS-API-명세-요약.md` — API 엔드포인트, 요청/응답 구조
- [ ] `docs/domain/08-OMS-용어사전.md` — UI 레이블 네이밍 기준

### 기능에 따라 선택
- [ ] `docs/domain/01-OMS-주문수집-도메인.md` — 주문 수집 관련 화면
- [ ] `docs/domain/02-OMS-주문처리-도메인.md` — 주문 처리/승인 화면
- [ ] `docs/domain/03-OMS-배송-도메인.md` — 배송 관련 화면
- [ ] `docs/domain/04-OMS-주문추적-도메인.md` — 추적 화면
- [ ] `docs/domain/05-OMS-주문-상태-머신.md` — 주문 상태별 UI 처리 (상태 배지, 버튼 활성화)

---

## 파악 결과 기록

### 사용할 API 엔드포인트
(URL, 메서드, 요청/응답 구조)

### UI에서 처리할 주문 상태
(표시할 상태, 상태별 버튼/배지 처리)

### 컴포넌트 분류
- Server Component로 처리할 것:
- Client Component ("use client") 필요한 것:

### 라우트 구조
(파일 위치 계획: page.tsx, _components/, _actions/, _hooks/)
