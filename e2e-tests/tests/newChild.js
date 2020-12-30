const { login } = require('../utils/login');
const { navigateToRoster } = require('../utils/navigateToRoster');
const { enterFormValue, clickFormEl } = require('../utils/enterFormValue');
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
      for (let i = 0; i < setOfFields.length; i++) {
        const field = setOfFields[i];
        const { id, newValue } = field;
        if (newValue) {
          // If the value is specified, set the value
          await enterFormValue(browser, id, newValue);
        } else {
          // Otherwise click on it
          await clickFormEl(browser, id, field);
        }
      }
      // Click save and wait
      await browser.click('css selector', 'input[value^=Save]');
      await browser.pause(1000);
    }
    await browser.waitForElementVisible('main');
    await headerMatch(browser, 'Hogwarts Childcare');

    browser.end();
  },
  newIncompleteChild: async function (browser) {},
};
