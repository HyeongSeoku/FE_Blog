`$ARGUMENTS` 이름으로 React 컴포넌트를 생성해.

## 규칙

- `src/components/` 하위에 폴더 생성
- `index.tsx`, `types.ts` 파일 포함
- Props 타입은 별도 `types.ts`에 `interface`로 정의
- 함수형 컴포넌트만 사용
- Tailwind 클래스 사용, CSS-in-JS 금지
- `export default` 사용

## 파일 구조

```
src/components/{name}/
  index.tsx
  types.ts
```
