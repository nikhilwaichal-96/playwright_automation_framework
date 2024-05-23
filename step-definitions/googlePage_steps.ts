import { Given, When, Then, BeforeStep } from "@cucumber/cucumber";
import { ICIWorld } from '../lib/setup/ci-world';
let testApp: any;
BeforeStep(async function (this: ICIWorld) {
    testApp =this.testApp;
});

Given('I am on the google page', async () => {
 console.log('I am on the google page');
 //console.log(await testApp.page.title());
})