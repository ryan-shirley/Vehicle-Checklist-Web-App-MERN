<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-04-26 | Updated: 2026-04-26 -->

# components

## Purpose
Shared React components reused across multiple pages. Contains the main navigation bar and route guard wrappers that enforce authentication rules for the app's routing layer.

## Key Files

| File | Description |
|------|-------------|
| `hgv-navbar.js` | Top navigation bar displayed on all authenticated pages — includes branding and nav links |
| `PrivateRoute.js` | Route guard that redirects unauthenticated users to `/login` before rendering the wrapped route |
| `RestricedRoute.js` | Route guard that redirects already-authenticated users away from public-only routes (e.g., Login, Register) |

## For AI Agents

### Working In This Directory
- Route guards (`PrivateRoute`, `RestricedRoute`) wrap `<Route>` in `src/App.js` — update auth logic there if Firebase Auth integration changes.
- `hgv-navbar.js` is rendered inside authenticated layouts; add new nav links here when adding top-level pages.
- Keep components in this directory generic and reusable — page-specific UI belongs in `src/pages/`.

### Testing Requirements
- Route guard components should be tested by rendering them with a mocked Firebase Auth context and asserting the correct redirect or render behaviour.

### Common Patterns
- Guards read Firebase Auth state (via context or hook) to determine if a user is logged in.
- Components use React Router's `<Redirect>` or `useHistory` for navigation.

## Dependencies

### Internal
- Used by `src/App.js` to wrap all route definitions

### External
- `react-router-dom` — `Route`, `Redirect`
- `firebase` — Auth state listener

<!-- MANUAL: -->
