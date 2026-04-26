<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-04-26 | Updated: 2026-04-26 -->

# routes

## Purpose
Express route handlers organized by resource. Each file defines an Express Router that is mounted in `backend/index.js`. All routes are protected by `auth-middleware.js` unless explicitly public.

## Key Files

| File | Description |
|------|-------------|
| `root.js` | Health-check or root endpoint — confirms the API is reachable |
| `users.js` | CRUD operations for user profiles (create, read, update) |
| `plants.js` | CRUD operations for plant/depot locations |
| `checkList.js` | CRUD operations for checklist templates and their check groups |
| `records.js` | CRUD operations for completed inspection records |

## For AI Agents

### Working In This Directory
- Each route file exports an Express `Router` instance. Mount it in `backend/index.js` with `app.use('/api/<resource>', router)`.
- Authenticate via `auth-middleware.js` is applied at the app level — do not duplicate auth checks inside route handlers.
- Use `req.user.uid` (populated by auth middleware) to scope queries to the authenticated user where applicable.
- Return consistent error shapes: `res.status(<code>).json({ message: '<description>' })`.

### Testing Requirements
- Route handlers should be tested with `supertest` against an Express app instance with a mocked database layer.

### Common Patterns
- Standard REST verbs: `GET /` (list), `GET /:id` (get one), `POST /` (create), `PUT /:id` (update), `DELETE /:id` (delete).
- Mongoose model operations are `async/await` with `try/catch` error handling forwarding to `next(err)`.

## Dependencies

### Internal
- `../models/` — Mongoose models used in each route file
- `../middleware/auth-middleware.js` — applied upstream in `index.js`

### External
- `express` — Router and HTTP utilities

<!-- MANUAL: -->
