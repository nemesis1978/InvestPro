# InvestPro – Memory Bank (single source of truth)

> Aggiorna SEMPRE questa sezione quando prendi una decisione irreversibile o completi un passo chiave.

## 1. Branch naming
- `feature/<slug>` nuove funzionalità
- `fix/<slug>` bugfix
- `chore/<slug>` manutenzione

## 2. Environment variables (.env.local)
| Key | Descrizione | Valore esempio |
|-----|-------------|----------------|
| NEXT_PUBLIC_API_URL | Endpoint REST | https://api.investpro.dev |
| NEXT_PUBLIC_SENTRY_DSN | error tracking | https://xxx@sentry.io/abc |
| NEXTAUTH_URL | callback auth | https://app.investpro.dev |

## 3. Paths & Aliases
- `@/components/*`
- `@/lib/api.ts`

## 4. Testing conventions
- file.test.tsx → unit
- folder/__e2e__ → Cypress spec

## 5. Last Step