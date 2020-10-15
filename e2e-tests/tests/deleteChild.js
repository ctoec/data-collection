const { login } = require('../utils/login');
const { navigateToRoster } = require('../utils/navigateToRoster');

module.exports = {
  '@tags': ['child', 'delete-child'],
  login: async function (browser) {
    // Initializes with the launch_url value set in config
    await browser.init();
    // await browser.windowMaximize();
    // Log in
    await login(browser);
    // Navigate to roster
    await navigateToRoster(browser);
    // Add child
    const childLinkSelectorArgs = ['xpath', "//*/a[contains(@href,'/edit-record')][1]"];
    const location = await browser.getLocation(...childLinkSelectorArgs);
    const { x, y } = location.value;
    await browser.execute(`window.scrollTo(${x},${y});`);
    await browser.waitForElementVisible(...childLinkSelectorArgs, 1000);
    await browser.click(...childLinkSelectorArgs);
    // TODO: make ticket to deal with jwt expired error that happens when adding a child after being logged out
    await browser.waitForElementVisible('xpath', `//*/h1[contains(., 'Edit record')]`);
    browser.assert.title('Edit record');
    await browser.click('xpath', "//*/button[contains(., 'Delete record')]");
    await browser.click('xpath', "//*/button[contains(., 'Yes, delete record')]");
    await browser.element('xpath', "//*/h2[contains(., 'Record deleted')]");
    browser.end();
  },
};
