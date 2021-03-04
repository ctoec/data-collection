const { launch_url } = require('../nightwatch.conf');
const { FakeChildrenTypes } = require('./FakeChildrenTypes');
const { acceptModal } = require('../utils/acceptModal');
const {
  downloadFileToTestRunnerHost,
} = require('../utils/downloadFileToTestRunnerHost');

module.exports = {
  uploadFile,
};

async function uploadFile(
  browser,
  fileType,
  whichFile = 'complete',
  waitForHello = true
) {
  // Set await browser.timeoutsImplicitWait(10000); in the test right after browser.init for this function to work
  const FILE_PATH = `${process.cwd()}/upload.csv`;

  const downloadUrl = getDownloadUrl(whichFile, fileType);

  const isCompleteTestRun = whichFile === 'complete';
  const isMissingOptionalRun = whichFile === FakeChildrenTypes.MISSING_OPTIONAL;

  await downloadFileToTestRunnerHost(FILE_PATH, downloadUrl);

  // Go to file upload
  if (waitForHello) {
    await browser.waitForElementVisible(
      'xpath',
      '//*/h1[contains(.,"Hello Voldemort")]'
    );
  }

  await startUpload(browser, FILE_PATH);
  await acceptModal(
    browser,
    'Upload and correct in roster',
    'No error modal appearing',
    !(isCompleteTestRun || isMissingOptionalRun)
  );

  await reviewMissingInfo(browser);
  await completeUpload(browser);

  // Resulting alert will depend on whether we uploaded complete or incomplete data
  if (isCompleteTestRun) {
    await browser.waitForElementVisible(
      'xpath',
      `//*/p[contains(text(),"20 new records")]`
    );
  } else if (isMissingOptionalRun) {
    await browser.waitForElementVisible(
      'xpath',
      `//*/p[contains(text(),"10 new records")]`
    );
  } else {
    await browser.waitForElementVisible(
      'xpath',
      `//*/h2[contains(.,'Update your roster')]`
    );
  }
}

//////////////////////////////////////////////////////////////////////////

async function startUpload(browser, filePath) {
  await browser.execute(function () {
    document.querySelector('a[href="/upload"]').click();
  });
  await browser.waitForElementVisible(
    'xpath',
    '//*/h1[contains(text(),"Upload your enrollment data")]'
  );

  await browser.UploadLocalFile(filePath, '#report');
  await browser.pause(5000);
}

async function reviewMissingInfo(browser) {
  await browser.waitForElementVisible(
    'xpath',
    `//*/h2[contains(text(),'Review missing info')]`
  );

  await browser.click('xpath', "//*/button[contains(text(), 'Next')]");
  await browser.pause(15000);
}

async function completeUpload(browser) {
  await browser.waitForElementVisible(
    'xpath',
    `//*/h2[contains(.,'Preview changes and upload file')]`
  );

  await browser.click(
    'xpath',
    "//*/button[contains(text(), 'Save changes to roster')]"
  );
  await browser.pause(5000);
}

function getDownloadUrl(whichFile, fileType) {
  let DOWNLOAD_URL = `${launch_url}`;

  if (whichFile === 'complete') {
    DOWNLOAD_URL += `/api/template/example/${fileType}`;
  } else if (whichFile === FakeChildrenTypes.MISSING_SOME) {
    DOWNLOAD_URL += `/api/template/example/${fileType}?whichFakeChildren=missingSome`;
  } else if (whichFile === FakeChildrenTypes.MISSING_ONE) {
    DOWNLOAD_URL += `/api/template/example/${fileType}?whichFakeChildren=missingOne`;
  } else if (whichFile === FakeChildrenTypes.MISSING_OPTIONAL) {
    DOWNLOAD_URL += `/api/template/example/${fileType}?whichFakeChildren=missingOptional`;
  } else if (whichFile === FakeChildrenTypes.MISSING_CONDITIONAL) {
    DOWNLOAD_URL += `/api/template/example/${fileType}?whichFakeChildren=missingConditional`;
  }

  return DOWNLOAD_URL;
}
