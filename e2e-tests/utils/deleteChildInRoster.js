const { scrollToElement } = require('./scrollToElement');
const { clickOnChildInRoster } = require('./clickOnChildInRoster');
const { navigateToRoster } = require('./navigateToRoster');

module.exports = {
  deleteChildInRoster: async function (
    browser,
    // delete on first child by default
    selectorArgs = [
      'xpath',
      "//*/button[@type='button' and contains(., 'Delete record')][1]",
    ],
    deleteSelectorArgs = [
      'xpath',
      "//*/button[@type='button' and contains(., 'Yes, delete record')][1]",
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
