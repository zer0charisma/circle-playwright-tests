import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

// Load .env so BASE_URL and credentials are available without exporting them in the shell.
// dotenv is used instead of relying on CI-only env injection so local runs match CI once .env exists.
dotenv.config({ path: path.resolve(__dirname, '.env') });

export default defineConfig({
  // Keep specs out of pages/ so page objects are not treated as tests.
  testDir: './tests',

  // Circle.so is a SPA with network-bound pages; 30s is Playwright's default, 
  // ail slow tests rather than hide flakiness with a huge timeout.
  timeout: 30_000,

  // Assertion timeout is shorter than the test timeout so a missed locator fails fast
  // instead of consuming the full 30s per expect().
  expect: { timeout: 5_000 },

  // Independent tests run in parallel within a file for wall-clock speed.
  // Tests that share account state should opt out with test.describe.serial().
  fullyParallel: true,

  // test.only left in source would silently shrink CI coverage — fail the build instead.
  forbidOnly: !!process.env.CI,

  // Locally: 0 retries so flakes are visible while developing.
  // CI: 2 retries because browsers/network flake more on shared runners than on a laptop.
  retries: process.env.CI ? 2 : 0,

  // CI: 1 worker avoids resource contention (CPU, one test user) that looks like product bugs.
  // Local: undefined lets Playwright use ~half the CPU cores.
  workers: process.env.CI ? 1 : undefined,

  // HTML is the artifact you attach to a PR; list is the live terminal progress.
  reporter: [['html', { open: 'never' }], ['list']],

  use: {
    // Relative locators/gotos (page.goto('/login')) resolve against this origin.
    // Comes from .env so the same suite can target staging vs production without code edits.
    baseURL: process.env.BASE_URL ?? 'https://app.circle.so',

    // Traces are large. on-first-retry records only the retry that matters after a failure,
    // so you get a timeline/network/DOM dump without paying trace I/O on every green test.
    trace: 'on-first-retry',

    // Screenshots on every step waste disk. only-on-failure captures the last viewport
    // when the test dies — enough to see the UI state without a full video.
    screenshot: 'only-on-failure',

    // Videos are heavier than screenshots. retain-on-failure records during the run but
    // deletes the file if the test passed, so CI artifacts stay failure-focused.
    video: 'retain-on-failure',
  },

  // Three engines catch engine-specific bugs (Safari flex/grid, Firefox cookie quirks)
  // without maintaining a custom browser matrix. Each project clones `use` and adds device UA/viewport.
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
});
