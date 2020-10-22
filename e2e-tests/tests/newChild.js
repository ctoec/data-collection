const { login } = require('../utils/login');
const { navigateToRoster } = require('../utils/navigateToRoster');

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
    // TODO: deal with jwt expired error that happens when adding a child after being logged out
    await browser.waitForElementVisible('body');
    browser.assert.title('Add a child record');

    // TODO: enter info
    // TODO: expect that child to show up in the right place on the roster
    browser.end();
  },
};
