const { scrollToElement } = require('./scrollToElement');

module.exports = {
  clickOnChildInRoster: async function (
    browser,
    // Clicks on first child by default
    selectorArgs = ['xpath', "//*/a[contains(@href,'/edit-record')][1]"]
  ) {
    await scrollToElement(browser, selectorArgs);
    const { value: childNameString } = await browser.getText(...selectorArgs);
    await browser.click(...selectorArgs);
    await browser.waitForElementVisible(
      'xpath',
      `//*/h1[contains(., 'Edit record')]`
    );
    browser.verify.title('Edit record');
    return childNameString;
  },
};
