<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-04-26 | Updated: 2026-04-26 -->

# testing

## Purpose
Jest test files for backend utility functions. Currently contains minimal example tests; intended to grow as route handlers and models gain coverage.

## Key Files

| File | Description |
|------|-------------|
| `sum.test.js` | Jest test runner file — imports and runs tests for utility functions in `tests/` |
| `tests/sum.js` | Utility: adds two numbers (used as a baseline test example) |
| `tests/concatName.js` | Utility: concatenates first and last name strings |

## For AI Agents

### Working In This Directory
- Run tests with `npm test` from inside the `backend/` directory.
- Add new test files alongside or within `tests/` and import them in a corresponding `*.test.js` runner, or use Jest's auto-discovery by naming files `*.test.js`.
- New route and model tests belong here; use `supertest` for HTTP-level route tests and `mongodb-memory-server` for in-memory DB tests.

### Testing Requirements
- Each utility function in `tests/` should have at least one positive and one edge-case test.
- Aim for meaningful coverage of route handlers as the API grows.

### Common Patterns
- Jest `describe` / `it` / `expect` conventions.
- Keep pure utility functions in `tests/` separate from Express/Mongoose-dependent integration tests.

## Dependencies

### External
- `jest` — test runner

<!-- MANUAL: -->
