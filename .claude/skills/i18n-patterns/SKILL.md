# i18n Patterns (react-i18next)

## 설정

```ts
// src/i18n/index.ts
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import ko from './locales/ko.json'
import en from './locales/en.json'

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: { ko: { translation: ko }, en: { translation: en } },
    fallbackLng: 'ko',
    interpolation: { escapeValue: false },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  })

export default i18n

// main.tsx
import './i18n'
```

## 번역 파일 구조

```json
// locales/ko.json
{
  "common": {
    "save": "저장",
    "cancel": "취소",
    "confirm": "확인",
    "loading": "로딩 중..."
  },
  "auth": {
    "login": "로그인",
    "logout": "로그아웃",
    "email": "이메일",
    "password": "비밀번호",
    "error": {
      "invalidCredentials": "이메일 또는 비밀번호가 잘못되었습니다"
    }
  },
  "user": {
    "greeting": "안녕하세요, {{name}}님",
    "itemCount": "{{count}}개 항목",
    "itemCount_plural": "{{count}}개 항목"
  }
}
```

## 컴포넌트에서 사용

```tsx
import { useTranslation } from 'react-i18next'

function LoginForm() {
  const { t } = useTranslation()

  return (
    <form>
      <label>{t('auth.email')}</label>
      <input placeholder={t('auth.email')} />

      {/* 변수 보간 */}
      <p>{t('user.greeting', { name: user.name })}</p>

      {/* 복수형 */}
      <span>{t('user.itemCount', { count: items.length })}</span>

      <button>{t('common.save')}</button>
    </form>
  )
}
```

## Trans 컴포넌트 — JSX 포함 번역

```tsx
import { Trans } from 'react-i18next'

// locales/ko.json
// "agreement": "계속하면 <terms>이용약관</terms>과 <privacy>개인정보처리방침</privacy>에 동의합니다"

<Trans
  i18nKey="agreement"
  components={{
    terms: <a href="/terms" className="underline" />,
    privacy: <a href="/privacy" className="underline" />,
  }}
/>
```

## 언어 전환

```tsx
function LanguageSwitcher() {
  const { i18n } = useTranslation()

  return (
    <select
      value={i18n.language}
      onChange={e => i18n.changeLanguage(e.target.value)}
    >
      <option value="ko">한국어</option>
      <option value="en">English</option>
    </select>
  )
}
```

## 날짜 / 숫자 / 통화 포맷

```tsx
// Intl API 활용
function formatDate(date: Date, locale: string) {
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric', month: 'long', day: 'numeric',
  }).format(date)
}

function formatCurrency(amount: number, locale: string, currency: string) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
  }).format(amount)
}

function formatRelativeTime(date: Date, locale: string) {
  const diff = Math.floor((date.getTime() - Date.now()) / 1000)
  return new Intl.RelativeTimeFormat(locale, { numeric: 'auto' }).format(
    diff < 60 ? diff : diff < 3600 ? Math.floor(diff / 60) : Math.floor(diff / 3600),
    diff < 60 ? 'second' : diff < 3600 ? 'minute' : 'hour'
  )
}
```

## 지연 로딩 (큰 프로젝트)

```ts
import HttpBackend from 'i18next-http-backend'

i18n.use(HttpBackend).init({
  backend: { loadPath: '/locales/{{lng}}/{{ns}}.json' },
  ns: ['common', 'auth', 'dashboard'],
  defaultNS: 'common',
})

// 컴포넌트에서 네임스페이스 지정
const { t } = useTranslation('dashboard')
```

## 체크리스트

- [ ] 하드코딩된 문자열 없음 — 모두 t() 함수 사용
- [ ] 번역 키는 도메인별로 네임스페이스 분리
- [ ] 복수형은 _plural 접미사로 처리
- [ ] JSX 포함 번역은 Trans 컴포넌트 사용
- [ ] 날짜/숫자/통화는 Intl API 활용
- [ ] fallbackLng 설정으로 미번역 키 대비
