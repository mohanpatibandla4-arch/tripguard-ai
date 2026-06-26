# TripGuard AI — Roadmap

## Vision

Help travelers stay ahead of flight disruptions with real-time tracking, proactive alerts, and eventually automated assistance for refunds, expenses, and insurance claims.

---

## Phase 1 — MVP (Foundation)

**Goal:** Users can add journeys, see live status, and receive delay/cancellation alerts.

| Item | Description | Status |
|------|-------------|--------|
| Project scaffolding | Monorepo structure, docs, infra skeleton | In progress |
| User auth | Register, login, profile | Planned |
| Journey CRUD | Add/edit/delete flight journeys | Planned |
| Flight status integration | Connect to a flight data API | Planned |
| Status polling worker | Background job to fetch and store status | Planned |
| Disruption detection | Detect delays and cancellations | Planned |
| Email alerts | Send email on disruption events | Planned |
| Basic frontend | Dashboard, journey list, add journey form | Planned |
| Local dev environment | Docker Compose for API, DB, Redis | Planned |

**MVP success criteria:**
- User adds a flight and sees current status within 5 minutes.
- User receives an email when a flight is delayed beyond a configurable threshold or cancelled.

---

## Phase 2 — Enhanced Alerts & Real-Time

| Item | Description |
|------|-------------|
| SMS alerts | Twilio (or similar) integration |
| WebSocket updates | Push status changes to the UI without refresh |
| Alert preferences | Per-user thresholds, quiet hours, channel selection |
| Gate/terminal change alerts | Notify on gate or terminal changes |
| Mobile-responsive UI | Polished experience on phones |

---

## Phase 3 — Intelligence & Assistance

| Item | Description |
|------|-------------|
| Multi-leg journeys | Connect connecting flights |
| Smart rebooking suggestions | Surface alternative flights (API-dependent) |
| Expense tracking | Log costs tied to disruptions |
| Refund eligibility hints | Rules-based guidance on refund rights |
| Claim document generation | Export disruption evidence for insurance |

---

## Phase 4 — Scale & Production Hardening

| Item | Description |
|------|-------------|
| Production deployment | Cloud infra, CI/CD, monitoring |
| Rate limiting & abuse prevention | API gateway, per-user limits |
| Observability | Dashboards, alerting on system health |
| Multi-region support | Timezone-aware scheduling |
| Admin tooling | Support dashboard for ops |

---

## Tech Decisions (TBD)

These will be finalized before backend/frontend implementation:

- Backend language/framework
- Frontend framework (likely React/Next.js)
- Flight data provider
- Email/SMS providers
- Hosting platform

---

## Related Documents

- [Architecture](./architecture.md)
- [API Contract](./api-contract.md)
- [Database Design](./database-design.md)
