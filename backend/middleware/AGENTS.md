<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-04-26 | Updated: 2026-04-26 -->

# middleware

## Purpose
Express middleware applied to incoming API requests. Currently contains authentication middleware that verifies Firebase ID tokens and rejects unauthenticated requests before they reach route handlers.

## Key Files

| File | Description |
|------|-------------|
| `auth-middleware.js` | Extracts the Bearer token from `Authorization` header, verifies it with Firebase Admin SDK, and attaches the decoded user to `req.user` |

## For AI Agents

### Working In This Directory
- This middleware runs on every protected route. If a token is invalid or missing, it returns `401` before the route handler executes.
- `req.user` is populated with the decoded Firebase token payload (includes `uid`, `email`, etc.) and is available in all downstream route handlers.
- When adding new middleware, mount it in `backend/index.js` before the route definitions.

### Testing Requirements
- Auth middleware should be tested with mock Firebase Admin SDK calls. Use Jest mocks to simulate valid and invalid token scenarios.

### Common Patterns
- Token extraction: `Authorization: Bearer <firebase-id-token>`
- On verification failure: `res.status(401).json({ message: 'Unauthorized' })`

## Dependencies

### External
- `firebase-admin` — used to call `admin.auth().verifyIdToken(token)`

<!-- MANUAL: -->
