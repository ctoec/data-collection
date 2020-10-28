const { login } = require('../utils/login');
const { navigateToRoster } = require('../utils/navigateToRoster');
const {
  clickOnFirstChildInRoster,
} = require('../utils/clickOnFirstChildInRoster');

module.exports = {
  '@tags': ['child', 'delete'],
  deleteChild: async function (browser) {
    await browser.init();
    await login(browser);
    await navigateToRoster(browser);
    await clickOnFirstChildInRoster(browser);

    await browser.click('xpath', "//*/button[contains(., 'Delete record')]");
    await browser.click(
      'xpath',
      "//*/button[contains(., 'Yes, delete record')]"
    );
    // TODO: change if we change alert header level
    await browser.waitForElementVisible(
      'xpath',
      "//*/h2[contains(., 'Record deleted')]"
    );

    // TODO: make sure the record deleted was the right one
    browser.end();
  },
};
