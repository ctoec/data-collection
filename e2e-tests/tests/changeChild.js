const { login } = require('../utils/login');
const { navigateToRoster } = require('../utils/navigateToRoster');
const {
  clickOnFirstChildInRoster,
} = require('../utils/clickOnFirstChildInRoster');
const { scrollToElement } = require('../utils/scrollToElement');
const { enterFormData } = require('../utils/enterFormData');

module.exports = {
  '@tags': ['child', 'change'],
  changeChild: async function (browser) {
    await browser.init();
    await login(browser, true);
    await navigateToRoster(browser);
    await clickOnFirstChildInRoster(browser);

    const firstNameSelectorArgs = ['css selector', 'input#firstName'];
    const newFirstNameText = 'New first name';
    await enterFormData(browser, firstNameSelectorArgs, newFirstNameText);

    const saveButtonArgs = ['xpath', "//*/input[contains(@value,'Save')]"];
    await scrollToElement(browser, saveButtonArgs);
    await browser.click(...saveButtonArgs);
    await scrollToElement(browser, ['css selector', 'header']);
    // TODO: change if we change alert header level
    await browser.waitForElementVisible(
      'xpath',
      "//*/h2[contains(., 'Record updated')]"
    );

    await navigateToRoster(browser);

    // We've changed/expanded the table header, so access the
    // changed child and check if the form field has the
    // correct value isntead
    await clickOnFirstChildInRoster(browser);
    browser.expect
      .element('input#firstName')
      .to.have.value.which.contains(newFirstNameText);
    browser.end();
  },
};
