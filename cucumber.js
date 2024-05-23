const test_url = "https://www.google.com";
const params = {
  headless: false,
  devtools: false,
  slowMo: 0,
  realDevice: false,
  device: "iPhone 11",
  recordVideo: false,
  browser: "chromium",
  log_enabled: true,
  log_location: "report", //add logs to report
  //log_location: "console", //prints console.log messages while executing script
  test_url: test_url,
  coverage: false,
};
const getFormattedDateTime = () => {
  const today = new Date();
  const date =
    today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
  const time =
    today.getHours() + "-" + today.getMinutes() + "-" + today.getSeconds();
  return date + "_" + time;
};
const getReportFormat = (reportName = "report") => {
  const params = {
    format: [
      "summary",
      "progress-bar",
      "@cucumber/pretty-formatter",
      "cucumber-console-formatter",
      `html:./report/${reportName}_${getFormattedDateTime()}.html`,
      `json:./report/${reportName}_${getFormattedDateTime()}.json`,
      `message:./report/${reportName}_${getFormattedDateTime()}.ndjson`,
    ],
  };
  return params;
};
const common = {
  require: [
    "cucumber.node.js",
    "./lib/setup/setup.ts",
    "/lib/setup/failurehandler.ts",
    "./step-definitions/**/*.ts",
  ],
  requireModule: ["@babel/register", "ts-node/register"],
  publishQuiet: true,
};
// The parsed object will be passed as the parameters
// to the the world constructor.
module.exports = {
  //Environment Profiles
  //Default configurations for running cucumber tests
  //When we dont specify any profile this profile will be picked by cucumber
  default: {
    ...common,
    ...getReportFormat(),
    worldParameters: params,
  },
  //common profile for common configurations required to run cucumber tests
  common: { ...common, worldParameters: params },
 
};
