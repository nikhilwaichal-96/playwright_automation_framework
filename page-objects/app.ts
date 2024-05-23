import { ElementHandle, Frame, Page, expect } from '@playwright/test';
export default class app {
    page: Page;
    constructor(page: Page) {
        this.page = page;
    }
}