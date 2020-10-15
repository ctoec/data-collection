const { makeSureNavIsOpen } = require('./makeSureNavIsOpen');

module.exports = {
  navigateToRoster: async function (browser) {
    // Check to see if user is logged in and log in if they are not
    await makeSureNavIsOpen(browser);
    await browser.click('xpath', "//*/a[contains(@href,'/roster')]");
    await browser.waitForElementVisible('css selector', 'body');
  },
};
