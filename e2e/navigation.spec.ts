import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test('should redirect root to /dashboard', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL(/dashboard/);
  });

  test('should navigate to all pages via sidebar', async ({ page }) => {
    await page.goto('/dashboard');

    await page.click('a[aria-label="Devices"]');
    await expect(page).toHaveURL(/devices/);
    await expect(page.locator('h1')).toContainText('Devices');

    await page.click('a[aria-label="Alerts"]');
    await expect(page).toHaveURL(/alerts/);
    await expect(page.locator('h1')).toContainText('Alerts');

    await page.click('a[aria-label="Settings"]');
    await expect(page).toHaveURL(/settings/);
    await expect(page.locator('h1')).toContainText('Settings');

    await page.click('a[aria-label="Dashboard"]');
    await expect(page).toHaveURL(/dashboard/);
    await expect(page.locator('h1')).toContainText('Dashboard');
  });

  test('should highlight active sidebar link', async ({ page }) => {
    await page.goto('/devices');
    await expect(page.locator('a[aria-label="Devices"]')).toHaveClass(/active/);
  });

  test('should redirect unknown routes to dashboard', async ({ page }) => {
    await page.goto('/nonexistent-page');
    await expect(page).toHaveURL(/dashboard/);
  });
});
