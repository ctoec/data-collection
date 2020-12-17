const { login } = require('../utils/login');
const { navigateToRoster } = require('../utils/navigateToRoster');
const { clickOnChildInRoster } = require('../utils/clickOnChildInRoster');
const { scrollToElement } = require('../utils/scrollToElement');
const { enterFormValue } = require('../utils/enterFormValue');
const { uploadFile } = require('../utils/uploadFile');

module.exports = {
  '@tags': ['child', 'change'],
  changeChild: async function (browser) {
    await browser.init();
    await browser.timeoutsImplicitWait(10000);
    await login(browser);
    await uploadFile(browser);
    await navigateToRoster(browser);
    await clickOnChildInRoster(browser);

    const firstNameSelectorArgs = ['css selector', 'input#firstName'];
    const newFirstNameText = 'New first name';
    await enterFormValue(browser, firstNameSelectorArgs, newFirstNameText);

    const saveButtonArgs = ['xpath', "//*/input[contains(@value,'Save')]"];
    await scrollToElement(browser, saveButtonArgs);
    await browser.click(...saveButtonArgs);
    await scrollToElement(browser, ['css selector', 'header']);
    // TODO: change if we change alert header level
    await browser.waitForElementVisible('xpath', "//*/h2[contains(., 'Record updated')]");

    await navigateToRoster(browser);
    await browser.waitForElementVisible('xpath', `//*/a[contains(., '${newFirstNameText}')]`);

    // We've changed/expanded the table header, so access the
    // changed child and check if the form field has the
    // correct value isntead
    await clickOnChildInRoster(browser);
    browser.expect.element('input#firstName').to.have.value.which.contains(newFirstNameText);
    browser.end();
  },
};
