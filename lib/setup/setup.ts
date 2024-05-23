import { Before, BeforeAll, AfterAll, After, setDefaultTimeout } from '@cucumber/cucumber';
import { Common } from './common';
import { ITestCaseHookParameter } from '@cucumber/cucumber/lib/support_code_library_builder/types';
import { ICIWorld } from './ci-world';
import dotenv from 'dotenv';
import Logger from '../helpers/Logger';
import { BrowserContext } from 'playwright';
//import { browserStackLocalTesting, webDriverIOCaps } from '../../browserstack.config';
import app from '../../page-objects/app';
import testPage from '../../page-objects/testPage';
dotenv.config();
const common = new Common();

global.defaultTimeout = (process.env.PWDEBUG ? 3600 : 60) * 1000;
global.playwrightExpectTimeout = 10 * 1000;
setDefaultTimeout(global.defaultTimeout);

BeforeAll(async function () {
  // Nothing to do
});

Before(async function (
    this: ICIWorld,
    { gherkinDocument }: ITestCaseHookParameter,) {
    global.world_parameters = this.parameters;
    await common.openBrowser();
    this.logger = new Logger(this);
    let ciworld;
    ciworld = await openApp(this);
    this.context = ciworld["context"];
    this.testApp = ciworld["testApp"];
  });
  async function openApp(world: ICIWorld): Promise<Pick<ICIWorld, "testApp">> {
    const ciworld: Partial<ICIWorld> = {};
    const testUrl = global.world_parameters.test_url;
    ciworld["context"] = await common.openContext();
    ciworld["testApp"] = new testPage(await common.openPage(ciworld["context"], testUrl));
    console.log(ciworld["testApp"].page.url());
    return ciworld as Pick<ICIWorld, "testApp" | "context">;
  }

  // Cleanup after each scenario
After(async function (this: ICIWorld, scenario) {
    await common.takeScreenShotOnFailure(this, scenario);
    await this.testApp.page.close();
    await this.context.close();
    await (global as any).browser.close();
    if (this.parameters.realDevice == 'true') await common.closeDevice();
  });