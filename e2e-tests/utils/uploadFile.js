const { launch_url } = require('../nightwatch.conf');
const { acceptModal } = require('../utils/acceptModal');
const { downloadFileToTestRunnerHost } = require('../utils/downloadFileToTestRunnerHost');

module.exports = {
  uploadFile: async function (browser) {
    // Set await browser.timeoutsImplicitWait(10000); in the test right after browser.init for this function to work
    const FILE_PATH = `${process.cwd()}/upload.csv`;
    const DOWNLOAD_URL = `${launch_url}/api/template/example/csv`;
    await downloadFileToTestRunnerHost(FILE_PATH, DOWNLOAD_URL);

    // Go to file upload
    await browser.waitForElementVisible('xpath', '//*/h1[contains(.,"Hello Voldemort")]');
    await browser.execute(function () {
      document.querySelector('a[href="/upload"]').click();
    });
    await browser.waitForElementVisible(
      'xpath',
      '//*/h1[contains(text(),"Upload your enrollment data")]'
    );

    // Upload example data from local directory
    await browser.UploadLocalFile(FILE_PATH, '#report');
    await browser.pause(5000);

    // Accept the error modal if it pops up
    await acceptModal(browser, 'Upload and correct in roster', 'No error modal appearing');

    // Accept the replace thing if there is one
    await acceptModal(browser, 'Replace data', 'No replace data button');

    await browser.waitForElementVisible('xpath', `//*/p[contains(text(),"100 children enrolled")]`);
  },
};
