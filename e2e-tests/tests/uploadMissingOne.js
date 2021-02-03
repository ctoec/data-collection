const { FakeChildrenTypes } = require('../utils/FakeChildrenTypes');
const { login } = require('../utils/login');
const { uploadFile } = require('../utils/uploadFile');

module.exports = {
  '@tags': ['upload'],
  uploadMissingOne: async function (browser) {
    await browser.init();
    await browser.timeoutsImplicitWait(10000);
    await login(browser);
    await uploadFile(browser, FakeChildrenTypes.MISSING_ONE);
    browser.end();
  },
};
