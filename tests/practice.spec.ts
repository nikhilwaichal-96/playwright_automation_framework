import { BrowserContext, expect, test } from "@playwright/test";
import { practicePage } from "pages/practice.page";
import { TestHelper } from "helpers/test_helpers";

test.describe("Practice Page", () => {
    let practicePageContext: BrowserContext;
    test.beforeEach(async ({ browser }) => {
        practicePageContext = await browser.newContext();
    });

    test.afterEach(async () => {
        await TestHelper.dispose(practicePageContext);
    });

    test("Verify the page title", async ({ page }) => {
        const practicePageObject = new practicePage(page);
        await practicePageObject.open("https://www.google.com");
        await practicePageObject.waitForDomContentLoaded();
        const title = await practicePageObject.Page.title();
        expect(title).toBe("Google");
    });

});
