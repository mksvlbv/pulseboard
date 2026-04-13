import { test, expect } from '@playwright/test';

test.describe('Settings', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/settings');
    await page.waitForSelector('.settings-card', { timeout: 10000 });
  });

  test('should display page title', async ({ page }) => {
    await expect(page.locator('.settings__title')).toHaveText('Settings');
  });

  test('should show 3 settings cards', async ({ page }) => {
    const cards = page.locator('.settings-card');
    await expect(cards).toHaveCount(3);
  });

  test('should toggle dark mode', async ({ page }) => {
    const checkbox = page.locator('.toggle input').first();
    const initialState = await checkbox.isChecked();
    await page.locator('.toggle').first().click();
    const newState = await checkbox.isChecked();
    expect(newState).toBe(!initialState);
  });

  test('should change auto-refresh interval', async ({ page }) => {
    const select = page.locator('.setting-select').first();
    await select.selectOption('5');
    await expect(select).toHaveValue('5');
  });

  test('should save settings and show confirmation', async ({ page }) => {
    await page.click('button:has-text("Save Changes")');
    await expect(page.locator('button:has-text("Saved!")')).toBeVisible();
  });

  test('should persist settings after reload', async ({ page }) => {
    const checkbox = page.locator('.toggle input').nth(1);
    const before = await checkbox.isChecked();
    await page.locator('.toggle').nth(1).click();
    await page.click('button:has-text("Save Changes")');
    await page.waitForTimeout(500);
    await page.reload();
    await page.waitForSelector('.settings-card');
    const after = await page.locator('.toggle input').nth(1).isChecked();
    expect(after).toBe(!before);
  });

  test('should reset defaults', async ({ page }) => {
    await page.click('button:has-text("Reset Defaults")');
    const darkToggle = page.locator('.toggle input').first();
    await expect(darkToggle).toBeChecked();
  });

  test('should display notification summary', async ({ page }) => {
    await expect(page.locator('.setting-row__summary')).toContainText('Active notifications:');
  });
});
