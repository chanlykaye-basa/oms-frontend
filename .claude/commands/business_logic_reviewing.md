# Business Logic Review - OMS Frontend

프론트엔드 코드가 OMS 도메인 문서의 비즈니스 규칙을 올바르게 반영하는지 검토합니다.

## 입력

$ARGUMENTS

## 절차

### 1. 도메인 문서 로딩

`../docs/domain/` 하위 문서를 읽습니다:
- `05-OMS-주문-상태-머신.md` — UI에서 허용할 상태 전이
- `07-OMS-API-명세-요약.md` — API 호출 규격
- `08-OMS-용어사전.md` — UI 라벨 네이밍

### 2. OMS 프론트엔드 비즈니스 정합성

- [ ] **주문 상태 표시**: 11개 상태(COLLECTED~CANCELLED)가 모두 UI에 매핑되어 있는가?
- [ ] **상태 전이 버튼**: 현재 상태에서 가능한 전이만 액션 버튼으로 노출
- [ ] **주문수집 화면**: 필수 입력 필드가 API 명세와 일치
- [ ] **배송 정보**: Shipment 관련 UI가 배송 도메인 규칙과 일치
- [ ] **취소/반품 UI**: 취소 가능 조건, 반품 사유 입력이 도메인 규칙과 일치
- [ ] **UI 라벨**: 한글 라벨이 용어사전과 일치 (i18n 키 확인)
- [ ] **검증 규칙**: 프론트 검증이 백엔드 검증과 일관되는가?

### 3. Next.js 라우팅 vs 도메인 구조

- [ ] 라우트 구조가 도메인 개념과 자연스럽게 매핑되는가? (예: `/orders/[id]`, `/shipments/[id]`)
- [ ] Server Action / Route Handler의 mutation이 도메인 규칙을 올바르게 호출하는가?
- [ ] 권한별 페이지 접근 제어가 middleware에서 처리되는가?

### 4. API 연동 검증

- [ ] API 호출 URL, HTTP 메서드, 요청/응답 형식이 명세와 일치
- [ ] Server Component에서의 fetch vs Client Component에서의 fetch 구분이 적절
- [ ] 에러 응답 처리가 사용자 친화적인가?
- [ ] 로딩(loading.tsx/Suspense)/에러(error.tsx)/빈 상태가 모두 처리되는가?

## 출력 형식

```
### 일치: [OK] 설명 (근거 문서)
### 불일치: [MISMATCH] 파일:라인 - 도메인 vs UI
### 누락: [MISSING] 도메인 규칙이 UI에 반영되지 않음
```
