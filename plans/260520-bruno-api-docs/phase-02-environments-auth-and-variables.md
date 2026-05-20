# Phase 02 - Environments, auth, and variables

## Context Links
- https://docs.usebruno.com/variables/overview
- https://docs.usebruno.com/introduction/quick-start
- ../docs/system-architecture.md

## Overview
- Priority: P2
- Status: Pending
- Goal: Create local environment variables for base URL and auth inputs for JWT-protected endpoints.

## Key Insights
- Environment variables are stored as `<env-name>.bru` files.
- Process environment variables can be referenced via `{{process.env.VAR_NAME}}`.
- Local API base URL is `http://localhost:3000`.
- Protected endpoints use JWT from Keycloak.

## Requirements
- Environment named `local` with `baseURL` set to `http://localhost:3000`.
- Auth tokens must come from process env or a local `.env` file.
- Requests use `{{baseURL}}` for the base URL.

## Architecture
- Use Bruno environment variables for base URL and non-secret values.
- Use process env for secrets (e.g., access tokens) referenced in headers.

## Related Code Files
- Create: /Users/dangcongtoan/Desktop/codes/BE/modular-monolith/docs/bruno/environments/local.bru (created by Bruno)
- Modify: /Users/dangcongtoan/Desktop/codes/BE/modular-monolith/.env (local only; do not commit)
- Modify: /Users/dangcongtoan/Desktop/codes/BE/modular-monolith/.env.example (optional, for placeholders)

## Implementation Steps
1. In Bruno, create a `local` environment for the collection.
2. Add `baseURL` with value `http://localhost:3000`.
3. Define auth variables (e.g., `accessToken`) and map headers to `{{process.env.ACCESS_TOKEN}}`.
4. Update requests to use `{{baseURL}}` and auth variables.

## Todo List
- [ ] Create `local` environment
- [ ] Set `baseURL`
- [ ] Define auth variable strategy (process env vs env variables)
- [ ] Apply variables to existing requests

## Success Criteria
- Environment `local` exists and is selectable.
- Requests resolve `{{baseURL}}` and run against local API.
- No secrets are stored in collection files.

## Risk Assessment
- Risk: Tokens accidentally committed in `.bru` files.
  - Mitigation: Use `{{process.env.*}}` and keep `.env` local.

## Security Considerations
- Do not store secrets in Bruno files.
- Use `.env` and process env for any credentials.

## Next Steps
- Build request suite and tests (Phase 03).
