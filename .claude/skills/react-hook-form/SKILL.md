# React Hook Form + Zod

## 기본 설정

```tsx
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const schema = z.object({
  email: z.string().email('유효한 이메일을 입력하세요'),
  password: z.string().min(8, '비밀번호는 8자 이상이어야 합니다'),
  age: z.number({ coerce: true }).min(14, '14세 이상이어야 합니다'),
})

type FormValues = z.infer<typeof schema>

function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: '', password: '' },
  })

  const onSubmit = async (data: FormValues) => {
    await login(data)
    reset()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('email')} />
      {errors.email && <p>{errors.email.message}</p>}

      <input type="password" {...register('password')} />
      {errors.password && <p>{errors.password.message}</p>}

      <button disabled={isSubmitting}>
        {isSubmitting ? '로그인 중...' : '로그인'}
      </button>
    </form>
  )
}
```

## Controller — UI 라이브러리 연동

```tsx
import { Controller } from 'react-hook-form'
import { Select } from '@/shared/ui'

// register가 안 되는 컴포넌트 (ref 미지원)에 사용
<Controller
  name="category"
  control={control}
  render={({ field, fieldState }) => (
    <Select
      value={field.value}
      onChange={field.onChange}
      error={fieldState.error?.message}
    />
  )}
/>
```

## useFieldArray — 동적 필드

```tsx
import { useFieldArray } from 'react-hook-form'

function TagInput() {
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'tags',
  })

  return (
    <>
      {fields.map((field, index) => (
        <div key={field.id}>
          <input {...register(`tags.${index}.value`)} />
          <button type="button" onClick={() => remove(index)}>삭제</button>
        </div>
      ))}
      <button type="button" onClick={() => append({ value: '' })}>추가</button>
    </>
  )
}
```

## watch / setValue — 연동 필드

```tsx
const { watch, setValue } = useForm<FormValues>()

// 특정 필드 감시
const country = watch('country')

// 조건부 필드 표시
useEffect(() => {
  if (country !== 'KR') setValue('zipCode', '')
}, [country, setValue])
```

## 서버 에러 표시

```tsx
const { setError } = useForm<FormValues>()

const onSubmit = async (data: FormValues) => {
  try {
    await login(data)
  } catch (error) {
    if (error.code === 'INVALID_CREDENTIALS') {
      setError('email', { message: '이메일 또는 비밀번호가 잘못되었습니다' })
    }
    if (error.code === 'SERVER_ERROR') {
      setError('root', { message: '서버 오류가 발생했습니다' })
    }
  }
}

// root 에러 표시
{errors.root && <p className="error">{errors.root.message}</p>}
```

## Zod 스키마 패턴

```ts
// 비밀번호 확인
const schema = z.object({
  password: z.string().min(8),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: '비밀번호가 일치하지 않습니다',
  path: ['confirmPassword'],
})

// 조건부 필드
const schema = z.object({
  hasAddress: z.boolean(),
  address: z.string().optional(),
}).refine(data => !data.hasAddress || !!data.address, {
  message: '주소를 입력하세요',
  path: ['address'],
})

// 숫자 입력 (input은 항상 string 반환)
const schema = z.object({
  price: z.number({ coerce: true }).positive(),
})
```

## 체크리스트

- [ ] 스키마는 Zod로 선언, `z.infer<typeof schema>`로 타입 파생
- [ ] UI 라이브러리 컴포넌트는 Controller 사용
- [ ] 동적 필드는 useFieldArray (index key 사용 금지 → field.id 사용)
- [ ] 서버 에러는 setError로 해당 필드에 표시
- [ ] isSubmitting으로 제출 중 버튼 비활성화
- [ ] reset()으로 제출 성공 후 폼 초기화
