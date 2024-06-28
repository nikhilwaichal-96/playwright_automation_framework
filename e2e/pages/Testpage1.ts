import { Page, expect } from "@playwright/test";
import * as selectors from "./testpage1.selectors.json";

export class Testpage1 {
    readonly page: Page;
  
    constructor(page: Page) {
      this.page = page;
    }
    public async getIframe() {
        return this.page.frameLocator(selectors.iframe)
      }
}