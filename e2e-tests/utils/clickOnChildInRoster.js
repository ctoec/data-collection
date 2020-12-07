const { scrollToElement } = require('./scrollToElement');

module.exports = {
  clickOnChildInRoster: async function (
    browser,
    // Clicks on first child by default
    selectorArgs = ['xpath', "//*/a[contains(@href,'/edit-record')][1]"]
  ) {
    await scrollToElement(browser, selectorArgs);
    await browser.click(...selectorArgs);
    await browser.waitForElementVisible('xpath', `//*/h1[contains(., 'Edit record')]`);
    browser.assert.title('Edit record');
  },
};
