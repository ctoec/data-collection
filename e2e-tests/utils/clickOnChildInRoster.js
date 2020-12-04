const { scrollToElement } = require('./scrollToElement');

module.exports = {
  clickOnChildInRoster: async function (browser, selectorArgs) {
    // Clicks on first child by default
    const childLinkSelectorArgs = selectorArgs || [
      ('xpath', "//*/a[contains(@href,'/edit-record')][1]"),
    ];
    await scrollToElement(browser, childLinkSelectorArgs);
    await browser.click(...childLinkSelectorArgs);
    await browser.waitForElementVisible('xpath', `//*/h1[contains(., 'Edit record')]`);
    browser.assert.title('Edit record');
    // TODO: make ticket to deal with jwt expired error that happens when adding a child after being logged out
  },
};
