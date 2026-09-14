# React Testing (RTL + Vitest)

## 설정

```ts
// vitest.config.ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
  },
})

// src/test/setup.ts
import '@testing-library/jest-dom'
```

## 기본 렌더링 테스트

```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { UserCard } from './UserCard'

describe('UserCard', () => {
  const user = { id: '1', name: '홍길동', email: 'hong@example.com' }

  it('사용자 이름을 표시한다', () => {
    render(<UserCard user={user} />)
    expect(screen.getByText('홍길동')).toBeInTheDocument()
  })

  it('이메일 링크가 올바른 href를 가진다', () => {
    render(<UserCard user={user} />)
    expect(screen.getByRole('link', { name: /이메일/i }))
      .toHaveAttribute('href', 'mailto:hong@example.com')
  })
})
```

## 사용자 인터랙션

```tsx
import userEvent from '@testing-library/user-event'

it('버튼 클릭 시 카운터가 증가한다', async () => {
  const user = userEvent.setup()
  render(<Counter />)

  await user.click(screen.getByRole('button', { name: /증가/i }))

  expect(screen.getByText('1')).toBeInTheDocument()
})

it('폼 제출 시 onSubmit이 호출된다', async () => {
  const user = userEvent.setup()
  const onSubmit = vi.fn()
  render(<LoginForm onSubmit={onSubmit} />)

  await user.type(screen.getByLabelText('이메일'), 'test@example.com')
  await user.type(screen.getByLabelText('비밀번호'), 'password123')
  await user.click(screen.getByRole('button', { name: /로그인/i }))

  expect(onSubmit).toHaveBeenCalledWith({
    email: 'test@example.com',
    password: 'password123',
  })
})
```

## 비동기 테스트

```tsx
import { waitFor, waitForElementToBeRemoved } from '@testing-library/react'

it('데이터 로딩 후 목록을 표시한다', async () => {
  render(<PostList />)

  // 로딩 스피너가 사라질 때까지 대기
  await waitForElementToBeRemoved(() => screen.getByRole('progressbar'))

  expect(screen.getAllByRole('listitem')).toHaveLength(3)
})

it('에러 시 에러 메시지를 표시한다', async () => {
  server.use(
    http.get('/api/posts', () => HttpResponse.error())
  )
  render(<PostList />)

  await waitFor(() => {
    expect(screen.getByRole('alert')).toBeInTheDocument()
  })
})
```

## MSW로 API 모킹

```ts
// src/test/handlers.ts
import { http, HttpResponse } from 'msw'

export const handlers = [
  http.get('/api/users/:id', ({ params }) => {
    return HttpResponse.json({ id: params.id, name: '홍길동' })
  }),
  http.post('/api/login', async ({ request }) => {
    const body = await request.json()
    if (body.email === 'wrong@example.com') {
      return HttpResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }
    return HttpResponse.json({ token: 'mock-token' })
  }),
]

// src/test/setup.ts
import { setupServer } from 'msw/node'
import { handlers } from './handlers'

export const server = setupServer(...handlers)
beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())
```

## Custom Hook 테스트

```tsx
import { renderHook, act } from '@testing-library/react'
import { useCounter } from './useCounter'

it('초기값이 0이다', () => {
  const { result } = renderHook(() => useCounter())
  expect(result.current.count).toBe(0)
})

it('increment 호출 시 1 증가한다', () => {
  const { result } = renderHook(() => useCounter())
  act(() => result.current.increment())
  expect(result.current.count).toBe(1)
})
```

## Provider 래핑 유틸리티

```tsx
// src/test/utils.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, RenderOptions } from '@testing-library/react'

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}

function customRender(ui: ReactElement, options?: RenderOptions) {
  return render(ui, { wrapper: createWrapper(), ...options })
}

export * from '@testing-library/react'
export { customRender as render }
```

## 체크리스트

- [ ] getBy* → 없으면 에러 / queryBy* → 없으면 null / findBy* → 비동기 대기
- [ ] 구현 세부사항 말고 사용자 관점 쿼리 사용 (getByRole, getByLabelText)
- [ ] API 호출은 MSW로 모킹 (fetch/axios 직접 모킹 지양)
- [ ] userEvent.setup()은 각 테스트 케이스마다 생성
- [ ] 비동기는 waitFor 또는 findBy* 사용 (sleep 금지)
- [ ] Provider 필요한 테스트는 customRender 유틸 사용
