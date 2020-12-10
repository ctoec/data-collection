const { makeSureNavIsOpen } = require('./makeSureNavIsOpen');

module.exports = {
  navigateToDataTemplate: async function (browser) {
    await makeSureNavIsOpen(browser);
    await browser.click('xpath', "//*/a[contains(@href,'/template')]");
    const templatePageTitle = 'File upload data template';
    await browser.waitForElementVisible(
      'xpath',
      `//*/h1[contains(text(), '${templatePageTitle}')]`
    );
  },
};
