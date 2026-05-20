# Deployment Guide

## Local Development (Docker Compose)
Start infrastructure dependencies:
```bash
docker compose up -d
```

Services included:
- Postgres (5432)
- Redis (6379)
- Keycloak (18080)
- Restate (8080, 9070)
- Jaeger (16686)
- OTEL Collector (4317, 4318)
- RabbitMQ (5672, 15672)
- SpiceDB (28080, 50051)
- SpiceDB Playground (13000)

## Database Setup
Create module schemas:
```sql
CREATE SCHEMA IF NOT EXISTS events;
CREATE SCHEMA IF NOT EXISTS users;
CREATE SCHEMA IF NOT EXISTS ticketing;
```

Run migrations:
```bash
npm run migration:run:all
```

## Application Startup
```bash
npm install
npm run start:dev
```
Swagger UI is available at `http://localhost:3000/api`.

## Configuration Notes
- Restate client requires `RESTATE_URL`.
- Workflow listener requires `RESTATE_LISTENER_PORT`.
- Redis and Keycloak are currently configured with local defaults in `common` module.
  Review [src/modules/common/root.module.ts](src/modules/common/root.module.ts) before production.

## Observability
- OTEL Collector receives traces/logs on ports 4317/4318.
- Jaeger UI: `http://localhost:16686`.

## Production Considerations
- Externalize secrets (Keycloak client secret, Redis password, SpiceDB key).
- Use managed Postgres and Redis where possible.
- Enable TLS for external services (Keycloak, SpiceDB, Restate).
- Configure persistent volumes for Postgres and Redis.
