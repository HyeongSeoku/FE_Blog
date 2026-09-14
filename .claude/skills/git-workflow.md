---
description: 브랜치 전략, 커밋 컨벤션, PR 작성, 머지 전 체크리스트
---

## 브랜치 네이밍

```
feat/login-form
fix/auth-token-refresh
refactor/button-component
chore/update-dependencies
docs/api-guide
```

- 슬래시 구분자 사용
- 케밥 케이스
- 짧고 의미 있게 (이슈 번호 포함 가능: `feat/123-login-form`)

## 커밋 컨벤션 (Conventional Commits)

```
<type>(<scope>): <subject>

[body]
```

- `feat`: 새 기능
- `fix`: 버그 수정
- `refactor`: 기능 변경 없는 코드 개선
- `chore`: 빌드, 설정, 의존성
- `docs`: 문서
- `test`: 테스트
- `style`: 포맷, 공백 (로직 변화 없음)
- subject는 50자 이내, 명령형, 마침표 없음

## PR 설명 구조

```markdown
## 변경 내용
- 무엇을 왜 변경했는지

## 테스트 방법
- 어떻게 검증했는지

## 스크린샷 (UI 변경 시)
```

## 머지 전 체크리스트

- [ ] 로컬에서 빌드 성공
- [ ] 타입 에러 없음 (`tsc --noEmit`)
- [ ] 린트 통과
- [ ] 불필요한 `console.log` 제거
- [ ] 환경변수 `.env.example` 업데이트 (추가한 경우)
- [ ] 셀프 리뷰 완료

## 충돌 해결 원칙

- 충돌 파일 직접 확인 후 수동 해결 — 자동 머지 도구 맹신 금지
- 상대방 변경 의도 파악 후 결정
- 해결 후 반드시 동작 확인
