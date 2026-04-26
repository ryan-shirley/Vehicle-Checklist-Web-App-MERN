<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-04-26 | Updated: 2026-04-26 -->

# backend

## Purpose
Node.js/Express REST API server for the Vehicle Checklist application. Connects to MongoDB for data persistence and validates requests using Firebase Auth tokens. Deployed as a Firebase Cloud Function. Exposes endpoints for users, plants, checklists, and inspection records.

## Key Files

| File | Description |
|------|-------------|
| `index.js` | Express app entry point — configures middleware, mounts routes, connects to MongoDB, and exports as Cloud Function |
| `package.json` | Backend-specific dependencies (Express, Mongoose, Firebase Admin, etc.) |
| `.env` | Local environment variables (MongoDB URI, Firebase credentials) — not committed |
| `.env.config` | Template listing required environment variable keys |

## Subdirectories

| Directory | Purpose |
|-----------|---------|
| `middleware/` | Express middleware (auth token validation) (see `middleware/AGENTS.md`) |
| `models/` | Mongoose schemas for MongoDB collections (see `models/AGENTS.md`) |
| `routes/` | Express route handlers grouped by resource (see `routes/AGENTS.md`) |
| `testing/` | Jest test files for backend utilities (see `testing/AGENTS.md`) |

## For AI Agents

### Working In This Directory
- Install dependencies with `npm install` inside `backend/` before running locally.
- All routes require a valid Firebase ID token in the `Authorization: Bearer <token>` header unless explicitly public.
- MongoDB connection string and Firebase service account credentials must be present in `backend/.env`.
- When adding a new resource, follow the existing pattern: create a Mongoose model in `models/`, a route file in `routes/`, and mount it in `index.js`.

### Testing Requirements
- Run `npm test` inside `backend/` to execute Jest tests.
- Tests live in `testing/tests/` with the test runner file at `testing/sum.test.js`.

### Common Patterns
- Auth validation is applied globally via `auth-middleware.js` — new routes inherit it automatically.
- Mongoose models use a consistent schema pattern with timestamps where appropriate.
- Error responses follow `{ message: string }` JSON shape with appropriate HTTP status codes.

## Dependencies

### Internal
- All routes depend on Mongoose models in `models/`
- All routes pass through `middleware/auth-middleware.js`

### External
- `express` — HTTP server framework
- `mongoose` — MongoDB ODM
- `firebase-admin` — Firebase Auth token verification
- `cors` — Cross-origin request handling
- `dotenv` — Environment variable loading

<!-- MANUAL: -->
