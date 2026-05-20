---
title: "Init Bruno API docs"
description: "Initialize a Bruno collection for this API and generate HTML docs."
status: pending
priority: P2
effort: 8h
issue: null
branch: main
tags: [docs, api, backend, feature]
created: 2026-05-20
---

# Init Bruno API docs

## Overview
Create a Bruno collection in-repo (docs/bruno), add core requests with environments/tests, and enable HTML doc generation plus CLI runs.

## Phases

| # | Phase | Status | Effort | Link |
| --- | --- | --- | --- | --- |
| 1 | Bootstrap collection | Pending | 1.5h | [phase-01](./phase-01-bruno-collection-bootstrap.md) |
| 2 | Environments and auth vars | Pending | 1.5h | [phase-02](./phase-02-environments-auth-and-variables.md) |
| 3 | Requests and tests | Pending | 3h | [phase-03](./phase-03-request-suite-and-tests.md) |
| 4 | Docs and CLI workflow | Pending | 2h | [phase-04](./phase-04-docs-and-cli-workflow.md) |

## Dependencies
- Bruno desktop app (v3.x) and optional CLI (`@usebruno/cli`)
- Running API at `http://localhost:3000` (Swagger at `/api`)
- JWT token for protected endpoints (Keycloak)
- Collection location: docs/bruno
- Collection format: BRU
- Commit generated HTML docs under docs/bruno
