# InvestPro – Product Requirements Document (PRD)

## 1. Vision
InvestPro aiuta investitori retail e consulenti finanziari a monitorare, analizzare e ottimizzare i propri portafogli multi‑asset attraverso insight data‑driven e strumenti di automazione.

## 2. Objectives & Success Metrics
- **Time‑to‑Insight < 5 secondi** per caricamento dashboard.
- **Retention mensile > 60 %** degli utenti gratuiti entro Q4 2025.
- **Conversione free‑→‑pro ≥ 8 %**.

## 3. Personas
| Persona | Pain point | Fattore wow |
|---------|------------|-------------|
| Marco, 32 a, Retail investor | Fatica a seguire i mercati e bilanciare rischio/rendimento | Alert intelligenti e simulazioni “what‑if” |
| Laura, 45 a, Consulente indipendente | Troppi tool separati, costi elevati | Un unico hub con reporting PDF brandizzato |

## 4. Core User Stories (MVP)
1. **Import portafoglio** da broker (CSV / API) per vedere asset allocation.
2. **Dashboard rendimento vs benchmark** con grafici interattivi.
3. **Alert personalizzati** (es. drawdown > 10 %, takeover news).
4. **Simulatore “what‑if”** per ribilanciamento.
5. **Report PDF** scaricabile e inviabile al cliente.

## 5. Non‑Functional Requirements
- PWA responsiva (mobile‑first).
- Autenticazione OAuth 2.0 + 2FA (TOTP).
- Copertura test > 90 %.
- ISO 27001‑aligned security.

## 6. Release Plan
| Versione | Scope | Target | Deadline |
|----------|-------|--------|----------|
| v1.1 | Dashboard + import + alert | Internal beta | 31 lug 2025 |
| v1.2 | Simulator + PDF report | Public beta | 30 set 2025 |
| v1.3 | Pro features + mobile app wrapper | GA | 30 nov 2025 |

## 7. Open Questions
- Pricing tier finale? (free, pro, advisor)
- Partnerships con broker EU ↔ API?