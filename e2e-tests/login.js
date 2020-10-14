module.exports = {
  '@tags': ['login'],
  login: async function (browser) {
    // Initializes with the launch_url value set in config
    await browser.init();

    // Click login from ECE Reporter
    await browser.click('xpath', "//*/a[contains(@href,'/login')]");
    await browser.waitForElementVisible('css selector', 'body');
    browser.assert.title('IdentityServer4');

    // Enter username and password
    await browser.setValue('css-selector', '#Username', 'voldemort');
    await browser.setValue('css-selector', '#Password', 'thechosenone');
    await browser.click('xpath', "//*/button[contains(@value,'login')]");

    // Check to see if we logged in and the title has been changed
    await browser.waitForElementVisible('body');
    browser.assert.title('Getting started');
    browser.end();
  },
};
