import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const pages = [
  { name: 'Dashboard', path: '/dashboard', wait: '.stat-card' },
  { name: 'Devices', path: '/devices', wait: '.table' },
  { name: 'Alerts', path: '/alerts', wait: '.alert-card' },
  { name: 'Settings', path: '/settings', wait: '.settings-card' },
];

for (const pg of pages) {
  test(`a11y audit: ${pg.name}`, async ({ page }) => {
    await page.goto(pg.path);
    await page.waitForSelector(pg.wait, { timeout: 10000 });

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .exclude('.chart-card canvas')
      .disableRules(['color-contrast'])
      .analyze();

    const critical = results.violations.filter(
      (v) => v.impact === 'critical' || v.impact === 'serious'
    );

    if (critical.length > 0) {
      console.log(`\n⚠️  A11y issues on ${pg.name}:`);
      critical.forEach((v) => {
        console.log(`  [${v.impact}] ${v.id}: ${v.description}`);
        v.nodes.forEach((n) => console.log(`    → ${n.html.substring(0, 100)}`));
      });
    }

    expect(
      critical.length,
      `Found ${critical.length} critical/serious a11y violations on ${pg.name}`
    ).toBe(0);
  });
}
