<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-04-26 | Updated: 2026-04-26 -->

# src

## Purpose
React frontend source code for the Vehicle Checklist application. Contains the app entry point, top-level routing, page components, reusable UI components, and SCSS stylesheets. Built with Create React App and deployed to Firebase Hosting.

## Key Files

| File | Description |
|------|-------------|
| `index.js` | React DOM entry point — mounts `<App />` into the HTML shell |
| `App.js` | Root component — defines top-level routes (Login, Register, Home, Records) and guards them with auth-aware route components |
| `App.scss` | Top-level SCSS import that pulls in Bootstrap and theme styles |
| `serviceWorker.js` | CRA-generated service worker registration (offline/PWA support) |

## Subdirectories

| Directory | Purpose |
|-----------|---------|
| `components/` | Shared UI components used across multiple pages (see `components/AGENTS.md`) |
| `pages/` | Page-level components mapped to routes (see `pages/AGENTS.md`) |
| `scss/` | SCSS source split into Bootstrap config/overrides and custom theme (see `scss/AGENTS.md`) |

## For AI Agents

### Working In This Directory
- Run `npm start` from the project root to start the development server.
- Routes are defined in `App.js` using React Router — add new pages there.
- Firebase Auth state controls access via `PrivateRoute` and `RestricedRoute` wrappers.
- All API calls hit the backend deployed as a Firebase Cloud Function; in development, configure a proxy or use the full function URL from `.env`.

### Testing Requirements
- No test suite is currently configured for the frontend. Add tests alongside components using React Testing Library.

### Common Patterns
- Page components live in `src/pages/` and import shared UI from `src/components/`.
- Styling uses SCSS modules; component-specific styles are co-located in `src/scss/theme/components/`.
- Firebase Auth SDK is used for login/logout and obtaining ID tokens for API requests.

## Dependencies

### Internal
- `components/` — shared route guards and navbar consumed by `App.js` and pages
- `scss/` — all styling imported via `App.scss`

### External
- `react` / `react-dom` — UI rendering
- `react-router-dom` — client-side routing
- `firebase` — Auth SDK
- `sass` — SCSS compilation
- `bootstrap` — base CSS framework

<!-- MANUAL: -->
