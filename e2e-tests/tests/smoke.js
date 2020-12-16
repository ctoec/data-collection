module.exports = {
  '@tags': ['smoke-test'],
  smoke: async function (browser) {
    await browser.init();

    await browser.waitForElementVisible('body');

    browser.assert.titleContains('Welcome to ECE Reporter').end();
  },
};
