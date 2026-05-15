# React Patterns

## Hooks 패턴

### Custom Hook — 로직 분리

```tsx
// 나쁜 예: 컴포넌트에 로직 직접 작성
function UserProfile({ userId }: { userId: string }) {
  const [user, setUser] = useState<User | null>(null)
  useEffect(() => {
    fetchUser(userId).then(setUser)
  }, [userId])
  return <div>{user?.name}</div>
}

// 좋은 예: custom hook으로 분리
function useUser(userId: string) {
  const [user, setUser] = useState<User | null>(null)
  useEffect(() => {
    fetchUser(userId).then(setUser)
  }, [userId])
  return user
}

function UserProfile({ userId }: { userId: string }) {
  const user = useUser(userId)
  return <div>{user?.name}</div>
}
```

### useReducer — 복잡한 상태

```tsx
type State = { count: number; error: string | null }
type Action =
  | { type: 'increment' }
  | { type: 'decrement' }
  | { type: 'error'; message: string }

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'increment': return { ...state, count: state.count + 1 }
    case 'decrement': return { ...state, count: state.count - 1 }
    case 'error': return { ...state, error: action.message }
  }
}
```

### useCallback / useMemo — 언제 쓸까

```tsx
// useMemo: 비용이 큰 계산
const sortedItems = useMemo(
  () => items.sort((a, b) => a.price - b.price),
  [items]
)

// useCallback: 자식 컴포넌트에 함수 prop 전달 시
const handleSubmit = useCallback((data: FormData) => {
  onSubmit(data)
}, [onSubmit])

// 불필요한 경우 — 단순 계산이나 자식이 memo가 아닐 때는 생략
```

## 컴포넌트 합성 패턴

### Compound Components

```tsx
// Context로 상태 공유
const TabsContext = createContext<TabsContextType | null>(null)

function Tabs({ children, defaultValue }: TabsProps) {
  const [active, setActive] = useState(defaultValue)
  return (
    <TabsContext.Provider value={{ active, setActive }}>
      {children}
    </TabsContext.Provider>
  )
}

Tabs.List = function TabsList({ children }: { children: ReactNode }) {
  return <div role="tablist">{children}</div>
}

Tabs.Trigger = function TabsTrigger({ value, children }: TabsTriggerProps) {
  const ctx = useContext(TabsContext)!
  return (
    <button
      role="tab"
      aria-selected={ctx.active === value}
      onClick={() => ctx.setActive(value)}
    >
      {children}
    </button>
  )
}

Tabs.Content = function TabsContent({ value, children }: TabsContentProps) {
  const ctx = useContext(TabsContext)!
  return ctx.active === value ? <div role="tabpanel">{children}</div> : null
}
```

### Render Props

```tsx
function DataFetcher<T>({
  url,
  render,
}: {
  url: string
  render: (data: T | null, loading: boolean) => ReactNode
}) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    fetch(url).then(r => r.json()).then(d => { setData(d); setLoading(false) })
  }, [url])
  return <>{render(data, loading)}</>
}
```

## Context 패턴

```tsx
// 타입 안전한 Context + Provider
interface AuthContextType {
  user: User | null
  login: (credentials: Credentials) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const login = async (credentials: Credentials) => {
    const user = await authApi.login(credentials)
    setUser(user)
  }
  const logout = () => setUser(null)
  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
```

## Portal — 모달/툴팁

```tsx
function Modal({ isOpen, onClose, children }: ModalProps) {
  if (!isOpen) return null
  return createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        {children}
      </div>
    </div>,
    document.body
  )
}
```

## Error Boundary

```tsx
class ErrorBoundary extends Component<
  { fallback: ReactNode; children: ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  render() {
    return this.state.hasError ? this.props.fallback : this.props.children
  }
}

// 함수형으로 쓰려면 react-error-boundary 패키지 사용
import { ErrorBoundary } from 'react-error-boundary'

<ErrorBoundary fallback={<ErrorPage />}>
  <App />
</ErrorBoundary>
```

## 체크리스트

- [ ] custom hook으로 컴포넌트 로직 분리
- [ ] useCallback/useMemo는 실제 필요할 때만 사용
- [ ] Context는 자주 변경되는 값과 분리
- [ ] 컴포넌트 내부에서 컴포넌트 정의 금지
- [ ] key prop에 index 사용 지양 (안정적인 id 사용)
- [ ] Error Boundary로 런타임 에러 격리
