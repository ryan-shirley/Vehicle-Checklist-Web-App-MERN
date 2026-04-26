import { test, expect } from "@playwright/test"

test("logs out via the 3-dot menu and lands on the login page", async ({ page }) => {
    await page.goto("/records")
    await expect(page.getByRole("table")).toBeVisible()

    // Open the dropdown
    await page.getByRole("button", { name: /more options/i }).click()
    await expect(page.getByRole("menuitem", { name: /log out/i })).toBeVisible()

    // Click Log out — triggers window.location.replace('/') + localStorage clear
    await page.getByRole("menuitem", { name: /log out/i }).click()

    await expect(page).toHaveURL(/^http:\/\/localhost:3000\/?$/)
    await expect(page.getByPlaceholder("Email")).toBeVisible()

    // Confirm localStorage was cleared
    const auth = await page.evaluate(() => ({
        jwtToken: localStorage.getItem("jwtToken"),
        uid: localStorage.getItem("UID")
    }))
    expect(auth.jwtToken).toBeNull()
    expect(auth.uid).toBeNull()
})
