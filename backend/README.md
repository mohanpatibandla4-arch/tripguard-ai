# TripGuard AI — Backend

Spring Boot 3 backend for TripGuard AI: user auth, travel bookings, mock flight status tracking, and mock email/SMS notifications.

## Stack

- Java 21
- Spring Boot 3.2
- Maven
- PostgreSQL
- Spring Web, Data JPA, Security, Validation, Actuator
- JWT authentication
- Lombok
- SpringDoc OpenAPI (Swagger)
- Docker

## Project structure

```
src/main/java/com/tripguard/
├── auth/           # JWT, security config, login/register
├── user/           # User entity and service
├── booking/        # Travel booking CRUD
├── flightstatus/   # Mock flight provider, status events
├── notification/   # Mock email/SMS, notification attempts
├── finance/        # Finance records (placeholder for Phase 3)
├── audit/          # Audit logging
└── common/         # Enums, exceptions, shared config
```

## Prerequisites

- Java 21+
- Maven 3.9+
- Docker & Docker Compose (for containerized run)

## Run with Docker Compose (recommended)

From the **project root** (`tripguard-ai/`):

```bash
docker compose -f infra/docker-compose.yml up --build
```

Services:

| Service     | URL                                      |
| ----------- | ---------------------------------------- |
| Backend API | http://localhost:8080/v1                 |
| Swagger UI  | http://localhost:8080/v1/swagger-ui.html |
| PostgreSQL  | localhost:5432                           |

## Run locally (without Docker)

1. Start PostgreSQL and create database `tripguard` with user/password `tripguard`.

2. From `backend/`:

```bash
mvn spring-boot:run
```

Environment variables (optional):

```bash
export DATABASE_URL=jdbc:postgresql://localhost:5432/tripguard
export DATABASE_USERNAME=tripguard
export DATABASE_PASSWORD=tripguard
export JWT_SECRET=tripguard-dev-secret-key-change-in-production-min-32-chars
```

## Build & test

```bash
cd backend
mvn clean package
mvn test
```

## API overview

| Method | Path                                     | Auth | Description                |
| ------ | ---------------------------------------- | ---- | -------------------------- |
| POST   | `/v1/auth/register`                      | No   | Register user              |
| POST   | `/v1/auth/login`                         | No   | Login, get JWT             |
| POST   | `/v1/bookings`                           | Yes  | Create booking             |
| GET    | `/v1/bookings`                           | Yes  | List my bookings           |
| POST   | `/v1/bookings/{id}/flight-status/track`  | Yes  | Track status (mock)        |
| GET    | `/v1/bookings/{id}/flight-status/events` | Yes  | List status events         |
| GET    | `/v1/notifications`                      | Yes  | List notification attempts |

## Sample curl commands

### Register

```bash
curl -s -X POST http://localhost:8080/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "traveler@example.com",
    "password": "password123",
    "fullName": "Alex Traveler",
    "phoneNumber": "+15551234567"
  }'
```

### Login

```bash
curl -s -X POST http://localhost:8080/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "traveler@example.com",
    "password": "password123"
  }'
```

Save the `accessToken` from the response as `TOKEN`.

### Create booking

```bash
curl -s -X POST http://localhost:8080/v1/bookings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "flightNumber": "BA100",
    "departureAirport": "LHR",
    "arrivalAirport": "JFK",
    "scheduledDeparture": "2026-07-15T10:00:00Z",
    "scheduledArrival": "2026-07-15T18:00:00Z",
    "bookingReference": "REF001",
    "journeyType": "FLIGHT"
  }'
```

Save the booking `id` as `BOOKING_ID`.

### Track flight status (mock)

Flights ending in `9` simulate **cancelled**; others may be **delayed** or **on time**.

```bash
curl -s -X POST http://localhost:8080/v1/bookings/$BOOKING_ID/flight-status/track \
  -H "Authorization: Bearer $TOKEN"
```

### Get status events

```bash
curl -s http://localhost:8080/v1/bookings/$BOOKING_ID/flight-status/events \
  -H "Authorization: Bearer $TOKEN"
```

### List notification attempts

```bash
curl -s http://localhost:8080/v1/notifications \
  -H "Authorization: Bearer $TOKEN"
```

### Health check

```bash
curl -s http://localhost:8080/v1/actuator/health
```

## Mock behavior

- **Flight status:** `MockFlightStatusProvider` returns `CANCELLED` for flight numbers ending in `9`, `DELAYED` for some hash matches, otherwise `ON_TIME`.
- **Notifications:** `MockNotificationProvider` logs email/SMS to the application log and records attempts in the database.

## Configuration

See `src/main/resources/application.yml` for defaults. Override via environment variables in Docker Compose or your shell.
