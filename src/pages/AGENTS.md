<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-04-26 | Updated: 2026-04-26 -->

# pages

## Purpose
Top-level page components, each mapped to a route in `src/App.js`. Contains authentication pages (Login, Register), a Home landing page, and a `records/` subdirectory with the full CRUD flow for inspection records.

## Key Files

| File | Description |
|------|-------------|
| `Home.js` | Authenticated landing page — entry point after login, shows summary or navigation to records |
| `Login.js` | Firebase Auth sign-in form — email/password login, redirects to Home on success |
| `Register.js` | Firebase Auth registration form — creates a new user account and syncs to the backend |

## Subdirectories

| Directory | Purpose |
|-----------|---------|
| `records/` | Pages and sub-components for creating, editing, and viewing inspection records (see `records/AGENTS.md`) |

## For AI Agents

### Working In This Directory
- Each page component is the direct child of a route in `src/App.js` — register new pages there.
- Authentication pages (`Login.js`, `Register.js`) are wrapped with `RestricedRoute` and should not render the `hgv-navbar`.
- Pages that need API data should call the backend using the Firebase ID token from `firebase.auth().currentUser.getIdToken()`.

### Testing Requirements
- Page components can be tested with React Testing Library by rendering with a mocked Firebase Auth context and mocked API responses.

### Common Patterns
- Auth pages call `firebase.auth().signInWithEmailAndPassword()` / `createUserWithEmailAndPassword()`.
- After login/register, navigate using `useHistory().push('/')`.
- API calls use `fetch` or Axios with `Authorization: Bearer <token>` header.

## Dependencies

### Internal
- `src/components/hgv-navbar.js` — included in authenticated page layouts
- `src/pages/records/` — sub-pages for record management

### External
- `firebase` — Auth SDK
- `react-router-dom` — routing hooks

<!-- MANUAL: -->
