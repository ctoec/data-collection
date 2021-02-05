const { FakeChildrenTypes } = require('../utils/FakeChildrenTypes');
const { login } = require('../utils/login');
const { uploadFile } = require('../utils/uploadFile');

module.exports = {
  '@tags': ['upload', 'conditional'],
  uploadMissingConditional: async function (browser) {
    await browser.init();
    await browser.timeoutsImplicitWait(10000);
    await login(browser);
    await uploadFile(browser, FakeChildrenTypes.MISSING_CONDITIONAL);
    // We have 8 conditional fields, so every uploaded child
    // should flag as having an error
    // Need this disgusting xpath selector because the missing info
    // alert text is nested in a way that selenium does not like AT ALL
    await browser.waitForElementVisible(
      'xpath',
      `//*/div[@class='usa-alert__body grid-col flex-fill']/p[@class='usa-alert__text' and contains(string(),'missing') and contains(string(),'8')]`
    );
    browser.end();
  },
};
