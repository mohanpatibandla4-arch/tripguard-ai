# TripGuard AI — API Contract

> **Status:** Draft skeleton. Endpoints and schemas will be finalized during backend implementation.

## Conventions

- **Base URL:** `https://api.tripguard.ai/v1` (production) / `http://localhost:8000/v1` (local)
- **Format:** JSON request/response bodies
- **Authentication:** `Authorization: Bearer <token>` on protected routes
- **Errors:** Consistent error envelope (see [Error Responses](#error-responses))

---

## Authentication

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/auth/register` | Create a new user account |
| `POST` | `/auth/login` | Authenticate and receive access token |
| `POST` | `/auth/refresh` | Refresh an expired access token |
| `POST` | `/auth/logout` | Invalidate session/token |

---

## Users

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/users/me` | Get current user profile |
| `PATCH` | `/users/me` | Update profile (name, timezone, etc.) |
| `GET` | `/users/me/preferences` | Get notification preferences |
| `PUT` | `/users/me/preferences` | Update email/SMS alert settings |

---

## Journeys

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/journeys` | List user's flight journeys |
| `POST` | `/journeys` | Add a new journey (flight details) |
| `GET` | `/journeys/{id}` | Get journey details and latest status |
| `PATCH` | `/journeys/{id}` | Update journey metadata |
| `DELETE` | `/journeys/{id}` | Remove a journey |
| `GET` | `/journeys/{id}/status` | Get live/historical flight status |
| `GET` | `/journeys/{id}/events` | List disruption events (delays, cancellations) |

### Journey Create (draft schema)

```json
{
  "flight_number": "BA123",
  "departure_airport": "LHR",
  "arrival_airport": "JFK",
  "departure_date": "2026-07-15",
  "booking_reference": "ABC123"
}
```

---

## Alerts

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/alerts` | List alerts for the current user |
| `GET` | `/alerts/{id}` | Get a single alert record |
| `PATCH` | `/alerts/{id}/read` | Mark alert as read |

---

## Webhooks (internal / future)

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/webhooks/flight-status` | Ingest flight status updates from providers |

---

## Health

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/health` | Liveness check |
| `GET` | `/health/ready` | Readiness check (DB, Redis, dependencies) |

---

## Error Responses

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Human-readable description",
    "details": []
  }
}
```

### Common HTTP Status Codes

| Code | Meaning |
|------|---------|
| `400` | Bad request / validation failure |
| `401` | Unauthorized |
| `403` | Forbidden |
| `404` | Resource not found |
| `409` | Conflict (e.g. duplicate journey) |
| `429` | Rate limited |
| `500` | Internal server error |

---

## Real-Time (planned)

- WebSocket channel: `/ws/journeys` — push status updates and new alerts to connected clients.

---

## Versioning

- URL path versioning (`/v1`).
- Breaking changes require a new major version.
