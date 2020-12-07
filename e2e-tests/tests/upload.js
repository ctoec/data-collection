const { login } = require('../utils/login');
const { acceptModal } = require('../utils/acceptModal');
const {
  downloadFileToTestRunnerHost,
} = require('../utils/downloadFileToTestRunnerHost');

module.exports = {
  '@tags': ['upload'],
  // uploadWrongFormat: async function (browser) {},
  // uploadMissingInfo: async function (browser) {},
  uploadCompleteInfo: async function (browser) {
    const FILE_PATH = `${process.cwd()}/upload.csv`;
    const DOWNLOAD_URL =
      'https://staging.ece-fawkes.ctoecskylight.com/api/template/example/csv';

    await downloadFileToTestRunnerHost(FILE_PATH, DOWNLOAD_URL);

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
    await acceptModal(
      browser,
      'Upload and correct in roster',
      'No error modal appearing'
    );

    // Accept the replace thing if there is one
    await acceptModal(browser, 'Replace data', 'No replace data button');

    await browser.waitForElementVisible(
      'xpath',
      `//*/p[contains(text(),"100 children enrolled")]`
    );

    // TODO: check for the specific child names
    // Generate excel right before test? and check for those child names to be sure?

    browser.end();
  },
};
