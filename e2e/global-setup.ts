import http from "node:http"

const BACKEND_HEALTHCHECK = "http://localhost:5001/api/plants"

/**
 * Poll an HTTP URL until it returns a 2xx response, or until budgetMs elapses.
 * Throws a clear, fail-loud error on timeout so a missing Mongo / unhealthy
 * backend produces a useful message rather than a generic Playwright stall.
 */
function waitForHttp(url: string, budgetMs: number, intervalMs: number): Promise<void> {
    const deadline = Date.now() + budgetMs
    return new Promise((resolve, reject) => {
        const attempt = () => {
            const req = http.get(url, (res) => {
                // Drain so the socket can close.
                res.resume()
                if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
                    resolve()
                    return
                }
                retry(`status ${res.statusCode}`)
            })
            req.on("error", (err) => retry(err.message))
            req.setTimeout(intervalMs, () => {
                req.destroy()
                retry("request timeout")
            })
        }

        const retry = (reason: string) => {
            if (Date.now() >= deadline) {
                reject(
                    new Error(
                        `[e2e/global-setup] Backend healthcheck never returned 200 at ${url} (last reason: ${reason}). ` +
                            `Is Mongo running? Try: npm run e2e:up`
                    )
                )
                return
            }
            setTimeout(attempt, intervalMs)
        }

        attempt()
    })
}

export default async function globalSetup(): Promise<void> {
    await waitForHttp(BACKEND_HEALTHCHECK, 60_000, 1_000)
}
