import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: false,
  retries: 1,
  timeout: 30000,
  expect: { timeout: 10000 },
  reporter: [['html', { open: 'never' }]],
  use: {
    baseURL: 'http://localhost:4300',
    trace: 'on-first-retry',
    screenshot: 'off',
  },
  projects: [
    {
      name: 'Desktop Chrome',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'Mobile iPhone SE',
      use: {
        ...devices['iPhone SE'],
        browserName: 'chromium',
      },
    },
  ],
  webServer: {
    command: 'npx ng serve --port 4300',
    port: 4300,
    reuseExistingServer: true,
    timeout: 60000,
  },
});
