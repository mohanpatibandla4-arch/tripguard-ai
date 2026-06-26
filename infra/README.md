# Infrastructure

Local development and deployment configuration for TripGuard AI.

## Docker Compose

Compose file: [`docker-compose.yml`](./docker-compose.yml)

### Start PostgreSQL only

From the repository root:

```powershell
docker compose -f infra/docker-compose.yml up -d postgres
```

### Start PostgreSQL + backend

```powershell
docker compose -f infra/docker-compose.yml up --build
```

### Stop services

```powershell
docker compose -f infra/docker-compose.yml down
```

## Services

| Service    | Container          | Port |
|------------|--------------------|------|
| PostgreSQL | tripguard-postgres | 5432 |
| Backend    | tripguard-backend  | 8080 |
