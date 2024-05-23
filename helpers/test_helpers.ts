/* eslint-disable @typescript-eslint/no-explicit-any */
import { expect, BrowserContext } from "@playwright/test";

export class TestHelper {
    private static finishedTests = {};
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public static CheckDevice (context: any, device: string) {
    // tslint:disable-next-line: no-string-literal
        return context._options.userAgent?.includes(device);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public static CheckBrowser (browserName: string, checkBrowser: any) {
    // tslint:disable-next-line: no-string-literal
        return checkBrowser._ownedServer._process.spawnfile?.includes(browserName);
    }

    public static async dispose (browserContext: BrowserContext) {
        try {
            const state = expect.getState();
            const currentTestName = state.currentTestName;
            const regex = /\b(\d{7})\b/;
            const matches = regex.exec(currentTestName);
            const globalBrowser = browserContext.browser();
            const contextGUID = (browserContext as any)._guid;
            const contexts = globalBrowser.contexts();
            for (const [contextIndex, currentContext] of contexts.entries()) {
                const currentContextGUID = (currentContext as any)._guid;
                if (currentContextGUID === contextGUID) {
                    const pages = currentContext.pages();
                    for (let i = 0; i < pages.length; i++) {
                        const cpage = pages[i];
                        if (matches && matches.length > 0) {
                            const testcaseId = matches[0];
                            const itTitle = currentTestName.split(":")[1].trim();
                            const testUniqueName = `${testcaseId}/page${i}_${itTitle}`;
                            let runningTimes = this.finishedTests[testUniqueName] ?? 0;
                            const screenshotFileName = currentTestName.replace(/\W/g, "_");
                            try {
                                await cpage.screenshot({
                                    path: `screenshots/${screenshotFileName}_context${contextIndex}_page${i}_${new Date().getUTCHours()}-${new Date().getUTCMinutes()}.png`,
                                    fullPage: true,
                                    type: "png"
                                });
                                this.finishedTests[testUniqueName] = ++runningTimes;
                            } catch {
                                // If page is already closed, there will be an exception
                            }
                        }
                    }
                }
            }
            await browserContext?.close();
        } catch (ex) {
            console.error("Error while closing the browser context: " + ex);
        }
    }
}
