---
description: REST API 네이밍, 응답 형태, 에러 처리 일관성 패턴
---

## URL 설계

- 리소스는 명사, 복수형
- 행위는 HTTP 메서드로 표현 (URL에 동사 넣지 않음)

```
✗ GET  /getUsers
✓ GET  /users

✗ POST /createPost
✓ POST /posts

✓ GET    /posts/:id
✓ PATCH  /posts/:id
✓ DELETE /posts/:id
```

## HTTP 메서드

| 메서드 | 용도 | 멱등성 |
|--------|------|--------|
| GET | 조회 | O |
| POST | 생성 | X |
| PUT | 전체 교체 | O |
| PATCH | 부분 수정 | O |
| DELETE | 삭제 | O |

## 응답 형태

성공 응답은 일관된 구조 유지:

```ts
// 단건
{ "data": { "id": 1, "name": "..." } }

// 목록
{
  "data": [...],
  "meta": { "total": 100, "page": 1, "limit": 20 }
}
```

## 에러 응답

```ts
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "이메일 형식이 올바르지 않습니다",
    "field": "email"   // 필드 에러인 경우
  }
}
```

## HTTP 상태 코드

| 코드 | 용도 |
|------|------|
| 200 | 성공 (조회, 수정) |
| 201 | 생성 성공 |
| 204 | 성공, 응답 본문 없음 (삭제) |
| 400 | 잘못된 요청 (클라이언트 오류) |
| 401 | 인증 필요 |
| 403 | 권한 없음 |
| 404 | 리소스 없음 |
| 409 | 충돌 (중복 등) |
| 422 | 유효성 검사 실패 |
| 500 | 서버 에러 |

## 버저닝

URL 경로에 버전 명시: `/api/v1/users`

## 페이지네이션

```
GET /posts?page=1&limit=20
GET /posts?cursor=abc123&limit=20   // cursor 방식 (무한 스크롤에 적합)
```
