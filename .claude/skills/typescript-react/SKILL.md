# TypeScript + React 패턴

## Generic 컴포넌트

```tsx
// 재사용 가능한 리스트 컴포넌트
interface ListProps<T> {
  items: T[]
  renderItem: (item: T, index: number) => ReactNode
  keyExtractor: (item: T) => string
  emptyState?: ReactNode
}

function List<T>({ items, renderItem, keyExtractor, emptyState }: ListProps<T>) {
  if (items.length === 0) return <>{emptyState}</>
  return (
    <ul>
      {items.map((item, index) => (
        <li key={keyExtractor(item)}>{renderItem(item, index)}</li>
      ))}
    </ul>
  )
}

// 사용
<List
  items={users}
  keyExtractor={u => u.id}
  renderItem={user => <UserCard user={user} />}
/>
```

## Discriminated Union — 상태 표현

```tsx
type AsyncState<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: Error }

function DataView<T>({ state, render }: {
  state: AsyncState<T>
  render: (data: T) => ReactNode
}) {
  switch (state.status) {
    case 'idle': return null
    case 'loading': return <Spinner />
    case 'error': return <ErrorMessage error={state.error} />
    case 'success': return <>{render(state.data)}</>
  }
}
```

## Props 유틸리티 타입

```tsx
// 특정 Props 제외
type ButtonWithoutOnClick = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onClick'>

// 특정 Props만 선택
type InputValueProps = Pick<InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'>

// 특정 Props 재정의
type OverrideProps<T, K extends keyof T, V> = Omit<T, K> & Record<K, V>

// 컴포넌트 Props 추출
type ButtonProps = ComponentProps<typeof Button>
type ButtonRef = ComponentRef<typeof Button>

// ref forwarding
const Input = forwardRef<HTMLInputElement, InputProps>(({ ...props }, ref) => (
  <input ref={ref} {...props} />
))
```

## 이벤트 핸들러 타입

```tsx
// 정확한 이벤트 타입
const handleChange = (e: ChangeEvent<HTMLInputElement>) => {}
const handleSubmit = (e: FormEvent<HTMLFormElement>) => {}
const handleClick = (e: MouseEvent<HTMLButtonElement>) => {}
const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {}

// 여러 요소에 공통으로 쓰는 핸들러
const handleChange: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement> =
  e => setValue(e.target.value)
```

## as const + Enum 대체

```ts
// Enum 사용 금지
// enum Status { Pending = 'pending', Active = 'active' } ❌

// as const 사용
const STATUS = {
  PENDING: 'pending',
  ACTIVE: 'active',
  INACTIVE: 'inactive',
} as const

type Status = (typeof STATUS)[keyof typeof STATUS]
// 'pending' | 'active' | 'inactive'

// 배열에서 타입 파생
const SIZES = ['sm', 'md', 'lg'] as const
type Size = (typeof SIZES)[number] // 'sm' | 'md' | 'lg'
```

## 조건부 타입 — 컴포넌트 변형

```tsx
// href가 있으면 앵커, 없으면 버튼
type ButtonProps =
  | ({ as?: 'button' } & ButtonHTMLAttributes<HTMLButtonElement>)
  | ({ as: 'a'; href: string } & AnchorHTMLAttributes<HTMLAnchorElement>)

function Button(props: ButtonProps) {
  if (props.as === 'a') {
    const { as, ...rest } = props
    return <a {...rest} />
  }
  const { as, ...rest } = props
  return <button {...rest} />
}
```

## 타입 가드

```ts
// 타입 단언(as) 대신 타입 가드
function isUser(value: unknown): value is User {
  return (
    typeof value === 'object' &&
    value !== null &&
    'id' in value &&
    'name' in value
  )
}

// API 응답 처리
async function fetchUser(id: string): Promise<User> {
  const data: unknown = await api.get(`/users/${id}`)
  if (!isUser(data)) throw new Error('Invalid user data')
  return data
}
```

## 체크리스트

- [ ] any 금지 → unknown + 타입 가드 사용
- [ ] Enum 금지 → as const 객체 사용
- [ ] 타입 단언(as) 최소화 → 타입 가드로 대체
- [ ] Generic 컴포넌트로 재사용성 확보
- [ ] 컴포넌트 Props는 ComponentProps<typeof X>로 추출
- [ ] 이벤트 핸들러 타입 정확히 명시
