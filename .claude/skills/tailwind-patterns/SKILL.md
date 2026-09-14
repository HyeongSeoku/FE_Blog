# Tailwind CSS Patterns

## 설정 (v4 기준)

```css
/* src/styles/global.css */
@import "tailwindcss";

@theme {
  --color-primary: oklch(55% 0.2 250);
  --color-primary-foreground: oklch(98% 0 0);
  --radius-card: 0.75rem;
  --font-sans: 'Pretendard Variable', system-ui, sans-serif;
}
```

## cva — 변형 컴포넌트

```tsx
import { cva, type VariantProps } from 'class-variance-authority'

const button = cva(
  'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive: 'bg-red-500 text-white hover:bg-red-600',
        outline: 'border border-input bg-transparent hover:bg-accent',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
      },
      size: {
        sm: 'h-8 px-3 text-sm',
        md: 'h-10 px-4',
        lg: 'h-12 px-6 text-lg',
        icon: 'size-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
)

interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof button> {}

export function Button({ variant, size, className, ...props }: ButtonProps) {
  return <button className={button({ variant, size, className })} {...props} />
}
```

## cn 유틸리티

```ts
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

// 조건부 클래스 + 충돌 해결
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// 사용
<div className={cn(
  'px-4 py-2',
  isActive && 'bg-primary text-white',
  className
)} />
```

## 반응형 패턴

```tsx
// 모바일 퍼스트
<div className="
  flex flex-col gap-4
  md:flex-row md:gap-6
  lg:gap-8
" />

// 컨테이너
<div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8" />

// 그리드
<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3" />
```

## Dark Mode

```tsx
// tailwind.config.ts
export default {
  darkMode: 'class', // html에 .dark 클래스 토글
}

// 컴포넌트
<div className="bg-white text-gray-900 dark:bg-gray-950 dark:text-gray-50" />

// 토글
document.documentElement.classList.toggle('dark')
```

## 애니메이션

```tsx
// 기본 트랜지션
<button className="transition-all duration-200 ease-out hover:scale-105 active:scale-95" />

// 페이드인
<div className="animate-fade-in" />

// tailwind.config.ts에 커스텀 애니메이션 추가
extend: {
  keyframes: {
    'fade-in': { from: { opacity: '0', transform: 'translateY(4px)' }, to: { opacity: '1', transform: 'none' } },
    'slide-up': { from: { transform: 'translateY(100%)' }, to: { transform: 'translateY(0)' } },
  },
  animation: {
    'fade-in': 'fade-in 0.2s ease-out',
    'slide-up': 'slide-up 0.3s ease-out',
  },
}
```

## 자주 쓰는 레이아웃 패턴

```tsx
// 세로 중앙 정렬
<div className="flex min-h-screen items-center justify-center" />

// 카드
<div className="rounded-xl border bg-card p-6 shadow-sm" />

// 오버레이
<div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />

// sticky 헤더
<header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur" />

// 스크롤 영역
<div className="h-[calc(100vh-64px)] overflow-y-auto" />
```

## 체크리스트

- [ ] 색상/간격 등 디자인 토큰은 @theme로 중앙 관리
- [ ] 조건부 클래스는 cn() 유틸 사용 (문자열 연결 금지)
- [ ] 변형이 있는 컴포넌트는 cva 사용
- [ ] 반응형은 모바일 퍼스트 (sm: md: lg: 순서)
- [ ] 애니메이션은 compositor 친화적 속성만 (transform, opacity)
- [ ] 긴 클래스 문자열은 여러 줄로 분리
