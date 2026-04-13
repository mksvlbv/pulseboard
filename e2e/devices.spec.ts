import { test, expect } from '@playwright/test';

test.describe('Devices', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/devices');
    await page.waitForSelector('.table', { timeout: 10000 });
  });

  test('should display page title', async ({ page }) => {
    await expect(page.locator('.devices__title')).toHaveText('Devices');
  });

  test('should show device table with rows', async ({ page }) => {
    await page.waitForSelector('tbody tr', { timeout: 10000 });
    const rows = page.locator('tbody tr');
    expect(await rows.count()).toBeGreaterThan(0);
  });

  test('should filter devices by search', async ({ page }) => {
    const search = page.locator('input[aria-label="Search devices"]');
    await search.fill('Solar');
    await page.waitForTimeout(500);
    const rows = page.locator('tbody tr');
    expect(await rows.count()).toBeGreaterThanOrEqual(1);
    const firstName = await page.locator('.device-name').first().textContent();
    expect(firstName?.toLowerCase()).toContain('solar');
  });

  test('should sort by name', async ({ page }) => {
    await page.click('th.sortable >> text=Name');
    await page.waitForTimeout(300);
    const sortIcon = page.locator('.sort-icon');
    await expect(sortIcon.first()).toBeVisible();
  });

  test('should open create modal', async ({ page }) => {
    await page.click('button:has-text("Add Device")');
    await expect(page.locator('[role="dialog"]')).toBeVisible();
    await expect(page.locator('#createModalTitle')).toHaveText('Add New Device');
  });

  test('should close create modal on Cancel', async ({ page }) => {
    await page.click('button:has-text("Add Device")');
    await expect(page.locator('[role="dialog"]')).toBeVisible();
    await page.click('button:has-text("Cancel")');
    await expect(page.locator('[role="dialog"]')).not.toBeVisible();
  });

  test('should create a new device', async ({ page }) => {
    await page.click('button:has-text("Add Device")');
    await page.waitForSelector('[role="dialog"]');
    await page.fill('input[placeholder="e.g. Temperature Sensor #9"]', 'Test Sensor E2E');
    await page.fill('input[placeholder="e.g. Building A - Floor 3"]', 'Lab 5');
    await page.click('button:has-text("Create Device")');
    await page.waitForTimeout(2000);
    // Modal should close after creation
    await expect(page.locator('[role="dialog"]')).not.toBeVisible();
    // Search for the newly created device
    const search = page.locator('input[aria-label="Search devices"]');
    await search.fill('Test Sensor E2E');
    await page.waitForTimeout(500);
    await expect(page.locator('.device-name').first()).toContainText('Test Sensor E2E');
  });

  test('should navigate to device detail on row click', async ({ page }) => {
    await page.locator('tbody tr').first().click();
    await expect(page).toHaveURL(/devices\/dev-/);
  });

  test('should show delete confirmation', async ({ page }) => {
    page.on('dialog', async dialog => {
      expect(dialog.type()).toBe('confirm');
      expect(dialog.message()).toContain('Delete');
      await dialog.dismiss();
    });
    await page.locator('.btn-icon--danger').first().click();
  });
});
