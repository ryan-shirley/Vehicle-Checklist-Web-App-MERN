import { defineConfig, devices } from '@playwright/test';

const E2E_MODE = process.env.E2E_MODE ?? 'local';

export default defineConfig({
  testDir: './e2e',
  // Serial execution: shared Mongo, no per-spec isolation. Running specs in
  // parallel could let, e.g., the list spec read 3 rows while the create spec
  // is mid-POST. workers: 1 + fullyParallel: false is a deliberate correctness
  // choice, not a performance tweak. Removing them must be a deliberate change.
  workers: 1,
  fullyParallel: false,
  // CRA's first compile is slow; bump per-test budget to 60s so cold-compile
  // navigations don't race the default 30s timeout.
  timeout: 60_000,
  retries: process.env.CI ? 2 : 0,
  reporter: [['list'], ['html', { open: 'never' }]],
  globalSetup: require.resolve('./e2e/global-setup.ts'),
  use: {
    baseURL: 'http://localhost:3000',
    // Artifacts: we want enough evidence to debug a CI failure without rerunning
    // locally, but not bloat artifacts on green runs.
    trace: 'retain-on-failure',
    video: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'setup',
      testMatch: /auth\.setup\.ts/,
    },
    {
      name: 'chromium',
      dependencies: ['setup'],
      use: {
        ...devices['Desktop Chrome'],
        storageState: 'e2e/.auth/user.json',
      },
    },
  ],
  // Local mode boots app servers via Playwright; CI mode delegates to
  // docker-compose so all three tiers run in a clean container network.
  webServer:
    E2E_MODE === 'local'
      ? [
          {
            // ATLAS_URI is injected here because backend/.env.local defaults to
            // mongodb://mongo:27017/... (the Docker hostname). When running on
            // the host, that hostname is unreachable — point at localhost.
            command:
              'ATLAS_URI=mongodb://localhost:27017/vehicle-checklist node backend/server.dev.js',
            url: 'http://localhost:5001/api/plants', // deep healthcheck (exercises Mongo)
            reuseExistingServer: !process.env.CI,
            timeout: 60_000,
          },
          {
            // NODE_OPTIONS needed because CRA's webpack uses legacy OpenSSL APIs
            // not supported in Node 17+. Same flag used in docker-compose.yml.
            command: 'NODE_OPTIONS=--openssl-legacy-provider npm run dev',
            url: 'http://localhost:3000',
            reuseExistingServer: !process.env.CI,
            timeout: 120_000, // CRA cold compile
          },
        ]
      : undefined,
});
