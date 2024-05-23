import { Page } from "@playwright/test";
import { TestSettings } from "configuration/test-settings";
export class BasePage {
    protected isBaseClosed = false;
    constructor(protected _page: Page) { 
        this._page = _page;
    }

    public get Page(): Page {
        return this._page;
    }

    public set Page(page: Page) {
        this._page = page;
    }

    // Waiting to load DOM
    public async waitForDomContentLoaded() {
        await this.Page.waitForLoadState('domcontentloaded');
    }

    public async closePage() {
        if (this.isBaseClosed) {
            return;
        }
        await this._page.close();
        this.isBaseClosed = true;
    }

    public async scrollTo(selector: string) {
        await this.Page.evaluate(
            (param) => {
                document.querySelector(param.selector).scrollIntoView();
            },
            { selector }
        );
    }

    public async open(url: string) {
        await this.Page.goto(url, { waitUntil: "domcontentloaded" });
        await this.Page.waitForTimeout(TestSettings.WaitTimeout);
    }

    public async waitUntilSelectorIsVisible(
        selectorVal: string,
        maxCount = 3,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        page: any,
        timeout: number = TestSettings.WaitTimeout
    ) {
        let dataCount = 0;
        const pageObject = page ?? this.Page;
        while (dataCount < maxCount) {
            try {
                await pageObject.waitForSelector(selectorVal, { timeout });
                return true;
            } catch {
                dataCount++;
            }
        }
        return false;
    }
}