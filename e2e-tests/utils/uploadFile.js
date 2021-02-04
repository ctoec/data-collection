const { launch_url } = require('../nightwatch.conf');
const { FakeChildrenTypes } = require('./FakeChildrenTypes');
const { acceptModal } = require('../utils/acceptModal');
const {
  downloadFileToTestRunnerHost,
} = require('../utils/downloadFileToTestRunnerHost');

module.exports = {
  uploadFile: async function (browser, whichFile = 'complete') {
    // Set await browser.timeoutsImplicitWait(10000); in the test right after browser.init for this function to work
    const FILE_PATH = `${process.cwd()}/upload.csv`;

    // Pick the download url based on which kind of upload test we want to run
    let DOWNLOAD_URL = `${launch_url}`;
    if (whichFile === 'complete') {
      DOWNLOAD_URL += '/api/template/example/csv';
    } else if (whichFile === FakeChildrenTypes.MISSING_SOME) {
      DOWNLOAD_URL += '/api/template/example/csv?whichFakeChildren=missingSome';
    } else if (whichFile === FakeChildrenTypes.MISSING_ONE) {
      DOWNLOAD_URL += '/api/template/example/csv?whichFakeChildren=missingOne';
    } else if (whichFile === FakeChildrenTypes.MISSING_OPTIONAL) {
      DOWNLOAD_URL +=
        '/api/template/example/csv?whichFakeChildren=missingOptional';
    } else if (whichFile === FakeChildrenTypes.MISSING_CONDITIONAL) {
      DOWNLOAD_URL +=
        '/api/template/example/xlsx?whichFakeChildren=missingConditional';
    }

    const isCompleteTestRun = whichFile === 'complete';
    const isMissingOptionalRun =
      whichFile === FakeChildrenTypes.MISSING_OPTIONAL;

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
      !(isCompleteTestRun || isMissingOptionalRun)
    );

    // Accept the replace thing if there is one
    await acceptModal(browser, 'Replace data', 'No replace data button');

    // Resulting alert will depend on whether we uploaded complete or incomplete data
    if (isCompleteTestRun) {
      await browser.waitForElementVisible(
        'xpath',
        `//*/p[contains(text(),"20 children enrolled")]`
      );
    } else if (isMissingOptionalRun) {
      await browser.waitForElementVisible(
        'xpath',
        `//*/p[contains(text(),"10 children enrolled")]`
      );
    } else {
      await browser.waitForElementVisible(
        'xpath',
        `//*/h2[contains(.,'Update your roster')]`
      );
    }
  },
};
