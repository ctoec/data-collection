const { launch_url } = require('../nightwatch.conf');

module.exports = {
  uploadFile: async function (browser) {
    const FILE_PATH = `${process.cwd()}/upload.csv`;
    const DOWNLOAD_URL = `${launch_url}/api/template/example/csv`;
    await downloadFileToTestRunnerHost(FILE_PATH, DOWNLOAD_URL);

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
    await browser.UploadLocalFile(FILE_PATH, '#report');

    // Accept the error modal if it pops up
    await acceptModal(browser, 'Upload and correct in roster', 'No error modal appearing');

    // Accept the replace thing if there is one
    await acceptModal(browser, 'Replace data', 'No replace data button');

    await browser.waitForElementVisible('xpath', `//*/p[contains(text(),"100 children enrolled")]`);
  },
};
