const { login } = require('../utils/login');
const { navigateToRoster } = require('../utils/navigateToRoster');
const { clickOnFirstChildInRoster } = require('../utils/clickOnFirstChildInRoster');

module.exports = {
  '@tags': ['child', 'change'],
  changeChild: async function (browser) {
    await browser.init();
    await login(browser);
    await navigateToRoster(browser);
    await clickOnFirstChildInRoster(browser);

    const firstNameSelectorArgs = ['css selector', 'input#firstName'];
    await browser.waitForElementVisible(...firstNameSelectorArgs);
    // const val = await browser.getValue(...firstNameSelectorArgs);

    // let currentFirstName;
    // await browser.execute(async function () {
    //   return document.getElementById('firstName');
    // });

    // console.log(el);

    // await browser.click('xpath', "//*/button[contains(., 'Delete record')]");
    // await browser.click('xpath', "//*/button[contains(., 'Yes, delete record')]");
    // await browser.element('xpath', "//*/h2[contains(., 'Record deleted')]");
    browser.end();
  },
};
