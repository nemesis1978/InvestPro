# InvestPro – TODO Backlog (v1.1‑v1.3)

## 🔥 P0 – Must‑have (v1.1)
- [ ] **CI/CD**: GitHub Actions – lint, test, build, deploy to staging.
- [ ] **Testing**: port coverage dal 55 %→90 % (Jest + React Testing Library) & Cypress e2e smoke flow.
- [ ] **Import CSV**: parser resiliente + mapping asset class.
- [ ] **Dashboard core**: rendimenti, pie allocation, line chart equity curve.
- [ ] **Alert service**: cron job + web push/ email.

## 🥈 P1 – Should‑have (v1.2)
- [ ] Simulator “what‑if” UI (slider allocation) + calcolo impatti.
- [ ] Export PDF (react‑pdf) con branding.
- [ ] i18n EN/IT + date locale.

## 🥉 P2 – Nice‑to‑have (v1.3)
- [ ] App mobile (Capacitor) push notifications native.
- [ ] AI insights generativi (LLM via OpenAI API).
- [ ] Multi‑broker live sync (Plaid / Tink connectors).

## DevOps/Infra
- [ ] Docker multi‑stage build.
- [ ] Helm chart k8s staging & prod.
- [ ] SonarCloud quality gate (< 3.0 bugs/security hotspots).

## Documentation
- [ ] Contributing.md aggiornato.
- [ ] ADR (Architecture Decision Records).

## QA Definition of Done
- PR approvato (≥ 1 reviewer).
- CI verde.
- Issue link + changelog entry.