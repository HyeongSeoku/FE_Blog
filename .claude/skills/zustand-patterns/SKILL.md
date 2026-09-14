# Zustand Patterns

## 기본 스토어

```ts
import { create } from 'zustand'

interface CounterStore {
  count: number
  increment: () => void
  decrement: () => void
  reset: () => void
}

export const useCounterStore = create<CounterStore>(set => ({
  count: 0,
  increment: () => set(state => ({ count: state.count + 1 })),
  decrement: () => set(state => ({ count: state.count - 1 })),
  reset: () => set({ count: 0 }),
}))
```

## Slice 패턴 — 큰 스토어 분리

```ts
import { create, StateCreator } from 'zustand'

interface AuthSlice {
  user: User | null
  login: (user: User) => void
  logout: () => void
}

interface CartSlice {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (id: string) => void
}

type StoreState = AuthSlice & CartSlice

const createAuthSlice: StateCreator<StoreState, [], [], AuthSlice> = set => ({
  user: null,
  login: user => set({ user }),
  logout: () => set({ user: null }),
})

const createCartSlice: StateCreator<StoreState, [], [], CartSlice> = set => ({
  items: [],
  addItem: item => set(state => ({ items: [...state.items, item] })),
  removeItem: id =>
    set(state => ({ items: state.items.filter(i => i.id !== id) })),
})

export const useStore = create<StoreState>((...args) => ({
  ...createAuthSlice(...args),
  ...createCartSlice(...args),
}))
```

## 선택자(Selector)로 리렌더링 최적화

```tsx
// 나쁜 예: 스토어 전체 구독 → 어떤 값이 바뀌어도 리렌더링
const store = useStore()

// 좋은 예: 필요한 값만 구독
const user = useStore(state => state.user)
const itemCount = useStore(state => state.items.length)

// 여러 값 — shallow 비교
import { useShallow } from 'zustand/react/shallow'

const { user, login } = useStore(
  useShallow(state => ({ user: state.user, login: state.login }))
)
```

## persist — 로컬스토리지 저장

```ts
import { persist, createJSONStorage } from 'zustand/middleware'

export const useSettingsStore = create<SettingsStore>()(
  persist(
    set => ({
      theme: 'light',
      language: 'ko',
      setTheme: theme => set({ theme }),
      setLanguage: language => set({ language }),
    }),
    {
      name: 'app-settings',
      storage: createJSONStorage(() => localStorage),
      partialize: state => ({ theme: state.theme, language: state.language }),
    }
  )
)
```

## devtools — 디버깅

```ts
import { devtools } from 'zustand/middleware'

export const useStore = create<StoreState>()(
  devtools(
    set => ({ ... }),
    { name: 'AppStore' }
  )
)
```

## immer — 중첩 상태 업데이트

```ts
import { immer } from 'zustand/middleware/immer'

interface NestedStore {
  user: { profile: { name: string; age: number } }
  updateName: (name: string) => void
}

export const useNestedStore = create<NestedStore>()(
  immer(set => ({
    user: { profile: { name: '', age: 0 } },
    // immer 없이: set(state => ({ user: { ...state.user, profile: { ...state.user.profile, name } } }))
    updateName: name =>
      set(state => { state.user.profile.name = name }),
  }))
)
```

## 스토어 초기화 (SSR / 테스트)

```ts
// 팩토리 패턴으로 인스턴스 분리
const createStore = (initialState?: Partial<StoreState>) =>
  create<StoreState>(set => ({
    count: 0,
    ...initialState,
    increment: () => set(state => ({ count: state.count + 1 })),
  }))
```

## 체크리스트

- [ ] 선택자로 필요한 값만 구독 (불필요한 리렌더링 방지)
- [ ] 여러 값 동시 구독 시 useShallow 사용
- [ ] 큰 스토어는 slice로 분리
- [ ] 서버 상태(API 데이터)는 Zustand에 넣지 말 것 → TanStack Query
- [ ] persist는 민감한 정보 저장 금지
- [ ] devtools는 개발 환경에서만 활성화
