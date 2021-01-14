module.exports = {
  '@tags': ['smoke'],
  smoke: async function (browser) {
    await browser.init();
    await browser.waitForElementVisible('body');
    browser.assert.titleContains('Welcome to ECE Reporter').end();
  },
};
