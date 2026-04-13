import { test, expect } from '@playwright/test';

test.describe('Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForSelector('.stat-card', { timeout: 10000 });
  });

  test('should display page title and subtitle', async ({ page }) => {
    await expect(page.locator('.dashboard__title')).toHaveText('Dashboard');
    await expect(page.locator('.dashboard__subtitle')).toHaveText('Real-time IoT device monitoring');
  });

  test('should show 4 stat cards', async ({ page }) => {
    const cards = page.locator('.stat-card');
    await expect(cards).toHaveCount(4);
  });

  test('should show live update counter', async ({ page }) => {
    const live = page.locator('.dashboard__live');
    await expect(live).toBeVisible();
    await expect(live).toContainText('updates');
  });

  test('should render energy and temperature charts', async ({ page }) => {
    const charts = page.locator('canvas');
    await expect(charts).toHaveCount(2);
  });

  test('should display device status list', async ({ page }) => {
    const devices = page.locator('.device-row');
    await expect(devices.first()).toBeVisible();
    expect(await devices.count()).toBeGreaterThan(0);
  });

  test('should show live feed items after a few seconds', async ({ page }) => {
    await page.waitForTimeout(5000);
    const feedItems = page.locator('.feed-item');
    expect(await feedItems.count()).toBeGreaterThan(0);
  });

  test('live feed should show device names not IDs', async ({ page }) => {
    await page.waitForTimeout(5000);
    const firstDevice = page.locator('.feed-item__device').first();
    const text = await firstDevice.textContent();
    expect(text).not.toMatch(/^dev-\d{3}$/);
  });
});
