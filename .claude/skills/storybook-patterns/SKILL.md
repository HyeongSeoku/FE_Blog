# Storybook Patterns

## 설정 (Storybook 8 + Vite)

```ts
// .storybook/main.ts
import type { StorybookConfig } from '@storybook/react-vite'

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(ts|tsx)'],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-a11y',
    '@storybook/addon-interactions',
  ],
  framework: { name: '@storybook/react-vite', options: {} },
}
export default config

// .storybook/preview.ts
import type { Preview } from '@storybook/react'
import '../src/styles/global.css'

const preview: Preview = {
  parameters: {
    backgrounds: {
      default: 'light',
      values: [
        { name: 'light', value: '#ffffff' },
        { name: 'dark', value: '#0a0a0a' },
      ],
    },
  },
}
export default preview
```

## Story 작성

```tsx
// Button.stories.tsx
import type { Meta, StoryObj } from '@storybook/react'
import { Button } from './Button'

const meta: Meta<typeof Button> = {
  component: Button,
  tags: ['autodocs'],  // 자동 문서 생성
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'destructive', 'outline', 'ghost'],
    },
    size: { control: 'radio', options: ['sm', 'md', 'lg'] },
    disabled: { control: 'boolean' },
    onClick: { action: 'clicked' },
  },
}
export default meta
type Story = StoryObj<typeof Button>

export const Default: Story = {
  args: { children: '버튼', variant: 'default', size: 'md' },
}

export const Destructive: Story = {
  args: { children: '삭제', variant: 'destructive' },
}

export const Loading: Story = {
  args: { children: '저장 중...', disabled: true },
}

// 여러 변형 한번에 보기
export const AllVariants: Story = {
  render: () => (
    <div className="flex gap-2">
      {(['default', 'destructive', 'outline', 'ghost'] as const).map(v => (
        <Button key={v} variant={v}>{v}</Button>
      ))}
    </div>
  ),
}
```

## 인터랙션 테스트

```tsx
import { userEvent, within, expect } from '@storybook/test'

export const SubmitForm: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await userEvent.type(canvas.getByLabelText('이메일'), 'test@example.com')
    await userEvent.type(canvas.getByLabelText('비밀번호'), 'password123')
    await userEvent.click(canvas.getByRole('button', { name: /로그인/i }))

    await expect(canvas.getByText('로그인 성공')).toBeInTheDocument()
  },
}
```

## MSW로 API 모킹

```tsx
import { http, HttpResponse } from 'msw'
import { initialize, mswLoader } from 'msw-storybook-addon'

initialize()

export const WithData: Story = {
  loaders: [mswLoader],
  parameters: {
    msw: {
      handlers: [
        http.get('/api/users', () =>
          HttpResponse.json([{ id: '1', name: '홍길동' }])
        ),
      ],
    },
  },
}
```

## Decorator — 공통 래퍼

```tsx
// .storybook/preview.ts
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const preview: Preview = {
  decorators: [
    Story => {
      const queryClient = new QueryClient()
      return (
        <QueryClientProvider client={queryClient}>
          <Story />
        </QueryClientProvider>
      )
    },
  ],
}
```

## 체크리스트

- [ ] 모든 UI 컴포넌트에 stories 파일 작성
- [ ] argTypes로 Controls 패널 설정 (variant, size, disabled 등)
- [ ] 로딩/에러/빈 상태 스토리 작성
- [ ] 인터랙션 테스트로 폼/모달 흐름 검증
- [ ] a11y 애드온으로 접근성 체크
- [ ] autodocs 태그로 자동 문서 생성
