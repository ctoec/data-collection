const { makeSureNavIsOpen } = require('./makeSureNavIsOpen');

module.exports = {
  navigateToRoster: async function (browser) {
    await makeSureNavIsOpen(browser);
    await browser.click('xpath', "//*/a[contains(@href,'/roster')]");
    const rosterHeaderArgs = [
      'xpath',
      '//*/p[contains(text()," children enrolled at ")]',
    ];
    await browser.waitForElementVisible(...rosterHeaderArgs);
  },
};
