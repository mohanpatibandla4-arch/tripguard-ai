# TripGuard AI

**Real-time travel disruption assistant for flight bookings, status tracking, and proactive alerts.**

TripGuard AI helps travelers register upcoming flights, check live status, detect delays or cancellations, and review notification delivery — with a roadmap toward refund and claim support.

---

## Problem

Travelers often discover delays, gate changes, and cancellations too late. Status is spread across airline apps, airport screens, and inbox clutter. TripGuard AI centralizes journey tracking and records disruption events in one place.

## Use case

A passenger books **AI 109 (HYD → DEL)**. They add the trip to TripGuard AI, run a status check before leaving for the airport, and receive recorded email/SMS alert attempts if the flight is disrupted.

---

## Features

| Area | Capability |
|------|------------|
| Accounts | Register, login, JWT-based sessions |
| Bookings | Create and list personal flight bookings |
| Status | Mock flight status provider with persisted events |
| Alerts | Mock email/SMS notification attempts on disruption |
| API docs | Swagger UI at `/v1/swagger-ui.html` |
| Web UI | React dashboard for the full demo flow |

---

## Tech stack

| Layer | Technologies |
|-------|----------------|
| Backend | Java 17, Spring Boot 3, Maven, Spring Security, JWT, JPA |
| Frontend | React 18, TypeScript, Vite, Tailwind CSS, React Router, Axios |
| Database | PostgreSQL 16 |
| Tooling | Docker Compose, GitHub Actions, SpringDoc OpenAPI |

---

## Repository layout

```
tripguard-ai/
├── backend/          # Spring Boot REST API
├── frontend/         # React web application
├── docs/             # Architecture, API, database, roadmap
├── infra/            # Docker Compose and deployment notes
└── .github/workflows # CI pipelines
```

---

## Architecture

### Backend

Layered modules under `com.tripguard`: `auth`, `user`, `booking`, `flightstatus`, `notification`, `audit`, `finance`, `common`.

```
Client → REST API → Service → Repository → PostgreSQL
                      ↓
              Mock status / notification providers
```

### Frontend

```
Pages → API clients (Axios) → Backend /v1
         ↑
    Auth context (JWT in localStorage)
```

Vite dev server proxies `/v1` to `http://localhost:8080` — no CORS changes required locally.

### Database

PostgreSQL stores users, bookings, flight status events, notification attempts, and audit logs. See [docs/database-design.md](./docs/database-design.md).

---

## Local setup

### Prerequisites

- Docker Desktop
- Java 17+ and Maven (or use the backend Docker service)
- Node.js 20+

### 1. Start PostgreSQL

```powershell
cd C:\Users\DELL\Projects\tripguard-ai
docker compose -f infra/docker-compose.yml up -d postgres
docker ps
```

### 2. Start backend

```powershell
cd backend
mvn spring-boot:run
```

Verify:

- Health: http://localhost:8080/v1/actuator/health
- Swagger: http://localhost:8080/v1/swagger-ui.html

### 3. Start frontend

```powershell
cd frontend
npm install
npm run dev
```

Open http://localhost:5173

---

## Demo flow

1. **Register** a new account (include phone number for SMS attempts).
2. **Login** — JWT is stored in the browser.
3. **New booking** — e.g. Airline `AI`, Flight `109`, Origin `HYD`, Destination `DEL`.
4. Open the booking and click **Track flight status**.
5. Review **status events** and **notification attempts** on the detail page.

**Mock rules:** flight numbers ending in `9` return `CANCELLED`; others may be `DELAYED` or `ON_TIME`.

---

## API summary

| Method | Endpoint | Auth |
|--------|----------|------|
| POST | `/v1/auth/register` | No |
| POST | `/v1/auth/login` | No |
| POST | `/v1/bookings` | Yes |
| GET | `/v1/bookings` | Yes |
| POST | `/v1/bookings/{id}/flight-status/track` | Yes |
| GET | `/v1/bookings/{id}/flight-status/events` | Yes |
| GET | `/v1/notifications` | Yes |

Full contract: [docs/api-contract.md](./docs/api-contract.md)

---

## Continuous integration

| Workflow | Trigger | Command |
|----------|---------|---------|
| [Backend CI](./.github/workflows/backend-ci.yml) | push / PR to `main` | `mvn clean test` in `backend/` |
| [Frontend CI](./.github/workflows/frontend-ci.yml) | push / PR to `main` | `npm ci` + `npm run build` in `frontend/` |

Status: GitHub → **Actions** tab.

---

## Documentation

| Document | Description |
|----------|-------------|
| [Architecture](./docs/architecture.md) | System design |
| [API contract](./docs/api-contract.md) | REST endpoints |
| [Database design](./docs/database-design.md) | Schema overview |
| [Roadmap](./docs/roadmap.md) | Delivery phases |
| [Backend README](./backend/README.md) | API runbook |
| [Frontend README](./frontend/README.md) | UI runbook |
| [Infra README](./infra/README.md) | Docker Compose |

---

## Screenshots

<!-- Add screenshots after local demo -->
| Screen | Path |
|--------|------|
| Dashboard | `docs/screenshots/dashboard.png` |
| Booking details | `docs/screenshots/booking-details.png` |
| Swagger UI | `docs/screenshots/swagger.png` |

---

## Roadmap

- Real flight data provider integration
- Production email/SMS (SendGrid, Twilio)
- Refund and expense workflows
- Frontend deployment (Vercel / S3)

---

## License

TBD
