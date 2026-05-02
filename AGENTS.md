<!-- Generated: 2026-04-26 | Updated: 2026-05-02 -->

# Vehicle-Checklist-Web-App-MERN

## Purpose
A MERN stack (MongoDB, Express, React, Node.js) web application for managing vehicle checklists in a plant/depot environment. Users authenticate, then create, edit, and review inspection records organised into check groups. The backend is a Node.js/Express REST API deployed as a Firebase Cloud Function; the frontend is a React SPA deployed via Firebase Hosting.

## Key Files

| File | Description |
|------|-------------|
| `package.json` | Root project manifest — React UI scripts, Biome, Playwright |
| `docker-compose.yml` | Full local stack: MongoDB + backend + frontend |
| `firebase.json` | Firebase Hosting + Cloud Functions config with URL rewrites |
| `biome.json` | Biome formatter/linter config (covers `src/`, `backend/`, `e2e/`) |
| `playwright.config.ts` | Playwright E2E configuration |
| `src/setupProxy.js` | CRA dev-server proxy — forwards `/api` to backend on port 5001 |
| `src/services/api.js` | Centralised Axios instance with auth interceptor and 401 handler |
| `src/constants/index.js` | `STORAGE_KEYS`, `API_ROUTES`, `APP_ROUTES` constants |

## Subdirectories

| Directory | Purpose |
|-----------|---------|
| `backend/` | Node.js/Express REST API, Mongoose models, routes, seed script |
| `src/` | React frontend — pages, components, SCSS design system |
| `e2e/` | Playwright end-to-end test suite |
| `public/` | Static assets served by React |
| `.github/workflows/` | CI (`ci.yml`) and deploy (`deploy.yml`) pipelines |

---

## Running the Project

### Full stack via Docker (recommended)

Starts MongoDB, the Express backend, and the React dev server together:

```bash
docker compose up -d --wait   # start all services, wait for healthy
```

| Service | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:5001 |
| MongoDB | localhost:27017 |

Seed the database (required on first run or after a reset):

```bash
docker compose exec backend node seed.js
# Login: test@local.dev / Test1234!
```

Stop and remove volumes:

```bash
docker compose down -v
```

### Local dev (without Docker)

Requires MongoDB running locally on port 27017.

```bash
# Terminal 1 — backend
cd backend && npm install && npm run dev

# Terminal 2 — frontend
npm install --legacy-peer-deps && npm run dev
```

The CRA dev server (`src/setupProxy.js`) proxies `/api/*` to `http://localhost:5001` automatically.

---

## Environment Variables

| File | Used by |
|------|---------|
| `backend/.env.local` | Local backend dev — `ATLAS_URI`, `JWT_VERIFY`, `PORT` |
| `backend/.env` | Production secrets (not committed) |
| `.env` | Frontend — `REACT_APP_*` prefix required |

Docker Compose provides safe CI defaults when `backend/.env.local` is absent.

---

## Building

```bash
# Frontend production build (requires Node 24 + legacy OpenSSL flag)
NODE_OPTIONS=--openssl-legacy-provider npm run build

# Backend — no build step; Firebase deploys source directly
cd backend && npm install
```

> **Note:** `react-scripts@3.4.1` uses webpack 4, which is incompatible with the OpenSSL 3 default in Node 17+. Always set `NODE_OPTIONS=--openssl-legacy-provider` when building.

---

## Linting & Formatting

Biome covers `src/`, `backend/`, and `e2e/`. Install peer deps at root first.

```bash
npm run check          # lint + format check (no writes)
npm run check:fix      # lint + format and auto-fix
npm run lint           # lint only
npm run format         # format only (writes)
npm run format:check   # format check (no writes)
```

Biome is configured for: 4-space indent, double quotes, no semicolons, trailing-comma-free, LF line endings.

---

## Testing

### E2E tests (Playwright)

The suite has 6 tests and requires the full stack running (Docker is the easiest path).

```bash
# Start the stack first
docker compose up -d --wait
docker compose exec backend node seed.js   # seed once per fresh DB

# Run headless (same as CI)
npm run e2e:ci

# Run with browser UI visible
npm run e2e:headed

# Interactive Playwright UI
npm run e2e:ui

# View last HTML report
npm run e2e:report
```

Tests live in `e2e/`. Auth state is stored in `e2e/.auth/` (gitignored). `e2e/global-setup.ts` polls the backend healthcheck before running — if it times out, the backend or MongoDB is not ready.

### Backend unit tests (Jest)

```bash
cd backend && npm test
```

Tests live in `backend/testing/`.

---

## CI / CD

### Workflows

| Workflow | Trigger | What it does |
|----------|---------|--------------|
| `ci.yml` | Every PR + manual | `build` (frontend compile + backend install) and `e2e` run in **parallel** |
| `deploy.yml` | Push to `master` + manual | E2E first, then `deploy-frontend` and `deploy-functions` in **parallel** |

### Key CI notes
- `npm ci --legacy-peer-deps` required for frontend due to `react-scripts@3.4.1` peer dep conflicts with TypeScript 5
- `NODE_OPTIONS=--openssl-legacy-provider` required for `npm run build` in CI
- Backend deploys to **Cloud Functions Gen 1** — runtime is controlled by `"node": "20"` in `backend/package.json` (Gen 1 max)
- Deployment uses `FIREBASE_TOKEN` secret; regenerate with `npx firebase-tools login:ci`

---

## Architecture Notes

- **Auth flow:** JWT tokens stored in `localStorage` under `STORAGE_KEYS.JWT_TOKEN`. All API calls go through `src/services/api.js` which auto-attaches the token and handles 401s globally.
- **Routing:** Firebase Hosting rewrites all non-static requests to the Cloud Function. `src/setupProxy.js` handles the same rewrite in local dev.
- **Node versions:** Frontend/CI uses Node 24. Backend Cloud Function runtime is Node 20 (Gen 1 limit). Both Docker images use Node 24-alpine.
- **SCSS design system:** Custom `omc-*` design tokens in `src/scss/theme/_design-tokens.scss`; component styles in `src/scss/theme/components/`.

<!-- MANUAL: -->
