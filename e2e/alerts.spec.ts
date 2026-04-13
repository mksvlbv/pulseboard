import { test, expect } from '@playwright/test';

test.describe('Alerts', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/alerts');
    await page.waitForSelector('.alert-card', { timeout: 10000 });
  });

  test('should display page title and subtitle', async ({ page }) => {
    await expect(page.locator('.alerts-page__title')).toHaveText('Alerts');
    await expect(page.locator('.alerts-page__subtitle')).toHaveText('Real-time system notifications');
  });

  test('should show summary badges', async ({ page }) => {
    await expect(page.locator('.summary-badge--critical')).toBeVisible();
    await expect(page.locator('.summary-badge--warning')).toBeVisible();
    await expect(page.locator('.summary-badge--info')).toBeVisible();
  });

  test('should display alert cards', async ({ page }) => {
    const cards = page.locator('.alert-card');
    expect(await cards.count()).toBeGreaterThan(0);
  });

  test('should show device name on alert card', async ({ page }) => {
    const device = page.locator('.alert-card__device').first();
    const text = await device.textContent();
    expect(text?.trim().length).toBeGreaterThan(0);
  });

  test('should filter by severity', async ({ page }) => {
    const filters = page.locator('.filters__select');
    await filters.first().selectOption('critical');
    await page.waitForTimeout(300);
    const cards = page.locator('.alert-card');
    const count = await cards.count();
    for (let i = 0; i < count; i++) {
      await expect(cards.nth(i)).toHaveClass(/alert-card--critical/);
    }
  });

  test('should acknowledge an active alert', async ({ page }) => {
    const ackBtn = page.locator('button:has-text("Acknowledge")').first();
    if (await ackBtn.isVisible()) {
      await ackBtn.click();
      await page.waitForTimeout(500);
      await expect(page.locator('.status--acknowledged').first()).toBeVisible();
    }
  });

  test('should resolve an acknowledged alert', async ({ page }) => {
    const ackBtn = page.locator('button:has-text("Acknowledge")').first();
    if (await ackBtn.isVisible()) {
      await ackBtn.click();
      await page.waitForTimeout(500);
    }
    const resolveBtn = page.locator('button:has-text("Resolve")').first();
    if (await resolveBtn.isVisible()) {
      await resolveBtn.click();
      await page.waitForTimeout(500);
      await expect(page.locator('.status--resolved').first()).toBeVisible();
    }
  });
});
