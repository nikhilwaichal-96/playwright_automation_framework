import { Frame, Page } from 'playwright';
export interface test{
    page: Page;
    frame(locator): Frame;
}