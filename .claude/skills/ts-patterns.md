---
description: TypeScript 타입 정의, 에러 처리, 비동기 패턴 가이드
---

## 타입 정의

- 유니온 타입은 `type` alias
- 객체 형태는 `interface`
- Generic 네이밍은 의미 있게 (`T` 대신 `TItem`, `TResponse`)
- Enum 사용 금지 → `as const` 객체 사용

```ts
// ✗
enum Status { Active, Inactive }

// ✓
const Status = {
  Active: 'active',
  Inactive: 'inactive',
} as const
type Status = typeof Status[keyof typeof Status]
```

## 에러 처리

- catch는 항상 `unknown`으로 받고 타입 가드로 좁히기

```ts
try {
  await fetchData()
} catch (err) {
  if (err instanceof Error) {
    console.error(err.message)
  }
}
```

## 비동기

- `async` 함수는 반환 타입 명시: `Promise<T>`
- `Promise.all` 사용 시 반환 타입 자동 추론 의존 가능

## 타입 가드

```ts
function isApiError(err: unknown): err is ApiError {
  return typeof err === 'object' && err !== null && 'code' in err
}
```

## 유틸리티 타입

- `Partial<T>` — 선택적 Props
- `Required<T>` — 필수 Props
- `Pick<T, K>` / `Omit<T, K>` — 필드 선택/제외
- `ReturnType<T>` — 함수 반환 타입 추출
