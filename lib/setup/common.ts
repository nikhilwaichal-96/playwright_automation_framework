import { World, Status, ITestCaseHookParameter } from '@cucumber/cucumber';
//import { playwrightCaps } from 'browserstack.config';
import {
    BrowserContext,
    chromium,
    firefox,
    webkit,
    devices,
    _android as android,
    Page,
    Coverage,
    Browser,
} from 'playwright';
import { ICIWorld } from './ci-world';

export class Common {
    StatusMessage = {
        [Status.AMBIGUOUS]: 'AMBIGUOUS',
        [Status.FAILED]: 'FAILED',
        [Status.PASSED]: 'PASSED',
        [Status.PENDING]: 'PENDING',
        [Status.SKIPPED]: 'SKIPPED',
        [Status.UNDEFINED]: 'UNDEFINED',
        [Status.UNKNOWN]: 'UNKNOWN',
    };

    async openBrowser() {
        const browserOptions = {
            slowMo: global.world_parameters.slowMo || 0,
            headless: global.world_parameters.headless || false,
            devtools: global.world_parameters.devtools || false,
            channel: '',
            args: [
                '--use-fake-ui-for-media-stream',
                '--use-fake-device-for-media-stream',
                '--start-maximized',
            ],
            firefoxUserPrefs: {
                'media.navigator.streams.fake': true,
                'media.navigator.permission.disabled': true,
            },
        };
        let browser: Browser;
        switch (global.world_parameters.browser) {
            case 'edge':
                browserOptions.channel = 'msedge';
                browser = await chromium.launch(browserOptions);
                break;
            case 'chrome':
                browserOptions.channel = 'chrome';
                browser = await chromium.launch(browserOptions);
                break;
            case 'firefox':
                browser = await firefox.launch(browserOptions);
                break;
            case 'webkit':
                browser = await webkit.launch(browserOptions);
                break;
            case 'bs_chromium':
                browser = await chromium.connect({ wsEndpoint: `wss://cdp.browserstack.com/playwright?caps=${encodeURIComponent(JSON.stringify({}))}`, });
                break;
            case 'chromium':
            default:
                browser = await chromium.launch(browserOptions);
        }
        (global as any).browser = browser;
        return browser;
    }
    async openContext() {
        let context: BrowserContext;

        if (global.world_parameters.realDevice) {
            //Real Device
            const [device] = await android.devices();
            await device.shell("am force-stop com.android.chrome");
            await device.shell("pm clear com.android.chrome");
            context = await device.launchBrowser();
        }
        else {
            let options = global.world_parameters.isMobile ? devices[global.world_parameters.device] : {};
            options = {
                ...options,
                bypassCSP: true,
                recordVideo: global.world_parameters.recordVideo ? { dir: './reports/video/' } : undefined,
                // set viewport to null to make viewport size fill entire browser window, instead of displaying
                // in a small section
                viewport: null,
            };
            context = await (global as any).browser.newContext(options)
        }
        return context;
    }

    async openPage(context: BrowserContext, url: string) {
        const page = await context.newPage();
        if (global.world_parameters.coverage || false) {
            await page.coverage.startJSCoverage();
            //await page.coverage.startCSSCoverage();
        }
        await page.goto(url, { waitUntil: 'load' });
        page.setDefaultTimeout(global.defaultTimeout);
        page.setDefaultNavigationTimeout(global.defaultTimeout)
        console.log("Page opened")
        return page;
    }

    async takeScreenShotOnFailure(objworld: ICIWorld, scenario: ITestCaseHookParameter) {
        if (scenario.result) {
            await objworld.attach(
                `Status: ${scenario.result?.status ? this.StatusMessage[scenario.result.status] : this.StatusMessage[0]
                }. Duration:${JSON.stringify(scenario.result.duration)}s`,
            );

            // if status is not passed then attach screenshot
            if (scenario.result.status !== Status.PASSED) {
                const scenarioName = (scenario.pickle.name).replace(/[/\\?%*:|"<>]/g, '-');
                const image = await objworld.testApp.page.screenshot({
                    path: `./reports/screenshots/${scenarioName}_customer.png`,
                });
                if (image) await objworld.attach(image, 'image/png');
            }
        }
    }
    async closeDevice() {
        const [device] = await android.devices();
        device.close();
    }

    

}