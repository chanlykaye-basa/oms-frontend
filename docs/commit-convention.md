# OMS Frontend Commit Convention

## 형식

```
<type>(<scope>): <subject>

<body>

<footer>
```

## Type

| type | 설명 |
|------|------|
| `feat` | 새로운 기능/페이지/컴포넌트 추가 |
| `fix` | 버그 수정 |
| `refactor` | 기능 변경 없이 코드 구조 개선 |
| `style` | UI/스타일 변경 (기능 변경 없음) |
| `test` | 테스트 추가/수정 |
| `config` | 설정 변경 (next.config, tailwind, eslint 등) |
| `i18n` | 다국어 번역 추가/수정 |
| `docs` | 문서 변경 |

## Scope

페이지/기능 단위로 작성합니다:

| scope | 설명 |
|-------|------|
| `order-list` | 주문 목록 페이지 |
| `order-detail` | 주문 상세 페이지 |
| `shipment` | 배송 관련 UI |
| `tracking` | 배송 추적 UI |
| `common` | 공통 컴포넌트 (Button, Modal, Table 등) |
| `layout` | 레이아웃, 네비게이션 |
| `auth` | 인증/인가 관련 UI |

scope가 여러 페이지에 걸치면 가장 핵심 하나만 적거나 생략합니다.

## Subject

- 한글 또는 영문, **동사로 시작**
- 50자 이내
- 마침표 없음

## Body (선택)

- **왜** 이 변경이 필요한지 작성
- Server Component / Client Component 변경 시 이유 명시
- 라우트 구조 변경 시 변경 전/후 명시

## Footer (선택)

- `Breaking Change:` 하위 호환이 깨지는 변경
- `Refs:` 관련 이슈/PR 번호

## 예시

```
feat(order-list): 주문 목록 페이지 구현

Server Component로 초기 데이터 fetch.
URL search params로 필터/정렬 상태 관리.
```

```
fix(order-detail): 상태 전이 버튼 비활성화 조건 수정

현재 상태에서 불가능한 전이 액션이 노출되던 문제 수정.
```

```
style(common): 주문 상태 뱃지 색상 통일

디자인 시스템 기준으로 상태별 색상 매핑 정리.
```

```
i18n(order-detail): 배송 상세 영문 번역 추가
```
