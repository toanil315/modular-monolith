# Phase 04 - Docs generation and CLI workflow

## Context Links
- https://docs.usebruno.com/api-docs/overview
- https://docs.usebruno.com/introduction/quick-start
- https://docs.usebruno.com/bru-cli/overview

## Overview
- Priority: P2
- Status: Pending
- Goal: Enable HTML doc generation and optional CLI runs for the Bruno collection.

## Key Insights
- Bruno can auto-generate standalone HTML docs for a collection.
- CLI supports running collections with `bru run` and environment flags.
- CLI v3 defaults to safe mode; developer mode requires `--sandbox=developer`.

## Requirements
- Commit generated HTML docs under `docs/bruno/`.
- Use a consistent output location for HTML docs under `docs/bruno/`.
- Provide a repeatable CLI command for running requests in CI or locally.

## Architecture
- Docs are generated from the Bruno collection, not source code.
- CLI is optional but useful for automation and CI.

## Related Code Files
- Create: /Users/dangcongtoan/Desktop/codes/BE/modular-monolith/docs/bruno/ (collection root and docs)
- Create: /Users/dangcongtoan/Desktop/codes/BE/modular-monolith/docs/bruno/*.html (generated)
- Modify: /Users/dangcongtoan/Desktop/codes/BE/modular-monolith/README.md (optional usage notes)
- Modify: /Users/dangcongtoan/Desktop/codes/BE/modular-monolith/package.json (optional script for `bru run`)

## Implementation Steps
1. Generate HTML docs from the collection using Bruno (Generate Docs).
2. Save HTML output under `docs/bruno/` and commit it.
3. Validate docs open in browser and reflect current requests.
4. Install Bruno CLI and run `bru run --env local` from the collection folder.
5. If using CI, document the CLI command and env requirements.

## Todo List
- [ ] Generate HTML docs
- [ ] Confirm HTML output location under docs/bruno
- [ ] Validate HTML output
- [ ] Verify CLI run locally
- [ ] Document usage (optional)

## Success Criteria
- HTML docs render and reflect the collection.
- `bru run --env local` executes successfully.
- Documentation is committed under docs/bruno and repeatable.

## Risk Assessment
- Risk: Committing generated HTML causes noisy diffs.
  - Mitigation: Regenerate only on release or document when updates are required.
- Risk: CLI safe mode blocks scripts that need filesystem or external packages.
  - Mitigation: Use `--sandbox=developer` only if required.

## Security Considerations
- Ensure docs do not expose secrets or tokens.
- Use environment variables for auth in CLI runs.

## Next Steps
- Final review and handoff to execution.
