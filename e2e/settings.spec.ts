import { expect, test } from "@playwright/test"

// Seed values from backend/seed.js — any drift there will break these assertions,
// which is the desired signal.
const SEED = {
    registration: "TE57 TDR",
    make: "Volvo",
    model: "FH16",
    plant: "Depot A"
}

const UPDATED_REG = "XY21 ABC"

test.describe("Settings page", () => {
    test.afterEach(async ({ page }) => {
        // Restore seed registration so subsequent tests that assert on "TE57 TDR"
        // (e.g. records-list) are not affected. Settings run last alphabetically
        // but this keeps the suite idempotent across re-runs without re-seeding.
        await page.goto("/settings")
        await page.getByLabel("Registration Number").fill(SEED.registration)
        await page.getByRole("button", { name: /Save Changes/i }).click()
        await expect(page.getByText("Settings saved successfully.")).toBeVisible()
    })

    test("loads pre-filled with seed vehicle and plant data", async ({ page }) => {
        await page.goto("/settings")

        await expect(page.getByLabel("Registration Number")).toHaveValue(SEED.registration)
        await expect(page.getByLabel("Make")).toHaveValue(SEED.make)
        await expect(page.getByLabel("Model")).toHaveValue(SEED.model)

        // Plant dropdown should have the seed plant selected.
        const plantSelect = page.getByLabel("Plant")
        await expect(plantSelect).toHaveValue(/.+/) // a real ObjectId is selected
        await expect(plantSelect.locator("option:checked")).toContainText(SEED.plant)
    })

    test("is reachable from the TopAppBar dropdown", async ({ page }) => {
        await page.goto("/records")

        // Open the three-dot menu in the app bar.
        await page.getByRole("button", { name: /More options/i }).click()
        await page.getByRole("menuitem", { name: /Settings/i }).click()

        await expect(page).toHaveURL(/\/settings$/)
        // Scope to h2 — the TopAppBar h1 may briefly also read "Settings" while user data loads.
        await expect(page.getByRole("heading", { name: /Settings/i, level: 2 })).toBeVisible()
    })

    test("saves updated vehicle details and persists after navigation", async ({ page }) => {
        await page.goto("/settings")

        // Edit the registration number.
        const regInput = page.getByLabel("Registration Number")
        await regInput.fill(UPDATED_REG)

        // Intercept the PUT before clicking submit.
        const putPromise = page.waitForResponse((r) => r.url().includes("/api/users") && r.request().method() === "PUT")
        await page.getByRole("button", { name: /Save Changes/i }).click()

        const putResp = await putPromise
        expect(putResp.status()).toBe(200)

        // Success alert visible.
        await expect(page.getByText("Settings saved successfully.")).toBeVisible()

        // Navigate away and back — value must persist (round-tripped through DB).
        await page.goto("/records")
        await page.goto("/settings")
        await expect(page.getByLabel("Registration Number")).toHaveValue(UPDATED_REG)
    })

    test("TopAppBar reflects updated registration on the records page", async ({ page }) => {
        await page.goto("/settings")

        await page.getByLabel("Registration Number").fill(UPDATED_REG)

        const putPromise = page.waitForResponse((r) => r.url().includes("/api/users") && r.request().method() === "PUT")
        await page.getByRole("button", { name: /Save Changes/i }).click()
        await putPromise

        // Navigate to records; the app bar title should show the new registration.
        await page.goto("/records")
        // Home.js fetches the user and passes registration_number to TopAppBar as title.
        await expect(page.getByRole("banner")).toContainText(UPDATED_REG)
    })

    test("browser blocks submission when registration number is cleared", async ({ page }) => {
        await page.goto("/settings")

        // Clear the required field and attempt to submit.
        await page.getByLabel("Registration Number").fill("")
        await page.getByRole("button", { name: /Save Changes/i }).click()

        // HTML5 required attribute prevents the form from submitting — no PUT is
        // sent and no success message should appear.
        await expect(page.getByText("Settings saved successfully.")).not.toBeVisible()

        // The input itself should be marked invalid by the browser.
        const isValid = await page
            .getByLabel("Registration Number")
            .evaluate((el: HTMLInputElement) => el.validity.valid)
        expect(isValid).toBe(false)
    })

    test("plant dropdown lists all available plants", async ({ page }) => {
        await page.goto("/settings")

        const plantSelect = page.getByLabel("Plant")
        // Seed creates exactly 1 plant; at least one real option (not the placeholder).
        const options = plantSelect.locator("option:not([value=''])")
        await expect(options).not.toHaveCount(0)
        await expect(options.first()).toContainText(SEED.plant)
    })
})
