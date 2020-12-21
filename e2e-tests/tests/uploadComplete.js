const { login } = require('../utils/login');
const { uploadFile } = require('../utils/uploadFile');

module.exports = {
  '@tags': ['upload', 'complete'],
  uploadCompleteInfo: async function (browser) {
    await browser.init();
    await browser.timeoutsImplicitWait(10000);
    await login(browser);
    await uploadFile(browser);
    browser.end();
  },
};
