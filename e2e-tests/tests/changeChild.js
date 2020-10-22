const { login } = require('../utils/login');
const { navigateToRoster } = require('../utils/navigateToRoster');
const { clickOnFirstChildInRoster } = require('../utils/clickOnFirstChildInRoster');

module.exports = {
  '@tags': ['child', 'change-child'],
  changeChild: async function (browser) {
    await browser.init();
    await login(browser);
    await navigateToRoster(browser);
    const childFirstNameEl = await clickOnFirstChildInRoster(browser);
    console.log(childFirstNameEl);

    // await browser.click('xpath', "//*/button[contains(., 'Delete record')]");
    // await browser.click('xpath', "//*/button[contains(., 'Yes, delete record')]");
    // await browser.element('xpath', "//*/h2[contains(., 'Record deleted')]");
    browser.end();
  },
};
