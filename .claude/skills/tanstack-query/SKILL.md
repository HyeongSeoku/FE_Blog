# TanStack Query (React Query)

## 기본 설정

```tsx
// main.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5분
      retry: 1,
    },
  },
})

<QueryClientProvider client={queryClient}>
  <App />
</QueryClientProvider>
```

## Query Keys 관리 — 팩토리 패턴

```ts
// queryKeys.ts — 중앙 관리
export const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  list: (filters: UserFilters) => [...userKeys.lists(), filters] as const,
  details: () => [...userKeys.all, 'detail'] as const,
  detail: (id: string) => [...userKeys.details(), id] as const,
}

// 사용
useQuery({ queryKey: userKeys.detail(userId), queryFn: () => fetchUser(userId) })
queryClient.invalidateQueries({ queryKey: userKeys.lists() })
```

## useQuery

```tsx
function UserProfile({ userId }: { userId: string }) {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: userKeys.detail(userId),
    queryFn: () => fetchUser(userId),
    enabled: !!userId,         // 조건부 실행
    staleTime: 1000 * 60,      // 1분간 fresh
    select: data => data.profile, // 응답 변환
  })

  if (isLoading) return <Skeleton />
  if (isError) return <ErrorMessage error={error} />
  return <div>{data.name}</div>
}
```

## useMutation

```tsx
function CreatePostForm() {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: (data: CreatePostInput) => createPost(data),
    onSuccess: (newPost) => {
      // 관련 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: postKeys.lists() })
      // 또는 캐시에 직접 추가 (네트워크 요청 없음)
      queryClient.setQueryData(postKeys.detail(newPost.id), newPost)
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  return (
    <form onSubmit={e => {
      e.preventDefault()
      mutation.mutate({ title: '...', body: '...' })
    }}>
      <button disabled={mutation.isPending}>
        {mutation.isPending ? '저장 중...' : '저장'}
      </button>
    </form>
  )
}
```

## Optimistic Update

```tsx
const mutation = useMutation({
  mutationFn: (data: UpdateTodoInput) => updateTodo(data),
  onMutate: async (newData) => {
    // 진행 중인 refetch 취소
    await queryClient.cancelQueries({ queryKey: todoKeys.detail(newData.id) })
    // 현재 값 스냅샷
    const previous = queryClient.getQueryData(todoKeys.detail(newData.id))
    // 낙관적 업데이트
    queryClient.setQueryData(todoKeys.detail(newData.id), newData)
    return { previous }
  },
  onError: (_err, _newData, context) => {
    // 실패 시 롤백
    queryClient.setQueryData(todoKeys.detail(_newData.id), context?.previous)
  },
  onSettled: (_data, _err, variables) => {
    queryClient.invalidateQueries({ queryKey: todoKeys.detail(variables.id) })
  },
})
```

## Infinite Query (무한 스크롤)

```tsx
function PostList() {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: postKeys.lists(),
      queryFn: ({ pageParam }) => fetchPosts({ cursor: pageParam }),
      initialPageParam: undefined,
      getNextPageParam: lastPage => lastPage.nextCursor,
    })

  return (
    <>
      {data?.pages.flatMap(page => page.posts).map(post => (
        <PostCard key={post.id} post={post} />
      ))}
      <button
        onClick={() => fetchNextPage()}
        disabled={!hasNextPage || isFetchingNextPage}
      >
        {isFetchingNextPage ? '로딩...' : '더 보기'}
      </button>
    </>
  )
}
```

## Prefetching

```tsx
// 호버 시 미리 로딩
function PostLink({ postId }: { postId: string }) {
  const queryClient = useQueryClient()
  return (
    <Link
      to={`/posts/${postId}`}
      onMouseEnter={() =>
        queryClient.prefetchQuery({
          queryKey: postKeys.detail(postId),
          queryFn: () => fetchPost(postId),
        })
      }
    >
      보기
    </Link>
  )
}
```

## 체크리스트

- [ ] QueryKey는 팩토리 패턴으로 중앙 관리
- [ ] staleTime은 데이터 특성에 맞게 설정 (자주 안 바뀌는 건 길게)
- [ ] mutation 후 관련 쿼리 invalidate 또는 setQueryData
- [ ] enabled 옵션으로 조건부 실행 제어
- [ ] 로딩/에러 상태 항상 처리
- [ ] DevTools 개발 환경에 추가 (`@tanstack/react-query-devtools`)
