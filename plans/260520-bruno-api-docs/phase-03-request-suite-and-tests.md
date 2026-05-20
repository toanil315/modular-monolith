# Phase 03 - Request suite and tests

## Context Links
- https://docs.usebruno.com/introduction/quick-start
- https://docs.usebruno.com/variables/overview
- ../docs/codebase-summary.md
- ../docs/system-architecture.md
- ../src/modules/**/presentation/**/*.controller.ts

## Overview
- Priority: P2
- Status: Pending
- Goal: Create a structured set of Bruno requests with basic tests for core modules.

## Key Insights
- Swagger UI at `/api` can be used to enumerate endpoints.
- Bruno supports request-level tests and assertions.
- Consistent naming helps navigation and doc generation.

## Requirements
- Create folder structure by module (events, ticketing, users, common/health).
- Request names use numeric prefixes for ordering (e.g., `01-events-list`).
- Add basic tests per request: status code and minimal response shape.
- Ensure auth headers use process env JWT tokens for protected endpoints.

## Architecture
- Collection structure mirrors module boundaries for clarity.
- Each request contains URL, method, headers, body (if applicable), and tests.

## Related Code Files
- Create: /Users/dangcongtoan/Desktop/codes/BE/modular-monolith/docs/bruno/requests/**
- Create: /Users/dangcongtoan/Desktop/codes/BE/modular-monolith/docs/bruno/requests/**.bru

## Implementation Steps
1. Identify a minimal set of endpoints per module from Swagger UI, including protected endpoints that require JWT.
2. Create folders for each module and add initial requests.
3. For each request, set method, URL, headers, and sample body where required.
4. Add assertions for status code and key fields.
5. Validate requests in Bruno using `local` environment.

## Todo List
- [ ] Select endpoints per module
- [ ] Create folder structure
- [ ] Add requests and request bodies
- [ ] Add tests and assertions
- [ ] Run collection to verify passes

## Success Criteria
- All core endpoints have Bruno requests.
- Requests run against local API with correct responses.
- Tests pass for each request.

## Risk Assessment
- Risk: Example payloads become stale vs API changes.
  - Mitigation: Keep payloads minimal and rely on Swagger for updates.

## Security Considerations
- Avoid hardcoding credentials or tokens in requests.
- Validate that auth headers reference process env variables.

## Next Steps
- Generate docs and set up CLI workflow (Phase 04).
