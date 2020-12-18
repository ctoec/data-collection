const { launch_url } = require('../nightwatch.conf');
const { acceptModal } = require('../utils/acceptModal');
const {
  downloadFileToTestRunnerHost,
} = require('../utils/downloadFileToTestRunnerHost');

module.exports = {
  uploadFile: async function (browser, whichFile = 'complete') {
    // Set await browser.timeoutsImplicitWait(10000); in the test right after browser.init for this function to work
    const FILE_PATH = `${process.cwd()}/upload.csv`;
    let DOWNLOAD_URL = `${launch_url}`;
    if (whichFile === 'complete') {
      // FILE_PATH += '/upload.csv';
      DOWNLOAD_URL += '/api/template/example/csv';
    } else if (whichFile === 'missingSome') {
      // FILE_PATH += ''
      DOWNLOAD_URL += '/api/template/example/csv?whichFakeChildren=missingSome';
    } else if (whichFile === 'missingOne') {
      DOWNLOAD_URL += '/api/template/example/csv?whichFakeChildren=missingOne';
    }

    const isCompleteTestRun = whichFile === 'complete';

    await downloadFileToTestRunnerHost(FILE_PATH, DOWNLOAD_URL);

    // Go to file upload
    await browser.waitForElementVisible(
      'xpath',
      '//*/h1[contains(.,"Hello Voldemort")]'
    );
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
    await acceptModal(
      browser,
      'Upload and correct in roster',
      'No error modal appearing',
      !isCompleteTestRun
    );

    // Accept the replace thing if there is one
    await acceptModal(browser, 'Replace data', 'No replace data button');

    if (isCompleteTestRun) {
      await browser.waitForElementVisible(
        'xpath',
        `//*/p[contains(text(),"20 children enrolled")]`
      );
    } else {
      await browser.waitForElementVisible(
        'xpath',
        `//*/p[conntains(text(),"You'll need to add required info for")]`
      );
    }
  },
};
