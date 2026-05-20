# Code Standards

## Architecture and Boundaries
- Follow Clean Architecture layers: `presentation`, `application`, `domain`, `integration`, `infrastructure`, `public`.
- `domain` must not import from any other layer.
- `application` may import only from `domain`.
- `presentation` may import from `application` and `domain`.
- `integration` may import from `application` and `domain`.
- `infrastructure` may import from any layer.
- `public` may import from `application`, `domain`, and `integration`.

## Module Boundaries
- Cross-module access is only allowed via `public` APIs.
- `ticketing` may import from `events/public` and `users/public` only.
- Direct imports from other modules' internal layers are forbidden.

## Layer Responsibilities
- **presentation**: Controllers, request/response DTOs, validation setup.
- **application**: CQRS command/query handlers, use cases, orchestration logic.
- **domain**: Entities, value objects, domain events, business rules.
- **infrastructure**: Repositories, TypeORM entities, messaging adapters.
- **integration**: Integration event handlers and publishers.
- **public**: Tokens and interfaces exposed to other modules.

## CQRS and Domain Events
- Use `@CommandHandler`, `@QueryHandler`, and `@EventsHandler` in `application/`.
- Raise domain events in aggregates (see common `Entity` base).
- Persist domain events using outbox entities and processors.

## DTO and Validation
- Place request/response DTOs under `presentation/**/dtos`.
- Use `nestjs-zod` for schema validation where applicable.
- Global validation uses `RequestValidationPipe` from `common` module.

## Infrastructure and Data Access
- TypeORM entities live in `infrastructure/**/database` or module-specific infrastructure folders.
- Migrations are per module under `infrastructure/database/migrations`.
- Use repository implementations in `infrastructure/**` and interfaces in `domain` or `application`.

## Configuration
- Use `ConfigService` for environment access.
- Keep runtime dependencies (DB, Redis, Restate) configurable.

## Testing
- Unit tests live alongside code as `*.spec.ts` when added.
- E2E tests live under `test/` and use `test/jest-e2e.json`.

## Linting
- Run `npm run lint` and keep ESLint architecture rules clean.
- Avoid disabling architecture rules unless a change is approved and documented.
