# Project Overview and PDR

## Summary
Evently is a modular monolith for event management and ticketing. It uses NestJS with Clean Architecture layers, strict module boundaries, and an integration pattern based on domain events plus outbox/inbox processing. Long running workflows are orchestrated through Restate.

## Problem Statement
The platform needs a clear separation of concerns for event creation, ticket sales, user management, and authorization while keeping operational complexity low. It must support reliable cross-module communication and strong governance over dependencies.

## Goals
- Provide a clear modular structure with enforced architectural boundaries.
- Support event lifecycle management, ticketing operations, and user management.
- Enable reliable integration between modules using outbox/inbox patterns.
- Offer centralized authorization and policy enforcement.
- Provide observability and operational health checks.

## Non-Goals (Current Scope)
- Microservices decomposition.
- UI or frontend applications.
- Multi-tenant or multi-region deployment.
- External payment provider integrations beyond the current domain model.

## Primary Users
- Event administrators and organizers.
- Ticket buyers and attendees.
- Internal operations and support teams.
- Integrations and workflow operators.

## Functional Requirements
- Manage events, categories, and ticket types.
- Publish and cancel events with domain event handling.
- Manage carts, orders, payments, and tickets.
- Manage users, roles, and permissions.
- Enforce authorization policies via SpiceDB and Keycloak.
- Orchestrate long running workflows (e.g., cancel event workflow).
- Provide health endpoints and diagnostics.

## Non-Functional Requirements
- Layered architecture with explicit dependency rules.
- Clear module boundaries with public API gateways.
- Consistent auditability and reliable messaging via outbox/inbox.
- Observability with OpenTelemetry and Jaeger.
- Maintainable code structure with NestJS CQRS patterns.

## Constraints and Dependencies
- NestJS, TypeORM, and PostgreSQL.
- Redis for caching and job queues.
- RabbitMQ for messaging infrastructure.
- Keycloak for identity and role-based access.
- SpiceDB for policy-based authorization.
- Restate for workflow orchestration.

## Data Ownership
- Separate PostgreSQL schemas per business module: `events`, `users`, `ticketing`.
- Each module owns its schema, migrations, and repository implementations.

## Success Metrics
- Stable module boundaries with no architecture rule violations.
- Successful execution of core flows (event creation, ordering, cancellation).
- Low error rate for integration event processing.
- Healthy service checks and trace visibility in Jaeger.

## Risks
- Configuration drift between local and production environments.
- Eventual consistency across modules during integration event handling.
- Authorization misconfiguration due to external dependencies.
- Workflow reliability if Restate connectivity is unstable.

## Open Questions
- Scope and timeline for Attendance module implementation.
- Future payment provider integration strategy.
- Expansion of workflow orchestration beyond cancellation.
