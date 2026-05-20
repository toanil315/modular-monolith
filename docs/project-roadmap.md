# Project Roadmap

## Current State
- Core modules implemented: events, ticketing, users, workflows, authz, common.
- Clean Architecture rules enforced via ESLint.
- Outbox/inbox patterns in place for reliable integration.
- Observability pipeline configured with OTEL + Jaeger.

## Next Steps (Suggested)
### Phase 1 - Stabilize Core Flows
- Add coverage for event creation, publishing, and cancellation.
- Add coverage for order creation and ticket issuance.
- Validate authorization policies and public API boundaries.

### Phase 2 - Expand Domain Coverage
- Implement Attendance module domain and use cases.
- Add additional workflow types (refunds, reschedules).
- Improve integration event schemas and versioning.

### Phase 3 - Operational Hardening
- Externalize configuration for prod deployment.
- Add monitoring dashboards and alerting.
- Load testing and performance tuning on queues and DB.

## Open Items
- Payment provider integration strategy.
- Multi-tenant or multi-region requirements.
- Workflow retries and compensation policies.
