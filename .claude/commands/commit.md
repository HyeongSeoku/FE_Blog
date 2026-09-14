staged된 변경사항을 분석하고 Conventional Commits 형식으로 커밋 메시지를 작성해.

## 형식

```
<type>(<scope>): <subject>

[body - 변경 이유가 비자명한 경우에만]
```

## type

- `feat`: 새 기능
- `fix`: 버그 수정
- `refactor`: 리팩토링 (기능 변경 없음)
- `style`: 포맷, 세미콜론 등 (로직 변경 없음)
- `docs`: 문서
- `test`: 테스트
- `chore`: 빌드, 설정, 패키지 등

## 규칙

- subject는 한국어, 명령형으로 작성 (예: "로그인 폼 추가", "타입 에러 수정")
- scope는 변경된 주요 영역 — 파일명 말고 도메인 단위 (예: auth, button, api)
- 50자 이내
- 커밋 메시지만 출력, 설명 없이
