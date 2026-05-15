---
description: 무엇을 테스트할지 판단 기준, 단위/통합 테스트 구조, mocking 원칙
---

## 무엇을 테스트할까

테스트 가치 = 버그 발생 확률 × 버그 발견 비용

**테스트해야 하는 것:**
- 비즈니스 로직 (조건 분기, 계산, 변환)
- 외부 의존성이 있는 경계 (API 호출, DB)
- 사용자 인터랙션 핵심 흐름

**테스트하지 않아도 되는 것:**
- 단순 렌더링 (스냅샷 테스트 남용 금지)
- 프레임워크/라이브러리 기능 자체
- 구현 세부사항 (내부 상태값, private 메서드)

## 테스트 구조 (AAA)

```ts
it('할인율이 적용된 가격을 반환한다', () => {
  // Arrange
  const price = 10000
  const discountRate = 0.1

  // Act
  const result = applyDiscount(price, discountRate)

  // Assert
  expect(result).toBe(9000)
})
```

## 컴포넌트 테스트

- 구현이 아닌 **동작** 기준으로 테스트
- `getByRole`, `getByLabelText` 등 접근성 쿼리 우선 사용
- `getByTestId`는 최후 수단

```tsx
// ✗ — 구현 테스트
expect(component.state.isOpen).toBe(true)

// ✓ — 동작 테스트
userEvent.click(screen.getByRole('button', { name: '열기' }))
expect(screen.getByRole('dialog')).toBeVisible()
```

## Mocking 원칙

- Mock은 경계에서만 (네트워크, 파일 시스템, 시간)
- 내부 모듈 mock은 피할 것 — 리팩토링 시 테스트 깨짐
- `msw`로 네트워크 레벨 mock 권장

## 비동기 테스트

```ts
// waitFor로 비동기 상태 변화 대기
await waitFor(() => {
  expect(screen.getByText('완료')).toBeInTheDocument()
})
```

## 커버리지

- 수치 목표보다 중요한 코드 커버 여부가 중요
- 100% 커버리지 ≠ 버그 없음
- 커버리지 낮은 영역: 비즈니스 로직 / 에러 처리 경로 우선 확인
