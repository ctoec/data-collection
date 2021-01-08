const { login } = require('../utils/login');
const { uploadFile } = require('../utils/uploadFile');
const { scrollToElement } = require('../utils/scrollToElement');

module.exports = {
  '@tags': ['submit'],
  submitRoster: async function (browser) {
    // Login and upload a completed file
    await browser.init();
    await browser.timeoutsImplicitWait(10000);
    await login(browser);
    await uploadFile(browser);

    // Find and click the submit button
    const submitButtonArgs = [
      'xpath',
      "//*/button[contains(., 'data is complete')]",
    ];
    await scrollToElement(browser, submitButtonArgs);
    await browser.click(submitButtonArgs);
    await browser.waitForElementVisible(
      'xpath',
      "//*/h2[contains(., 'You completed your')]"
    );

    // Now go back to the home page to make sure it updated
    await browser.click('xpath', "//*/a[contains(@href,'/home')]");
    await browser.waitForElementVisible('main');
    await headerMatch(browser, 'Your data is complete!');
    browser.end();
  },
};
