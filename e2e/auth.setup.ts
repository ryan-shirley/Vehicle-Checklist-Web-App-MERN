import { expect, test as setup } from "@playwright/test"

const STORAGE_STATE = "e2e/.auth/user.json"

setup("authenticate", async ({ page }) => {
    // Real form login — this is the ONLY path that produces storageState.
    // Runs after globalSetup (which seeds), so jwtToken + UID match the
    // freshly-created user's _id and there is no UID-desync risk.
    await page.goto("/")

    await page.getByPlaceholder("Email").fill("test@local.dev")
    await page.getByPlaceholder("Password").fill("Test1234!")
    await page.getByRole("button", { name: /Sign In/i }).click()

    await expect(page).toHaveURL(/\/records$/)

    // Confirm Login.js wrote the JWT and UID before we capture the state. If
    // either is missing, Playwright would still serialize the state but later
    // specs would 401 — fail loud here instead.
    const auth = await page.evaluate(() => ({
        jwtToken: localStorage.getItem("jwtToken"),
        uid: localStorage.getItem("UID")
    }))
    expect(auth.jwtToken, "jwtToken not written by Login").toBeTruthy()
    expect(auth.uid, "UID not written by Login").toBeTruthy()

    await page.context().storageState({ path: STORAGE_STATE })
})
