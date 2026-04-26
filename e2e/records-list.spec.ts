import { test, expect } from '@playwright/test';

test('records list shows seeded rows', async ({ page }) => {
  await page.goto('/records');

  const table = page.getByRole('table');
  await expect(table).toBeVisible();

  // Seed creates 3 records; assert >= 3 to stay robust if other specs ran first.
  const rows = page.locator('table tbody tr');
  await expect(rows).not.toHaveCount(0);
  expect(await rows.count()).toBeGreaterThanOrEqual(3);

  const firstRow = rows.first();
  await expect(firstRow).toContainText('TE57 TDR');
  await expect(firstRow).toContainText('Depot A');
  // Status badge text in Home.js renders as "PASS" / "FAIL" (uppercase).
  await expect(firstRow.getByText(/^(PASS|FAIL)$/)).toBeVisible();
});
