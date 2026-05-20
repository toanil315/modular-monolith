# Codebase Summary

## Overview
This repository contains a NestJS modular monolith structured around Clean Architecture and strict module boundaries. Each module follows a layered directory layout and exposes cross-module dependencies only through `public` APIs.

## Key Entry Points
- App bootstrap: [src/main.ts](src/main.ts)
- Root module wiring: [src/app.module.ts](src/app.module.ts)

## Module Layout
Each module uses the following layers:
- `presentation/` - Controllers, DTOs, request/response mapping.
- `application/` - CQRS commands/queries, use cases, application services.
- `domain/` - Entities, value objects, domain events.
- `infrastructure/` - TypeORM entities, repositories, external adapters.
- `integration/` - Integration event handlers and publishers.
- `public/` - Explicit cross-module API surface.

## Modules
- **common**: Cross-cutting infrastructure (database, caching, event bus, tracing, exceptions, health checks, workflow client).
- **authz**: SpiceDB integration, schema loading, policy service.
- **events**: Event lifecycle, categories, ticket types, event publication.
- **ticketing**: Carts, orders, payments, tickets, inventory.
- **users**: User registration, roles/permissions, identity integration.
- **workflows**: Restate-based workflows (cancel event workflow).
- **attendance**: Scaffold only (empty placeholders).

## Architecture Rules
- Clean Architecture layer rules are enforced via ESLint.
- Cross-module imports are only allowed through `public` APIs.
- Ticketing may import from `events/public` and `users/public`. Other modules are isolated.

## Integration Patterns
- CQRS via `@nestjs/cqrs` for application use cases.
- Domain events raised from aggregates.
- Outbox/inbox patterns for reliable integration events.
- BullMQ for async job processing.
- Restate workflows for long running orchestration.

## Runtime Dependencies
- PostgreSQL with per-module schemas and migrations.
- Redis for caching and BullMQ queues.
- RabbitMQ for messaging infrastructure.
- Keycloak for identity.
- SpiceDB for authorization.
- Restate for workflows.
- OpenTelemetry + Jaeger for observability.

## LOC by Directory (File Count with Content)
- `src/modules/events`: application/domain/infrastructure/presentation split with extensive handlers and DTOs.
- `src/modules/ticketing`: cart, order, payment, ticket handling with integrations.
- `src/modules/users`: user management, identity integration, outbox.
- `src/modules/common`: shared infra and global module setup.
- `src/modules/workflows`: Restate workflow implementation.

(See detailed counts in the init workflow output for exact directory counts.)
