# TripGuard AI — Database Design

> **Status:** Draft skeleton. Schema will be implemented during backend development.

## Overview

PostgreSQL is the primary datastore. Redis is used for caching and job queues (not covered in detail here).

---

## Entity Relationship (conceptual)

```
users ─────────────┬──────────── journeys
                   │                │
                   │                ├── flight_status_snapshots
                   │                └── disruption_events
                   │
                   ├── notification_preferences
                   └── alerts
```

---

## Tables (draft)

### `users`

| Column | Type | Notes |
|--------|------|-------|
| `id` | UUID | Primary key |
| `email` | VARCHAR(255) | Unique, not null |
| `password_hash` | VARCHAR(255) | Not null |
| `full_name` | VARCHAR(255) | |
| `timezone` | VARCHAR(64) | Default `UTC` |
| `created_at` | TIMESTAMPTZ | |
| `updated_at` | TIMESTAMPTZ | |

### `notification_preferences`

| Column | Type | Notes |
|--------|------|-------|
| `id` | UUID | Primary key |
| `user_id` | UUID | FK → `users.id` |
| `email_enabled` | BOOLEAN | Default `true` |
| `sms_enabled` | BOOLEAN | Default `false` |
| `phone_number` | VARCHAR(32) | Required if SMS enabled |
| `alert_on_delay` | BOOLEAN | Default `true` |
| `alert_on_cancellation` | BOOLEAN | Default `true` |
| `delay_threshold_minutes` | INTEGER | Minimum delay before alert |
| `updated_at` | TIMESTAMPTZ | |

### `journeys`

| Column | Type | Notes |
|--------|------|-------|
| `id` | UUID | Primary key |
| `user_id` | UUID | FK → `users.id` |
| `flight_number` | VARCHAR(16) | e.g. `BA123` |
| `departure_airport` | CHAR(3) | IATA code |
| `arrival_airport` | CHAR(3) | IATA code |
| `scheduled_departure` | TIMESTAMPTZ | |
| `scheduled_arrival` | TIMESTAMPTZ | |
| `booking_reference` | VARCHAR(64) | Optional |
| `status` | VARCHAR(32) | `scheduled`, `active`, `completed`, `cancelled` |
| `created_at` | TIMESTAMPTZ | |
| `updated_at` | TIMESTAMPTZ | |

**Indexes:** `(user_id)`, `(flight_number, scheduled_departure)`

### `flight_status_snapshots`

| Column | Type | Notes |
|--------|------|-------|
| `id` | UUID | Primary key |
| `journey_id` | UUID | FK → `journeys.id` |
| `status` | VARCHAR(32) | `on_time`, `delayed`, `cancelled`, `diverted`, etc. |
| `estimated_departure` | TIMESTAMPTZ | |
| `estimated_arrival` | TIMESTAMPTZ | |
| `delay_minutes` | INTEGER | |
| `gate` | VARCHAR(16) | |
| `terminal` | VARCHAR(16) | |
| `raw_payload` | JSONB | Provider response for audit/debug |
| `fetched_at` | TIMESTAMPTZ | |

**Indexes:** `(journey_id, fetched_at DESC)`

### `disruption_events`

| Column | Type | Notes |
|--------|------|-------|
| `id` | UUID | Primary key |
| `journey_id` | UUID | FK → `journeys.id` |
| `event_type` | VARCHAR(32) | `delay`, `cancellation`, `gate_change`, etc. |
| `severity` | VARCHAR(16) | `low`, `medium`, `high` |
| `description` | TEXT | |
| `detected_at` | TIMESTAMPTZ | |
| `resolved_at` | TIMESTAMPTZ | Nullable |

### `alerts`

| Column | Type | Notes |
|--------|------|-------|
| `id` | UUID | Primary key |
| `user_id` | UUID | FK → `users.id` |
| `journey_id` | UUID | FK → `journeys.id` |
| `disruption_event_id` | UUID | FK → `disruption_events.id`, nullable |
| `channel` | VARCHAR(16) | `email`, `sms` |
| `status` | VARCHAR(16) | `pending`, `sent`, `failed` |
| `sent_at` | TIMESTAMPTZ | |
| `read_at` | TIMESTAMPTZ | Nullable |
| `created_at` | TIMESTAMPTZ | |

---

## Data Retention (planned)

| Data | Retention |
|------|-----------|
| Flight status snapshots | 90 days (configurable) |
| Disruption events | 1 year |
| Alerts | 1 year |
| User/journey data | Until account deletion |

---

## Migrations

- Schema changes managed via migration tool (e.g. Alembic, Flyway, or Prisma Migrate — TBD with backend stack).
- All migrations version-controlled under `backend/`.

---

## Related Documents

- [Architecture](./architecture.md)
- [API Contract](./api-contract.md)
