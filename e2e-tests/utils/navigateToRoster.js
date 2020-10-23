const { makeSureNavIsOpen } = require('./makeSureNavIsOpen');

module.exports = {
  navigateToRoster: async function (browser) {
    await makeSureNavIsOpen(browser);
    await browser.click('xpath', "//*/a[contains(@href,'/roster')]");
    await browser.waitForElementVisible('css selector', 'body');
  },
};
