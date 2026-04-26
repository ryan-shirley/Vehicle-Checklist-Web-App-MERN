import { test, expect, Page } from '@playwright/test';

// Group order + check titles MUST match backend/seed.js. Any drift in seed.js
// will fail this spec at the first missing title — that is the desired signal.
const GROUPS: Array<{ name: string; checks: string[] }> = [
  {
    name: 'Engine & Fluids',
    checks: [
      'Engine oil level satisfactory',
      'Coolant level satisfactory',
      'Brake fluid level satisfactory',
      'Power steering fluid satisfactory',
    ],
  },
  {
    name: 'Lights & Signals',
    checks: [
      'Headlights working',
      'Tail lights working',
      'Indicators (nearside) working',
      'Indicators (offside) working',
      'Hazard lights working',
    ],
  },
  {
    name: 'Safety Equipment',
    checks: [
      'First aid kit present and in date',
      'Fire extinguisher present and charged',
      'Warning triangle present',
      'Hi-vis vest present',
    ],
  },
  {
    name: 'Tyres & Wheels',
    checks: [
      'Front offside tyre condition satisfactory',
      'Front nearside tyre condition satisfactory',
      'Rear offside tyres condition satisfactory',
      'Rear nearside tyres condition satisfactory',
      'Wheel nuts secure',
    ],
  },
];

async function walkGroup(page: Page, group: { name: string; checks: string[] }) {
  const groupRow = page.getByRole('row', { name: new RegExp(group.name, 'i') });
  await groupRow.click();

  for (let i = 0; i < group.checks.length; i++) {
    const title = group.checks[i];
    // ChecksForms.js:162 renders titles as <p class="h5">; tag-based locators
    // would miss them, so use getByText which matches role-agnostic text.
    await expect(page.getByText(title)).toBeVisible();
    await page.getByRole('button', { name: /^Pass$/ }).click();

    if (i < group.checks.length - 1) {
      // Intermediate check: wait for the next title to render in <ChecksForm>.
      await expect(page.getByText(group.checks[i + 1])).toBeVisible();
    } else {
      // Last check of the group: <Create> swaps back to <GroupList>, so the
      // group-selection table reappears.
      await expect(page.getByRole('table')).toBeVisible();
    }
  }

  // Scope to the row to avoid cross-group "Done" badge ambiguity.
  await expect(
    page.getByRole('row', { name: new RegExp(group.name, 'i') }).getByText(/^Done$/)
  ).toBeVisible();
}

test('walks every group, submits, and the new record appears at the top', async ({ page }) => {
  // Step 1 — capture baseline row count.
  await page.goto('/records');
  await expect(page.getByRole('table')).toBeVisible();
  const before = await page.locator('table tbody tr').count();

  // Step 2 — open Create and wait for the checklist fetch to land.
  await Promise.all([
    page.waitForResponse(
      (r) => r.url().includes('/api/users') && r.url().includes('/checklist') && r.status() === 200
    ),
    page.goto('/records/create'),
  ]);
  await expect(page.getByRole('table')).toBeVisible();

  // Step 3 — walk all 4 groups (Create.js:61-64 submit gate requires every
  // group complete; no defaults exist, so every check must be answered).
  for (const group of GROUPS) {
    await walkGroup(page, group);
  }

  // Step 4 — set up the network listener BEFORE clicking Submit.
  const recordsPostPromise = page.waitForResponse(
    (r) => r.url().includes('/api/records') && r.request().method() === 'POST'
  );
  await page.getByRole('button', { name: /^Submit$/ }).click();
  const resp = await recordsPostPromise;
  expect(resp.status()).toBeGreaterThanOrEqual(200);
  expect(resp.status()).toBeLessThan(300);

  await expect(page).toHaveURL(/\/records$/);

  // Step 5 — relative count assertion (no absolute totals).
  // toHaveCount auto-waits for the GET /api/records response to populate the
  // table — don't snapshot the count eagerly before the list reloads.
  await expect(page.locator('table tbody tr')).toHaveCount(before + 1);

  const topRow = page.locator('table tbody tr').first();
  const today = new Date();
  const dd = String(today.getDate()).padStart(2, '0');
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const yyyy = today.getFullYear();
  await expect(topRow).toContainText(`${dd}/${mm}/${yyyy}`);
  await expect(topRow).toContainText('TE57 TDR');
  // Home.js renders the status badge as "PASS" (all checks Pass → passed=true).
  await expect(topRow.getByText(/^PASS$/)).toBeVisible();
});
