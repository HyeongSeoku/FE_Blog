---
description: XSS, 환경변수 노출, 민감 데이터, 의존성 보안 등 코드 작성 시 챙길 보안 패턴
---

## 환경변수

- 시크릿은 절대 클라이언트에 노출 금지
- `NEXT_PUBLIC_` 접두사 없는 변수는 서버에서만 사용
- `.env` 파일은 절대 커밋 금지 — `.gitignore` 필수
- `.env.example`에 키 이름만 기록 (값 없이)

```bash
# .env.example
DATABASE_URL=
API_SECRET_KEY=
NEXT_PUBLIC_API_BASE_URL=
```

## XSS 방지

- 사용자 입력을 `dangerouslySetInnerHTML`에 직접 주입 금지
- 외부 URL 렌더링 시 허용 목록 기반 검증
- 마크다운/HTML 렌더링은 DOMPurify 등으로 sanitize

## 인증 / 세션

- 토큰은 `localStorage` 대신 `httpOnly` 쿠키 저장
- 민감 작업(결제, 비밀번호 변경)은 재인증 요구
- JWT 만료 시간 짧게 유지, refresh token 패턴 사용

## API 호출

- 클라이언트에서 직접 외부 API 시크릿 사용 금지 → 서버 라우트 경유
- CORS 설정 최소 권한 원칙
- 사용자 입력은 서버에서 반드시 재검증 (클라이언트 검증만으로 신뢰 금지)

## 의존성

- `npm audit` / `pnpm audit` 정기 실행
- 출처 불분명한 패키지 설치 전 검토
- 패키지 버전 고정 (`package-lock.json` / `pnpm-lock.yaml` 커밋)

## 민감 데이터 로깅 금지

```ts
// ✗
console.log('user:', user) // 비밀번호, 토큰 포함 가능

// ✓
console.log('user id:', user.id)
```
