This is a 4th year Computer Science project. Part of a JavaScript module with this project focusing on creating a full stack application using the MERN stack. It is a vehicle checklist progressive web app with a focus on HGV (Heavy Goods Vehicle). 

For deployment Heroku and MongoDB Atlas was used.

## Setup Project
Firstly you will need to add in the correct environmental variables in the `/backend` directory. This is for connecting to MongoDB and setting JSON Web Token verification key.

You will also need to install the node modules in both the project directory and the `/backend` directory. You can do this by running the following command.

#### `npm install`

## Run Web App
In the project directory, you can run:

#### `npm start`

This will run the web app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />

## Run API
In the backend directory, you can run:

#### `npm run watch`

This will run the backend api in the development mode.<br />
Open [http://localhost:4000](http://localhost:4000) to view it in the browser.

The api will reload if you make edits on save.<br />

## Running E2E tests

End-to-end tests use [Playwright](https://playwright.dev/) and drive the real
React UI against the real Express API and Mongo.

### Prerequisites
- **Node 18+** (Playwright requirement; the harness is in the root `package.json`).
- **Docker** with **Docker Compose v2** (the `docker compose` plugin, not the legacy `docker-compose` v1 binary).

### One-time setup
```bash
npm install
npx playwright install --with-deps chromium
```

### Local run (default)
```bash
npm run e2e:up    # start Mongo only
npm run e2e       # Playwright boots backend + CRA via webServer, seeds, logs in, runs specs
```
Helpful extras:
- `npm run e2e:headed` — run with a visible browser.
- `npm run e2e:ui` — open Playwright's UI mode for time-travel debugging.
- `npm run e2e:report` — open the last HTML report.
- `npm run e2e:down` — stop docker compose services.

### CI run (full stack in Docker)
```bash
npm run e2e:up:ci
npm run e2e:ci
```
The GitHub Actions workflow at `.github/workflows/e2e.yml` does this on every
push / PR to `master` and `Redesign` and uploads the HTML report and
`test-results/` as artifacts.

### Notes
- `globalSetup` re-runs `backend/seed.js` on **every** invocation. This is
  intentional and idempotent — `seed.js` drops the database before re-seeding,
  which is also what guarantees the captured login `storageState` always
  matches the freshly-created user's `_id`.
- The suite runs serially (`workers: 1`, `fullyParallel: false`) because the
  shared Mongo has no per-spec isolation.

## Project Design
![Desktop Records](https://raw.githubusercontent.com/ryan-shirley/hgv-web-app/master/screenshots/Desktop-Records.png)
