const { makeSureNavIsOpen } = require('./makeSureNavIsOpen');

module.exports = {
  navigateToRoster: async function (browser) {
    await makeSureNavIsOpen(browser);
    await browser.click('xpath', "//*/a[contains(@href,'/roster')]");

    await browser.waitForElementVisible('xpath', '//*/p[contains(text(),"allows you to view and update the enrollment data you submitted previously")]');
  },
};
