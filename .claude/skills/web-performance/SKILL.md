# Web Performance

## Core Web Vitals 목표

| 지표 | Good | Poor | 의미 |
|------|------|------|------|
| LCP | < 2.5s | > 4s | 가장 큰 콘텐츠 렌더링 시간 |
| INP | < 200ms | > 500ms | 인터랙션 응답 시간 |
| CLS | < 0.1 | > 0.25 | 레이아웃 이동 |
| FCP | < 1.8s | > 3s | 첫 콘텐츠 렌더링 |
| TTFB | < 800ms | > 1.8s | 첫 바이트 응답 |

## Code Splitting

```tsx
import { lazy, Suspense } from 'react'

// 페이지 레벨 분할
const Dashboard = lazy(() => import('./pages/Dashboard'))
const Settings = lazy(() => import('./pages/Settings'))

function App() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </Suspense>
  )
}

// 무거운 라이브러리 지연 로딩
async function exportToExcel(data: Row[]) {
  const { utils, writeFile } = await import('xlsx')
  const ws = utils.json_to_sheet(data)
  const wb = utils.book_new()
  utils.book_append_sheet(wb, ws, 'Sheet1')
  writeFile(wb, 'export.xlsx')
}
```

## 이미지 최적화

```tsx
// 히어로 이미지 — 즉시 로드
<img
  src="/hero.avif"
  alt="Hero"
  width={1200}
  height={600}
  fetchPriority="high"
  decoding="sync"
/>

// 일반 이미지 — 지연 로드
<img
  src="/product.avif"
  alt="Product"
  width={400}
  height={300}
  loading="lazy"
  decoding="async"
/>

// 반응형 이미지
<img
  srcSet="/img-400.avif 400w, /img-800.avif 800w, /img-1200.avif 1200w"
  sizes="(max-width: 640px) 400px, (max-width: 1024px) 800px, 1200px"
  src="/img-1200.avif"
  alt="Responsive"
  width={1200}
  height={800}
/>
```

## 폰트 최적화

```html
<!-- preload critical fonts -->
<link rel="preload" href="/fonts/pretendard-variable.woff2" as="font" type="font/woff2" crossorigin />
```

```css
@font-face {
  font-family: 'Pretendard Variable';
  src: url('/fonts/pretendard-variable.woff2') format('woff2');
  font-display: swap;
  font-weight: 100 900;
}
```

## React 렌더링 최적화

```tsx
// memo — props가 바뀌지 않으면 리렌더링 생략
const ExpensiveList = memo(({ items }: { items: Item[] }) => (
  <ul>{items.map(item => <li key={item.id}>{item.name}</li>)}</ul>
))

// 비싼 연산 메모이제이션
const sorted = useMemo(
  () => [...items].sort((a, b) => a.price - b.price),
  [items]
)

// 리스트 가상화 — 수천 개 아이템
import { useVirtualizer } from '@tanstack/react-virtual'

function VirtualList({ items }: { items: Item[] }) {
  const parentRef = useRef<HTMLDivElement>(null)
  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 56,
  })

  return (
    <div ref={parentRef} className="h-96 overflow-auto">
      <div style={{ height: virtualizer.getTotalSize() }}>
        {virtualizer.getVirtualItems().map(vItem => (
          <div
            key={vItem.key}
            style={{ transform: `translateY(${vItem.start}px)`, position: 'absolute', width: '100%' }}
          >
            <ItemRow item={items[vItem.index]} />
          </div>
        ))}
      </div>
    </div>
  )
}
```

## 번들 분석

```bash
# Vite
npx vite-bundle-visualizer

# 번들 크기 확인
npx bundlephobia <package-name>
```

```ts
// vite.config.ts — 청크 분리
build: {
  rollupOptions: {
    output: {
      manualChunks: {
        vendor: ['react', 'react-dom'],
        query: ['@tanstack/react-query'],
        ui: ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu'],
      },
    },
  },
}
```

## CLS 방지

```tsx
// 이미지/미디어 크기 사전 지정
<img width={400} height={300} src="..." alt="..." />

// 스켈레톤으로 레이아웃 예약
function CardSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-48 rounded-lg bg-gray-200" />
      <div className="mt-2 h-4 w-3/4 rounded bg-gray-200" />
      <div className="mt-1 h-4 w-1/2 rounded bg-gray-200" />
    </div>
  )
}

// 폰트 로딩으로 인한 FOUT 방지 → font-display: swap + preload
```

## 체크리스트

- [ ] 히어로 이미지 `fetchPriority="high"`, 나머지 `loading="lazy"`
- [ ] 모든 이미지/비디오에 width/height 명시 (CLS 방지)
- [ ] 페이지 단위로 코드 스플리팅 (lazy + Suspense)
- [ ] 무거운 라이브러리 (차트, 엑셀 등) 동적 import
- [ ] 긴 리스트는 가상화 (@tanstack/react-virtual)
- [ ] 번들 크기 주기적 확인 (vite-bundle-visualizer)
- [ ] 폰트 preload + font-display: swap
