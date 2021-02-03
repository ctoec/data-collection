const { FakeChildrenTypes } = require('../utils/FakeChildrenTypes');
const { login } = require('../utils/login');
const { uploadFile } = require('../utils/uploadFile');

module.exports = {
  '@tags': ['upload'],
  uploadMissingConditional: async function (browser) {
    await browser.init();
    await browser.timeoutsImplicitWait(10000);
    await login(browser);
    await uploadFile(browser, FakeChildrenTypes.MISSING_CONDITIONAL);
    // We have 8 conditional fields, so every uploaded child
    // should flag as having an error
    await browser.waitForElementVisible(
      'xpath',
      `//*/p[contains(.,'missing for 8 records')]`
    );
    browser.end();
  },
};
