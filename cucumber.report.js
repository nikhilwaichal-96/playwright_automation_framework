const reporter = require('cucumber-html-reporter');
const myArgs = process.argv.slice(2);
let reportFileName= ""
if (myArgs.length > 0){
 reportFileName =myArgs[0]
 reportFileName= reportFileName.substring(reportFileName.lastIndexOf('/') + 1,reportFileName.lastIndexOf("."))
}
const reportFile = reportFileName || "report";
const options = {
  theme: 'hierarchy',
  jsonFile: 'reports/'+reportFile+'.json',
  output: 'reports/'+reportFile+'.html',
  screenshotsDirectory: 'reports/screenshots/',
  storeScreenshots: true,
  scenarioTimestamp: true,
  reportSuiteAsScenarios: false,
  launchReport: true,
};
reporter.generate(options);