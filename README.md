# Evently Modular Monolith

Evently is a NestJS modular monolith for event management and ticketing. It follows Clean Architecture, enforces strict module boundaries, and uses CQRS with domain events plus outbox/inbox patterns for reliable integrations.

## Architecture Highlights
- Layered modules: presentation, application, domain, integration, infrastructure, public.
- Cross-module access only through `public` APIs.
- CQRS handlers with domain events and async processing.
- Restate workflows for long running orchestration.

## Modules
- events: event lifecycle, categories, ticket types.
- ticketing: carts, orders, payments, tickets.
- users: registration, roles, permissions.
- workflows: Restate workflows (cancel event).
- authz: SpiceDB policy engine.
- common: shared infra (db, cache, tracing, health, exceptions).
- attendance: scaffold only (empty).

## Local Development
### Prerequisites
- Node.js (LTS) and npm
- Docker Desktop

### Start dependencies
```bash
docker compose up -d
```

### Create schemas
```sql
CREATE SCHEMA IF NOT EXISTS events;
CREATE SCHEMA IF NOT EXISTS users;
CREATE SCHEMA IF NOT EXISTS ticketing;
```

### Run migrations
```bash
npm run migration:run:all
```

### Start the API
```bash
npm install
npm run start:dev
```
Swagger UI: http://localhost:3000/api

### Useful local ports
- Keycloak: http://localhost:18080
- Restate: http://localhost:8080 (admin http://localhost:9070)
- Jaeger UI: http://localhost:16686
- RabbitMQ UI: http://localhost:15672
- SpiceDB Playground: http://localhost:13000

## Common Scripts
- `npm run build`
- `npm run lint`
- `npm run test` / `npm run test:e2e`

## API Requests (Bruno)
The API request collection lives in [docs/bruno](docs/bruno) with environment config in
[docs/bruno/environments/local.bru](docs/bruno/environments/local.bru).

- Requests use `baseURL` and `accessToken` variables.
- `accessToken` is populated from `process.env.ACCESS_TOKEN`. Export `ACCESS_TOKEN` before running.
- Open the collection in the Bruno app, or run it via CLI:

```sh
cd docs/bruno
bru run . --env local
```

## Documentation
- [docs/project-overview-pdr.md](docs/project-overview-pdr.md)
- [docs/codebase-summary.md](docs/codebase-summary.md)
- [docs/code-standards.md](docs/code-standards.md)
- [docs/system-architecture.md](docs/system-architecture.md)
- [docs/project-roadmap.md](docs/project-roadmap.md)
- [docs/deployment-guide.md](docs/deployment-guide.md)
- [docs/design-guidelines.md](docs/design-guidelines.md)
