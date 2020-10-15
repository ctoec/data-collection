const { login } = require('../utils/login');
const { navigateToRoster } = require('../utils/navigateToRoster');

module.exports = {
  '@tags': ['upload'],
  // uploadWrongFormat: async function (browser) {},
  // uploadMissingInfo: async function (browser) {},
  uploadCompleteInfo: async function (browser) {
    await browser.init();
    await browser.timeoutsImplicitWait(10000);
    // Log in
    await login(browser);
    // Go to file upload
    await browser.waitForElementVisible('xpath', '//*/h1[contains(.,"Let\'s get started")]');
    await browser.execute(function () {
      document.querySelector('a[href="/upload"]').click();
    });
    await browser.waitForElementVisible(
      'xpath',
      '//*/h1[contains(text(),"Upload your enrollment data")]'
    );

    // Upload example data from local directory
    await browser.UploadLocalFile(`${process.cwd()}/Example.xlsx`, '#report');
    // TODO: change the ID on the upload element to make more sense

    // Accept the replace thing if there is one
    const replaceDataButtonArgs = ['xpath', "//*/button[contains(.,'Replace data')]"];
    await browser.element(...replaceDataButtonArgs, async (result) => {
      if (result.state === 'success') {
        await browser.click(...replaceDataButtonArgs);
      } else {
        console.log('No replace data button', { result });
      }
    });

    // TODO: fix bug-- should be taken to roster automagically
    await navigateToRoster(browser);

    await browser.waitForElementVisible(
      'xpath',
      '//*/p[contains(text(),"50 children enrolled at 4 sites")]'
    );

    // TODO: check for the specific child names
    // Generate excel right before test? and check for those child names to be sure?

    browser.end();
  },
};
