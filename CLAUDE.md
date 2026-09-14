# 프로젝트 개요

{프로젝트 한 줄 설명}

# 기술 스택

- Framework:
- Package Manager:
- Linter/Formatter:

# 주요 커맨드

- 개발 서버: `{dev command}`
- 타입 체크: `{tsc command}`
- 린트/포맷: `{lint command}`
- 빌드: `{build command}`

# 규칙

{프로젝트 특화 규칙 — CSS 방식, 금지 패턴 등}

# 폴더/파일 구조

FSD(Feature-Sliced Design) 방식을 따른다.

## 레이어

```
src/
  app/       ← 앱 초기화, 프로바이더, 라우팅
  pages/     ← 페이지 단위 컴포넌트
  widgets/   ← 여러 feature/entity를 조합한 독립 UI 블록
  features/  ← 사용자 인터랙션, 비즈니스 로직 단위
  entities/  ← 비즈니스 도메인 객체 (user, product 등)
  shared/    ← 재사용 가능한 공통 요소 (UI 킷, API, 유틸)
```

## 레이어 규칙

- 상위 레이어는 하위 레이어만 import 가능, 역방향 금지
  `app → pages → widgets → features → entities → shared`
- 같은 레이어 간 import 금지 (shared 제외)
- 각 슬라이스는 `index.ts`로 public API만 노출, 내부 직접 import 금지
- `shared/ui`는 비즈니스 로직 포함 금지
- 새 기능 추가 시 레이어 결정 기준:
  - 도메인 객체 → `entities`
  - 사용자 액션/폼/버튼 단위 → `features`
  - 페이지 내 독립 블록 → `widgets`

## 세그먼트 폴더명 고정

각 슬라이스 내부는 아래 이름만 사용:

```
ui/      ← 컴포넌트
model/   ← store, types, 비즈니스 로직
api/     ← 서버 요청
lib/     ← 유틸, 헬퍼
config/  ← 상수, 설정
```

## 네이밍 컨벤션

| 대상 | 규칙 | 예시 |
|------|------|------|
| 레이어/슬라이스/세그먼트 폴더 | kebab-case | `user-profile/`, `auth-form/` |
| 컴포넌트 파일 | PascalCase.tsx | `UserCard.tsx` |
| 훅 | camelCase, `use` 접두사 | `useUserProfile.ts` |
| API 함수 | camelCase | `fetchUser.ts` |
| 타입 | PascalCase | `UserTypes.ts` |
| 스토어 | camelCase | `userStore.ts` |
| 상수 | UPPER_SNAKE_CASE | `MAX_RETRY_COUNT` |
| Public API | 고정 | `index.ts` |

## 슬라이스 구조 예시

```
features/auth/
  ui/
    LoginForm.tsx
    LoginButton.tsx
  model/
    authStore.ts
    authTypes.ts
  api/
    loginUser.ts
  index.ts
```

# 도메인 용어

{팀 내부 용어, 비즈니스 도메인 개념 정의}

# Subagent 사용 기준

다음 상황에서는 반드시 subagent를 활용할 것:

- **탐색 + 구현이 동시에 필요한 경우** → Explore subagent로 먼저 파악, 구현은 그 다음
- **3개 이상의 독립적인 파일을 수정해야 하는 경우** → 파일별로 병렬 처리
- **코드베이스를 모르는 상태에서 작업 범위를 파악해야 하는 경우** → `/explore` 커맨드 사용

Subagent를 쓰지 않아도 되는 경우:
- 단일 파일 수정
- 이미 파악된 범위 내의 작업
