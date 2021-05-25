const { makeSureNavIsOpen } = require('./makeSureNavIsOpen');

module.exports = {
  navigateToRoster: async function (browser) {
    await makeSureNavIsOpen(browser);
    await browser.click('xpath', "//*/a[contains(@href,'/roster')]");
    // Use only "enrolled at" to catch the case where there's 1 child
    // and the string "children" is not in the header!
    const rosterHeaderArgs = [
      'xpath',
      '//*/p[contains(text(),"enrolled at ")]',
    ];
    await browser.waitForElementVisible(...rosterHeaderArgs);
  },
};
