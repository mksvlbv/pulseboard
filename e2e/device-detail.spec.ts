import { test, expect } from '@playwright/test';

test.describe('Device Detail', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/devices/dev-001');
    await page.waitForSelector('.metrics-grid', { timeout: 10000 });
  });

  test('should display device name', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Solar Panel A1');
  });

  test('should show 8 metric cards', async ({ page }) => {
    const metrics = page.locator('.metric-card');
    await expect(metrics).toHaveCount(8);
  });

  test('should show live chart canvas', async ({ page }) => {
    await expect(page.locator('canvas')).toBeVisible();
  });

  test('should show readings table', async ({ page }) => {
    await expect(page.locator('.readings-table')).toBeVisible();
  });

  test('should populate live readings after waiting', async ({ page }) => {
    await page.waitForTimeout(6000);
    const rows = page.locator('.readings-table tbody tr');
    expect(await rows.count()).toBeGreaterThan(0);
  });

  test('should navigate back on Back button click', async ({ page }) => {
    await page.click('.detail__back');
    await expect(page).toHaveURL(/devices$/);
  });

  test('should show "Device not found" for invalid ID', async ({ page }) => {
    await page.goto('/devices/nonexistent-id');
    await page.waitForTimeout(1000);
    await expect(page.locator('.detail__empty')).toContainText('Device not found');
  });
});
