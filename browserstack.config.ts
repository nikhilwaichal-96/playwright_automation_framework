import { Local } from "browserstack-local";
export let playwrightCaps = {
  browser: process.env.BROWSERSTACK_BROWSER || 'chrome',
  os: process.env.BROWSERSTACK_OS || 'osx',
  os_version: process.env.BROWSERSTACK_OS_VERSION || 'catalina',
  browser_version: process.env.BROWSERSTACK_BROWSER_VERSION || 'latest',
  name: 'Browserstack Project',
  build: 'Playwright',
  'browserstack.username': process.env.BROWSERSTACK_USERNAME,
  'browserstack.accessKey':process.env.BROWSERSTACK_ACCESS_KEY,
  'browserstack.local': process.env.BROWSERSTACK_LOCAL || false,
  'browserstack.playwrightVersion': '1.latest',
  'client.playwrightVersion': '1.latest',
  'browserstack.debug': 'true',  // enabling visual logs
  'browserstack.console': 'info',  // Enabling Console logs for the test
  'browserstack.networkLogs': 'true',  // Enabling network logs for the test
  'browserstack.interactiveDebugging': 'true',
}

export const webDriverIOCaps = {
    capabilities: {
        acceptInsecureCerts: true,
        browserName: "Safari",
        device: "iPhone 12 Pro",
        javascriptEnabled: true,
        platform: "MAC",
        platformName: "iOS",
        "browserstack.local": true,
        "browserstack.idleTimeout": "120",
        // deviceOrientation: "landscape",
        //: "@os='ios' and @category='PHONE'",
    },
    user: process.env.BROWSERSTACK_USERNAME,
    key: process.env.BROWSERSTACK_ACCESS_KEY,
    hostname: "hub.browserstack.com",
    headless: false,
    services: ["browserstack"],
    waitforTimeout: 120000,
};

/**
 * This function starts or stops the BrowserStack localtesting.
 * @param operation Specify the operation "start" | "stop"
 */
export async function browserStackLocalTesting(operation: "start" | "stop") {
    const browserstackLocal: Local = (global as any).local !== undefined ? (global as any).local : new Local();
    (global as any).local = browserstackLocal;

    const browserStackLocal_agrs = {
        key: process.env.BROWSERSTACK_ACCESS_KEY,
        force: true,
        forceLocal: true,
        onlyAutomate: true,
    };

    const localtesting = new Promise<void>((resolve, reject) => {
        switch (operation.toLowerCase()) {
            case "start":
                browserstackLocal.start(browserStackLocal_agrs, function (error) {
                    if (error) {
                        reject(Error("Unable to start browserstack local"));
                    }
                    console.log("Started BrowserStackLocal");
                    resolve();
                });
                break;
            case "stop":
                browserstackLocal.stop(function () {
                    console.log("Stopped BrowserStackLocal");
                    resolve();
                });
        }
    });
    
    await localtesting;
}