const { login } = require('../utils/login');
const { navigateToRoster } = require('../utils/navigateToRoster');
const { enterFormSection } = require('../utils/enterFormSection');
const newChildInput = require('../utils/newChildInput');

module.exports = {
  '@tags': ['child', 'new', 'incomplete'],
  newIncompleteChild: async function (browser) {
    // Initializes with the launch_url value set in config
    await browser.init();

    await login(browser);
    await navigateToRoster(browser);

    const selectorArgs = ['xpath', `//*/a[contains(., 'Add a record')]`]
    await scrollToElement(browser, selectorArgs, false);
    await browser.click(...selectorArgs);
    
    await browser.waitForElementVisible('body');
    browser.assert.title('Add a child record');

    // All but the first name
    const childInfoSection = newChildInput.childIdentFields.slice(1);
    await enterFormSection(browser, childInfoSection);
    // Click save and wait
    await browser.click('css selector', 'button[type="submit"]');
    await browser.pause(1000);

    // Expect one span element with the class usa-error-message
    browser.expect.elements('span.usa-error-message').count.to.equal(1);
    browser.end();
  },
};
