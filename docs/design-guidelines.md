# Design Guidelines

## API Design
- Keep controller routes scoped to module responsibilities.
- Use DTOs for request and response payloads.
- Prefer explicit command/query endpoints over generic actions.

## Domain Modeling
- Keep business rules in `domain` entities and value objects.
- Raise domain events from aggregates when state changes.
- Avoid infrastructure concerns in `domain` and `application` layers.

## Integration Design
- Use integration events for cross-module communication.
- Persist integration events via outbox, process via inbox.
- Keep `public` APIs small and intention revealing.

## Error Handling
- Use domain errors for business failures.
- Map domain errors to HTTP responses in `presentation` layer.
- Use global exception filters for cross-cutting error handling.

## Workflow Design
- Model long-running workflows explicitly in `workflows/`.
- Use Restate context runs for durable steps.
- Keep workflow inputs minimal and validated.
