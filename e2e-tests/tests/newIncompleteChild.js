const { login } = require('../utils/login');
const { navigateToRoster } = require('../utils/navigateToRoster');
const { enterFormSection } = require('../utils/enterFormSection');
const newChildInput = require('../utils/newChildInput');

module.exports = {
  '@tags': ['child', 'new', 'incomplete'],
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
    const childInfoSection = newChildInput.childIdentFields.slice(1);
    await enterFormSection(browser, childInfoSection);
    // Click save and wait
    await browser.click('css selector', 'input[value^=Save]');
    await browser.pause(1000);

    // Expect one span element with the class usa-error-message
    browser.expect.elements('span.usa-error-message').count.to.equal(1);
    browser.end();
  },
};
