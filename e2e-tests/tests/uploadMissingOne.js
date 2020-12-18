const { login } = require('../utils/login');
const { uploadFile } = require('../utils/uploadFile');

module.exports = {
  '@tags': ['upload', 'missing-one'],
  // uploadWrongFormat: async function (browser) {},
  // uploadMissingInfo: async function (browser) {},
  uploadMissingOne: async function (browser) {
    await browser.init();
    await browser.timeoutsImplicitWait(10000);
    await login(browser);
    await uploadFile(browser, 'missingOne');
    browser.end();
  },
};
