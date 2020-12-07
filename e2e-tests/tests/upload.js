const { login } = require('../utils/login');
const { acceptModal } = require('../utils/acceptModal');
const { downloadFileToTestRunnerHost } = require('../utils/downloadFileToTestRunnerHost');
const { uploadFile } = require('../utils/uploadFile');

module.exports = {
  '@tags': ['upload'],
  // uploadWrongFormat: async function (browser) {},
  // uploadMissingInfo: async function (browser) {},
  uploadCompleteInfo: async function (browser) {
    await browser.init();
    await browser.timeoutsImplicitWait(10000);
    // Log in
    await login(browser);
    await uploadFile(browser);

    browser.end();
  },
};
