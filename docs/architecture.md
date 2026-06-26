# TripGuard AI — Architecture

## Overview

TripGuard AI is a full-stack travel disruption assistant. Users register flight journeys, receive live status updates, and get notified when delays or cancellations occur. The system is designed to scale from an MVP (tracking + alerts) toward refund, expense, and claim assistance.

## High-Level Diagram

```
┌─────────────┐     HTTPS      ┌─────────────┐     REST/WS     ┌─────────────┐
│   Browser   │ ◄────────────► │   Frontend  │ ◄─────────────► │   Backend   │
│  (React)    │                │  (Next.js)  │                 │  (API)      │
└─────────────┘                └─────────────┘                 └──────┬──────┘
                                                                      │
                    ┌─────────────────────────────────────────────────┼─────────────────────────────────────────────────┐
                    │                                                 │                                                 │
                    ▼                                                 ▼                                                 ▼
            ┌─────────────┐                                   ┌─────────────┐                                   ┌─────────────┐
            │  PostgreSQL │                                   │    Redis    │                                   │  External   │
            │  (primary)  │                                   │  (cache /   │                                   │  flight &   │
            │             │                                   │   queues)   │                                   │  notify APIs│
            └─────────────┘                                   └─────────────┘                                   └─────────────┘
```

## Components

### Frontend

- Web application for journey management, live status, and alert preferences.
- Communicates with the backend via REST (and optionally WebSockets for real-time updates).

### Backend

- REST API for users, journeys, flight status, and notifications.
- Background workers for polling flight data, detecting disruptions, and dispatching alerts.
- Authentication and authorization for user-scoped data.

### Data Layer

- **PostgreSQL** — users, journeys, flight snapshots, alert history, notification preferences.
- **Redis** — caching flight status, rate limiting, job queues for alert dispatch.

### External Integrations

- Flight status providers (e.g. aviation data APIs).
- Email provider (e.g. SendGrid, SES).
- SMS provider (e.g. Twilio).

### Infrastructure

- Containerized services (`infra/`) for local development and cloud deployment.
- CI/CD pipelines for build, test, and deploy.

## Cross-Cutting Concerns

| Concern        | Approach                                      |
|----------------|-----------------------------------------------|
| Authentication | JWT or session-based auth; secure token storage |
| Observability  | Structured logging, metrics, health endpoints |
| Security       | HTTPS, input validation, secrets via env vars |
| Scalability    | Stateless API, horizontal scaling, async jobs |

## Deployment Topology (Target)

- Frontend: static/SSR hosting (e.g. Vercel, CloudFront + S3).
- Backend API: container orchestration (e.g. ECS, Kubernetes).
- Workers: separate process/service for background jobs.
- Managed PostgreSQL and Redis in production.

## Related Documents

- [API Contract](./api-contract.md)
- [Database Design](./database-design.md)
- [Roadmap](./roadmap.md)
