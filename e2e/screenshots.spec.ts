import { test } from '@playwright/test';

// --- Initial page screenshots ---
const pages = [
  { name: 'dashboard', path: '/dashboard', wait: '.stat-card' },
  { name: 'devices', path: '/devices', wait: '.table' },
  { name: 'device-detail', path: '/devices/dev-001', wait: '.metrics-grid' },
  { name: 'alerts', path: '/alerts', wait: '.alert-card' },
  { name: 'settings', path: '/settings', wait: '.settings-card' },
];

for (const pg of pages) {
  test(`screenshot: ${pg.name}`, async ({ page }, testInfo) => {
    await page.goto(pg.path);
    await page.waitForSelector(pg.wait, { timeout: 10000 });
    await page.waitForTimeout(1500);

    const project = testInfo.project.name.includes('Mobile') ? 'mobile' : 'desktop';
    await page.screenshot({
      path: `e2e/screenshots/${project}-${pg.name}.png`,
      fullPage: true,
    });
  });
}

// --- Interaction state screenshots ---

test('screenshot: dashboard-live-data', async ({ page }, testInfo) => {
  await page.goto('/dashboard');
  await page.waitForSelector('.stat-card', { timeout: 10000 });
  await page.waitForTimeout(6000);
  const project = testInfo.project.name.includes('Mobile') ? 'mobile' : 'desktop';
  await page.screenshot({
    path: `e2e/screenshots/${project}-dashboard-live.png`,
    fullPage: true,
  });
});

test('screenshot: devices-create-modal', async ({ page }, testInfo) => {
  await page.goto('/devices');
  await page.waitForSelector('.table', { timeout: 10000 });
  await page.click('button:has-text("Add Device")');
  await page.waitForSelector('[role="dialog"]');
  await page.waitForTimeout(500);
  const project = testInfo.project.name.includes('Mobile') ? 'mobile' : 'desktop';
  await page.screenshot({
    path: `e2e/screenshots/${project}-devices-create-modal.png`,
    fullPage: true,
  });
});

test('screenshot: devices-search-filtered', async ({ page }, testInfo) => {
  await page.goto('/devices');
  await page.waitForSelector('.table', { timeout: 10000 });
  await page.waitForSelector('tbody tr', { timeout: 10000 });
  await page.fill('input[aria-label="Search devices"]', 'Solar');
  await page.waitForTimeout(500);
  const project = testInfo.project.name.includes('Mobile') ? 'mobile' : 'desktop';
  await page.screenshot({
    path: `e2e/screenshots/${project}-devices-search.png`,
    fullPage: true,
  });
});

test('screenshot: device-detail-live-readings', async ({ page }, testInfo) => {
  await page.goto('/devices/dev-001');
  await page.waitForSelector('.metrics-grid', { timeout: 10000 });
  await page.waitForTimeout(6000);
  const project = testInfo.project.name.includes('Mobile') ? 'mobile' : 'desktop';
  await page.screenshot({
    path: `e2e/screenshots/${project}-device-detail-live.png`,
    fullPage: true,
  });
});

test('screenshot: alerts-acknowledged', async ({ page }, testInfo) => {
  await page.goto('/alerts');
  await page.waitForSelector('.alert-card', { timeout: 10000 });
  const ackBtn = page.locator('button:has-text("Acknowledge")').first();
  if (await ackBtn.isVisible()) {
    await ackBtn.click();
    await page.waitForTimeout(500);
  }
  const project = testInfo.project.name.includes('Mobile') ? 'mobile' : 'desktop';
  await page.screenshot({
    path: `e2e/screenshots/${project}-alerts-acknowledged.png`,
    fullPage: true,
  });
});
