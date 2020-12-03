const { login } = require('../utils/login');
const { navigateToRoster } = require('../utils/navigateToRoster');
const { scrollToElement } = require('../utils/scrollToElement');
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
        const { id, newValue, clickLabel, getChildIndex } = field;
        const selectorArgs = ['css selector', `#${id}`];

        if (clickLabel) {
          selectorArgs[1] = `label[for=${id}]`;
        }
        if (getChildIndex) {
          selectorArgs[1] = `#${id} *:nth-child(${getChildIndex})`;
        }

        await scrollToElement(browser, selectorArgs);
        if (newValue) {
          // If the value is specified, set the value
          await browser.setValue(...selectorArgs, newValue);
        } else {
          // Click on whatever is specified by the selector args
          await browser.click(...selectorArgs);
        }
        await browser.pause(500);
      }
      // Click save and wait
      await browser.click('css selector', 'input[value^=Save]');
      await browser.pause(1000);
      // TODO: assert that there are no fields with error messages
    }

    // TODO: expect that child to show up in the right place on the roster
    browser.end();
  },
};
