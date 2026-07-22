import { defineConfig, devices } from '@playwright/test'

/**
 * E2E runs against the *built* playground, not the dev server, so the specs
 * exercise the same bundling and minification a consumer's app would.
 *
 * This complements rather than duplicates the Vitest browser suite: those
 * assert one component in isolation, these assert a whole page — tab order
 * across several ratings, a real form round-trip, page-level RTL, and an axe
 * scan of the full document.
 */
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : [['list']],
  use: {
    baseURL: 'http://localhost:4173',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
  webServer: {
    command: 'pnpm run playground:build && pnpm run playground:preview',
    url: 'http://localhost:4173',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
})
