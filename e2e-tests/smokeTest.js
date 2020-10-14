module.exports = {
  '@tags': ['smoke-test'],
  'smoke-test': async function (browser) {
    await browser.init();

    await browser.waitForElementVisible('body');

    browser.assert.titleContains('Upload your enrollment data').end();
  },
};
