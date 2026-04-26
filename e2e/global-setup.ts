import { spawn } from 'child_process';
import http from 'http';

const BACKEND_HEALTHCHECK = 'http://localhost:5001/api/plants';

/**
 * Poll an HTTP URL until it returns a 2xx response, or until budgetMs elapses.
 * Throws a clear, fail-loud error on timeout so a missing Mongo / unhealthy
 * backend produces a useful message rather than a generic Playwright stall.
 */
function waitForHttp(url: string, budgetMs: number, intervalMs: number): Promise<void> {
  const deadline = Date.now() + budgetMs;
  return new Promise((resolve, reject) => {
    const attempt = () => {
      const req = http.get(url, (res) => {
        // Drain so the socket can close.
        res.resume();
        if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
          resolve();
          return;
        }
        retry(`status ${res.statusCode}`);
      });
      req.on('error', (err) => retry(err.message));
      req.setTimeout(intervalMs, () => {
        req.destroy();
        retry('request timeout');
      });
    };

    const retry = (reason: string) => {
      if (Date.now() >= deadline) {
        reject(
          new Error(
            `[e2e/global-setup] Backend healthcheck never returned 200 at ${url} (last reason: ${reason}). ` +
              `Is Mongo running? Try: npm run e2e:up`
          )
        );
        return;
      }
      setTimeout(attempt, intervalMs);
    };

    attempt();
  });
}

/**
 * Run a child process and resolve when it exits cleanly. Reject on non-zero
 * exit codes or spawn errors so a failed seed aborts the suite immediately.
 */
function runSubprocess(
  command: string,
  args: string[],
  env: NodeJS.ProcessEnv
): Promise<void> {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { env, stdio: 'inherit' });
    child.on('error', (err) => reject(err));
    child.on('exit', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(
          new Error(
            `[e2e/global-setup] ${command} ${args.join(' ')} exited with code ${code}`
          )
        );
      }
    });
  });
}

export default async function globalSetup(): Promise<void> {
  const mode = process.env.E2E_MODE ?? 'local';

  console.log(`[e2e/global-setup] mode=${mode}`);
  console.log(`[e2e/global-setup] waiting for backend at ${BACKEND_HEALTHCHECK} ...`);
  await waitForHttp(BACKEND_HEALTHCHECK, 60_000, 1_000);
  console.log('[e2e/global-setup] backend healthy.');

  if (mode === 'ci') {
    // Inside the compose network "mongo" resolves correctly; no env override.
    console.log('[e2e/global-setup] running seed via docker compose exec ...');
    await runSubprocess(
      'docker',
      ['compose', 'exec', '-T', 'backend', 'npm', 'run', 'seed'],
      process.env
    );
  } else {
    // Host-launched: backend/.env.local points at the Docker hostname "mongo"
    // which the host can't resolve. Override ATLAS_URI for the seed subprocess.
    console.log('[e2e/global-setup] running seed via node backend/seed.js ...');
    await runSubprocess('node', ['backend/seed.js'], {
      ...process.env,
      ATLAS_URI: 'mongodb://localhost:27017/vehicle-checklist',
    });
  }

  console.log('[e2e/global-setup] Seed complete!');
}
