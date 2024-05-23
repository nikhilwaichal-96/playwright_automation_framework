import * as testData from "./test_settings.json";

export class TestSettings {
    public static get Devices(): string[] {
        return process.env.devices
            ? JSON.parse(process.env.devices)
            : testData.devices;
    }

    public static get Browsers(): string[] {
        return process.env.browsers
            ? JSON.parse(process.env.browsers)
            : testData.browsers;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public static get Browser(): any {
        return process.env.browser ? process.env.browser : testData.browsers[0];
    }

    public static get LaunchBrowserSettings() {
        return testData.launchBrowserSettings;
    }

    public static get Viewport() {
        return { width: 1900, height: 900 };
    }

    public static get ScreenshotSettings(): "only-on-failure" | "off" | "on" {
        return testData.screenshotSettings as "only-on-failure" | "off" | "on";
    }

    public static get HeadlessSettings(): boolean {
        return testData.launchBrowserSettings.headless;
    }

    public static get SlowMo(): number {
        return testData.launchBrowserSettings.slowMo;
    }

    public static get WaitTimeout(): number {
        return testData.waitTimeout;
    }
}