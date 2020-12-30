const { login } = require('../utils/login');
const { navigateToRoster } = require('../utils/navigateToRoster');
const { enterFormSection } = require('../utils/enterFormValue');
const { headerMatch } = require('../utils/headerMatch');
const newChildInput = require('../utils/newChildInput');

module.exports = {
  '@tags': ['child', 'new'],
  newChild: async function (browser) {
    // Initializes with the launch_url value set in config
    await browser.init();
    // Log in
    await login(browser);
    // Navigate to roster
    await navigateToRoster(browser);
    // Add child
    await browser.click('xpath', `//*/a[contains(., 'Add a record')]`);
    await browser.waitForElementVisible('body');
    browser.assert.title('Add a child record');

    const setsOfInfo = Object.values(newChildInput);

    // For each of the sets of data
    for (let j = 0; j < setsOfInfo.length; j++) {
      const setOfFields = setsOfInfo[j];
      await enterFormSection(browser, setOfFields);
      // Click save and wait
      await browser.click('css selector', 'input[value^=Save]');
      await browser.pause(1000);
    }

    await browser.waitForElementVisible('main');
    await headerMatch(browser, 'Hogwarts Childcare');

    browser.end();
  },
  newIncompleteChild: async function (browser) {
    // Initializes with the launch_url value set in config
    await browser.init();
    // Log in
    await login(browser);
    // Navigate to roster
    await navigateToRoster(browser);
    // Add child
    await browser.click('xpath', `//*/a[contains(., 'Add a record')]`);
    await browser.waitForElementVisible('body');
    browser.assert.title('Add a child record');

    // All but the first name
    const childInfoSection = newChildInput.childIdentFields.slice(0);
    await enterFormSection(browser, childInfoSection);
    // Click save and wait
    await browser.click('css selector', 'input[value^=Save]');
    await browser.pause(1000);

    // Expect three span elements with the class usa-error-message
    await browser.elements('css selector', 'span.usa-error-message', (res) => {
      console.log(res);
    });
    browser.end();
  },
};
