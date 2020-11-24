const { login } = require('../utils/login');
const { navigateToRoster } = require('../utils/navigateToRoster');
const {
  clickOnFirstChildInRoster,
} = require('../utils/clickOnFirstChildInRoster');
const { scrollToElement } = require('../utils/scrollToElement');

module.exports = {
  '@tags': ['zip'],
  // uploadWrongFormat: async function (browser) {},
  // uploadMissingInfo: async function (browser) {},
  zipCodeParse: async function (browser) {
    const FILE_PATH = `${process.cwd()}/Zip_Code_Test.xlsx`;

    await browser.init();
    await browser.timeoutsImplicitWait(10000);
    // Log in
    await login(browser);
    // Go to file upload
    await browser.waitForElementVisible(
      'xpath',
      '//*/h1[contains(.,"Let\'s get started")]'
    );
    await browser.execute(function () {
      document.querySelector('a[href="/upload"]').click();
    });
    await browser.waitForElementVisible(
      'xpath',
      '//*/h1[contains(text(),"Upload your enrollment data")]'
    );

    // Upload example data from local directory
    // TODO: use wget in YAML to get the example file and move it into the right directory in Circle CI
    await browser.UploadLocalFile(FILE_PATH, '#report');
    // TODO: change the ID on the upload element to make more sense

    // Accept the error modal if it pops up
    const errorModalButtonArgs = [
      'xpath',
      "//*/button[contains(.,'Upload and correct in roster')]",
    ];
    await browser.element(...errorModalButtonArgs, async (result) => {
      if (result.state === 'success') {
        await browser.click(...errorModalButtonArgs);
      } else {
        console.log('No error modal appearing');
      }
    });

    // Accept the replace thing if there is one
    const replaceDataButtonArgs = [
      'xpath',
      "//*/button[contains(.,'Replace data')]",
    ];
    await browser.element(...replaceDataButtonArgs, async (result) => {
      if (result.state === 'success') {
        await browser.click(...replaceDataButtonArgs);
      } else {
        console.log('No replace data button');
      }
    });

    await browser.waitForElementVisible(
      'xpath',
      '//*/p[contains(text(),"1 child enrolled at 8 sites")]'
    );

    // TODO: check for the specific child names
    // Generate excel right before test? and check for those child names to be sure?

    await navigateToRoster(browser);
    await clickOnFirstChildInRoster(browser);
    const familyAddressArgs = ['css selector', 'button#family'];
    await scrollToElement(browser, familyAddressArgs);
    await browser.click(...familyAddressArgs);

    await browser.waitForElementVisible(
      'xpath',
      "//*/h2[contains(., 'Family Address')]"
    );
    browser.expect.element('input#zip').to.have.value.which.contains('01920');

    browser.end();
  },
};
