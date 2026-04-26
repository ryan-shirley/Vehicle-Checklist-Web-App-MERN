import { test, expect } from "@playwright/test"

// Override the default storageState (which would auto-redirect to /records)
// so the login UI is exercised and visible in the HTML report.
test.use({ storageState: { cookies: [], origins: [] } })

test("renders the login form", async ({ page }) => {
    await page.goto("/")

    await expect(page.getByPlaceholder("Email")).toBeVisible()
    await expect(page.getByPlaceholder("Password")).toBeVisible()
    await expect(page.getByRole("button", { name: /Sign In/i })).toBeVisible()
})

test("logs in successfully", async ({ page }) => {
    await page.goto("/")

    await page.getByPlaceholder("Email").fill("test@local.dev")
    await page.getByPlaceholder("Password").fill("Test1234!")
    await page.getByRole("button", { name: /Sign In/i }).click()

    await expect(page).toHaveURL(/\/records$/)

    const jwtToken = await page.evaluate(() => localStorage.getItem("jwtToken"))
    expect(jwtToken).toBeTruthy()
})
