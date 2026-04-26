<!-- Generated: 2026-04-26 | Updated: 2026-04-26 -->

# Vehicle-Checklist-Web-App-MERN

## Purpose
A MERN stack (MongoDB, Express, React, Node.js) web application for managing vehicle checklists in a plant/depot environment. Users authenticate via Firebase, then create, edit, and review inspection records organized into check groups. The backend is a Node.js/Express REST API with MongoDB data storage, and the frontend is a React SPA deployed via Firebase Hosting.

## Key Files

| File | Description |
|------|-------------|
| `package.json` | Root project manifest — scripts for building the React UI |
| `firebase.json` | Firebase Hosting + Cloud Functions deployment config with URL rewrites |
| `.firebaserc` | Firebase project alias mapping |
| `.env.config` | Template/reference for required environment variables |
| `.prettierrc` | Code formatting rules |
| `README.md` | Project overview and setup instructions |

## Subdirectories

| Directory | Purpose |
|-----------|---------|
| `backend/` | Node.js/Express REST API with MongoDB models and routes (see `backend/AGENTS.md`) |
| `src/` | React frontend — pages, components, and SCSS styling (see `src/AGENTS.md`) |
| `public/` | Static assets served by React (HTML shell, favicon, manifest) (see `public/AGENTS.md`) |
| `.github/` | GitHub Actions CI/CD workflows for deployment and security scanning (see `.github/AGENTS.md`) |

## For AI Agents

### Working In This Directory
- This is a monorepo with separate `package.json` files at the root (React UI) and in `backend/` (Express API). Install dependencies in both places separately.
- Root `npm run build` compiles the React app; backend is started with `node backend/index.js`.
- Firebase Hosting rewrites all non-static URLs to the Cloud Function defined in `backend/` — keep this in mind when adding new API routes.
- Environment variables for the backend live in `backend/.env`; frontend env vars use the standard `REACT_APP_*` prefix in root `.env`.

### Testing Requirements
- Backend tests live in `backend/testing/` and use Jest. Run with `npm test` inside `backend/`.
- No frontend test suite is configured yet; add tests in `src/__tests__/` using React Testing Library if needed.

### Common Patterns
- Authentication is handled by Firebase Auth on the frontend; the backend validates tokens via `backend/middleware/auth-middleware.js`.
- MongoDB models use Mongoose schemas; all models are in `backend/models/`.

## Dependencies

### External
- React 17+ — frontend UI framework
- Express — backend REST framework
- MongoDB / Mongoose — data persistence
- Firebase — Auth, Hosting, and Cloud Functions deployment
- Bootstrap / SCSS — frontend styling

<!-- MANUAL: -->
