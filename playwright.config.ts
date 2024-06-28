import type { PlaywrightTestConfig } from '@playwright/test';
import { devices } from '@playwright/test';
import path from "path";
const outPutDir = path.join(".", "generated/tests");
const jUnitTestResults = path.join(outPutDir, "test-results/test-results.xml")

/**
 * See https://playwright.dev/docs/test-configuration.
 */
const timeInMin: number = 60 * 1000;
const config: PlaywrightTestConfig = {
  globalSetup: "./global-setup",
  testDir: './e2e',
  /* Maximum time one test can run for. */
  timeout: 60 * 10000,
  expect: {
    /**
     * Maximum time expect() should wait for the condition to be met.
     * For example in `await expect(locator).toHaveText();`
     */
    timeout: 60 * 10000
  },
  /* Run tests in files in parallel */
  fullyParallel: false,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  // retries: 2,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? parseInt(process.env.CI) : 1,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    ["list", { open: "never" }],
    ["junit", { outputFile: jUnitTestResults }]
  ],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    headless: false,
    /* Maximum time each action such as `click()` can take. Defaults to 0 (no limit). */
    actionTimeout: Number.parseInt(process.env.ACTION_TIMEOUT || "2") * timeInMin,
    /* Base URL to use in actions like `await page.goto('/')`. */
    // baseURL: 'http://localhost:3000',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: "retain-on-failure",
    screenshot: 'only-on-failure',
    video: "retain-on-failure",
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
      },
    },
  ],
};

export default config;