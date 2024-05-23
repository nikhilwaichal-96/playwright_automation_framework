import { PlaywrightTestConfig } from "@playwright/test";
import { TestSettings } from "configuration/test-settings";

const config: PlaywrightTestConfig = {
    testDir: "tests",
    timeout: 3 * 60 * 1000,
    expect: {
        /**
         * Maximum time expect() should wait for the condition to be met.
         * For example in `await expect(locator).toHaveText();`
         */
        timeout: 50 * 1000
    },
    fullyParallel: true,
    workers: process.env.CI ? parseInt(process.env.CI) : 3,
    use: {
        headless: TestSettings.HeadlessSettings,
        trace: "on-first-retry",
        browserName: TestSettings.Browser,
        viewport: null,
        screenshot: TestSettings.ScreenshotSettings,
        launchOptions: { ...TestSettings.LaunchBrowserSettings },
        actionTimeout: 60 * 1000,
      },
    reporter: [["junit", { outputFile: "./report/results.xml" }]],
    retries: 1
};
export default config;
