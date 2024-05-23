import { ElementHandle, Frame, Page, expect } from '@playwright/test';
import { test } from './test';
export default class testPage implements test {
    page: Page;
    constructor(page: Page) {
        this.page = page;
    }
    frame = (locator): Frame => {
         const frame =this.page.frame(locator);
         if (!frame) {
             throw new Error(`Frame not found`);
         }
            return frame;
    }
}