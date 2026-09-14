---
description: Web Vitals 기준, 렌더링 최적화, 번들 사이즈 관리 패턴
---

## Web Vitals 기준

| 지표 | Good | Poor |
|------|------|------|
| LCP  | ≤ 2.5s | > 4s |
| INP  | ≤ 200ms | > 500ms |
| CLS  | ≤ 0.1 | > 0.25 |

## 렌더링 최적화

**불필요한 리렌더 방지**

```tsx
// 자식에 전달하는 객체/함수는 메모이제이션
const handler = useCallback(() => { ... }, [dep])
const config = useMemo(() => ({ ... }), [dep])

// 순수 컴포넌트는 memo로 감싸기
const ListItem = memo(({ item }: Props) => <li>{item.name}</li>)
```

**파생 상태는 useMemo 또는 직접 계산**

```tsx
// ✗ — 파생 상태를 useState로 관리
const [filtered, setFiltered] = useState(items.filter(...))

// ✓ — 렌더 중 직접 계산 (비용 낮으면)
const filtered = items.filter(item => item.active)

// ✓ — 비용 높으면 useMemo
const filtered = useMemo(() => items.filter(item => item.active), [items])
```

## 이미지 최적화

- `next/image` 사용 필수 (자동 WebP 변환, lazy loading)
- `priority` 속성은 LCP 대상 이미지에만
- `sizes` 속성으로 뷰포트별 크기 명시

## 번들 최적화

- 동적 임포트로 코드 스플리팅

```tsx
const HeavyEditor = dynamic(() => import('./HeavyEditor'), {
  loading: () => <Skeleton />,
  ssr: false,
})
```

- `barrel export` (`index.ts`) 남용 금지 — tree shaking 방해
- 라이브러리 선택 시 번들 사이즈 확인 (bundlephobia 기준)

## 목록 렌더링

- 긴 목록은 가상화 (`react-window`, `@tanstack/react-virtual`)
- `key`는 인덱스 대신 고유 ID 사용

## 폰트

```tsx
// next/font 사용 — CLS 방지, 자동 최적화
import { Inter } from 'next/font/google'
const inter = Inter({ subsets: ['latin'], display: 'swap' })
```
