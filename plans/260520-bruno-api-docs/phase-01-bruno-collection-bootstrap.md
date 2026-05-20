# Phase 01 - Bruno collection bootstrap

## Context Links
- https://docs.usebruno.com/introduction/quick-start
- https://docs.usebruno.com/variables/overview
- ../README.md
- ../docs/system-architecture.md
- ../src/main.ts

## Overview
- Priority: P2
- Status: Pending
- Goal: Create a repo-local Bruno collection in BRU format and verify it opens in Bruno.

## Key Insights
- Bruno collections are Git-friendly and can live inside the repo.
- Collection format will use BRU.
- Swagger UI is available at `/api` for endpoint discovery.

## Requirements
- Collection stored inside the repo at `docs/bruno/`.
- BRU format selected for collection files.
- No secrets committed; use environment or process env variables.
- File names must be kebab-case.

## Architecture
- Collection root directory under repo at `docs/bruno/`.
- Bruno creates `bruno.json` plus request/environment `.bru` files in the collection.

## Related Code Files
- Create: /Users/dangcongtoan/Desktop/codes/BE/modular-monolith/docs/bruno/
- Create: /Users/dangcongtoan/Desktop/codes/BE/modular-monolith/docs/bruno/bruno.json
- Create: /Users/dangcongtoan/Desktop/codes/BE/modular-monolith/docs/bruno/*.bru
- Modify: /Users/dangcongtoan/Desktop/codes/BE/modular-monolith/.gitignore (only if needed to ensure `.bru` files are tracked)

## Implementation Steps
1. Confirm collection location (`docs/bruno/`) and file format (BRU).
2. Open Bruno, create a new collection in the chosen folder with BRU format.
3. Verify Bruno created `bruno.json` and initial `.bru` files.
4. Ensure `.bru` files are not ignored by `.gitignore`.

## Todo List
- [ ] Confirm collection location and format
- [ ] Create collection in Bruno (BRU)
- [ ] Verify bruno.json and `.bru` files exist
- [ ] Confirm `.bru` files are tracked by git

## Success Criteria
- Bruno collection opens from the repo without errors.
- `bruno.json` and base `.bru` files exist under the chosen folder.
- `.bru` files are tracked by git.

## Risk Assessment
- Risk: Collection stored outside repo or wrong format.
  - Mitigation: Confirm path and YAML selection before creating.

## Security Considerations
- Do not place secrets in collection files.
- Use environment or process env variables for tokens and passwords.

## Next Steps
- Define environments and auth variables (Phase 02).
