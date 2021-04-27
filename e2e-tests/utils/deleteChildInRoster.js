const { scrollToElement } = require('./scrollToElement');
const { clickOnChildInRoster } = require('./FakeChildrenTypes');
const { navigateToRoster } = require('./navigateToRoster');

module.exports = {
  deleteChildInRoster: async function (
    browser,
    // Clicks on first child by default
    selectorArgs = [
      'xpath',
      "//*/button[@type='button' and contains(., 'Delete record')][0]",
    ],
    deleteSelectorArgs = [
      'xpath',
      "//*/button[@type='button' and contains(., 'Yes, delete record')][0]",
    ]
  ) {
    await navigateToRoster(browser);
    const childName = await clickOnChildInRoster(browser);
    if (childName) {
      await scrollToElement(browser, selectorArgs);
      await browser.click(...selectorArgs);
      await browser.click(...deleteSelectorArgs);
    }
  },
};
