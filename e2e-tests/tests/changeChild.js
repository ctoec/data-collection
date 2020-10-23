const { login } = require('../utils/login');
const { navigateToRoster } = require('../utils/navigateToRoster');
const { clickOnFirstChildInRoster } = require('../utils/clickOnFirstChildInRoster');
const { scrollToElement } = require('../utils/scrollToElement');

module.exports = {
  '@tags': ['child', 'change'],
  changeChild: async function (browser) {
    await browser.init();
    await login(browser);
    await navigateToRoster(browser);
    await clickOnFirstChildInRoster(browser);

    const firstNameSelectorArgs = ['css selector', 'input#firstName'];
    await scrollToElement(browser, firstNameSelectorArgs);
    let initialFirstName;
    await browser.getAttribute(...firstNameSelectorArgs, 'value', (res) => {
      initialFirstName = res.value;
    });

    const newFirstNameText = 'New first name';
    await browser.clearValue(...firstNameSelectorArgs);
    await browser.setValue(...firstNameSelectorArgs, newFirstNameText);
    await browser.pause(2000); // Wait for change
    const saveButtonArgs = ['xpath', "//*/input[contains(@value,'Save')]"];
    await scrollToElement(browser, saveButtonArgs);
    await browser.click(...saveButtonArgs);
    await scrollToElement(browser, ['css selector', 'header']);
    // TODO: change if we change alert header level
    await browser.waitForElementVisible('xpath', "//*/h2[contains(., 'Record updated')]");

    // Then navigate to roster and see if that text is on the roster
    await navigateToRoster(browser);
    const tableArgs = ['xpath', '//*/table[1]'];
    await scrollToElement(browser, tableArgs);
    browser.assert.containsText('table', newFirstNameText);
    browser.end();
  },
};
