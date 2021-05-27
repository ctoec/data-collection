const { login } = require('../utils/login');
const { navigateToRoster } = require('../utils/navigateToRoster');
const { enterFormSection } = require('../utils/enterFormSection');
const { scrollToElement } = require ('../utils/scrollToElement');
const { headerMatch } = require('../utils/headerMatch');
const newChildInput = require('../utils/newChildInput');

module.exports = {
  '@tags': ['child', 'new'],
  newChild: async function (browser) {
    // Initializes with the launch_url value set in config
    await browser.init();

    await login(browser);
    await navigateToRoster(browser);

    const selectorArgs = ['xpath', `//*/a[contains(., 'Add a record')]`]
    await scrollToElement(browser, selectorArgs);
    await browser.click(...selectorArgs);

    await browser.waitForElementVisible('body');
    browser.assert.title('Add a child record');

    const setsOfInfo = Object.values(newChildInput);

    // For each of the sets of data
    for (let j = 0; j < setsOfInfo.length; j++) {
      const setOfFields = setsOfInfo[j];
      await enterFormSection(browser, setOfFields);
      // Click save and wait
      await browser.click('css selector', 'button[type="submit"]');
      await browser.pause(1000);
    }

    await browser.waitForElementVisible('main');
    await headerMatch(browser, 'Hogwarts Childcare');

    browser.end();
  },
};
