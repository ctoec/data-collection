const { login } = require('../utils/login');
const { clickOnChildInRoster } = require('../utils/clickOnChildInRoster');
const { uploadFile } = require('../utils/uploadFile');

/**
 * TODO: Deleting a record doesn't create an alert even in the most
 * up to date local version of the app. So what we need to do is find
 * the number of children on the  roster before the delete, then
 * compare it to the number of children on the roster after the delete.
 * If the diff is 1, we gucci.
 */

module.exports = {
  '@tags': ['child', 'delete'],
  deleteChild: async function (browser) {
    await browser.init();
    await browser.timeoutsImplicitWait(10000);
    await login(browser);
    await uploadFile(browser);
    await clickOnChildInRoster(browser);

    await browser.click('xpath', "//*/button[contains(., 'Delete record')]");
    await browser.click('xpath', "//*/button[contains(., 'Yes, delete record')]");
    // TODO: change if we change alert header level
    await browser.waitForElementVisible('xpath', "//*/h2[contains(., 'Record deleted')]");

    // TODO: make sure the record deleted was the right one
    browser.end();
  },
};
