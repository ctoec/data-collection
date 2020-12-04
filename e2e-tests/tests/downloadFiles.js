const { navigateToDataTemplate } = require('../utils/navigateToDataTemplate');
const {
  downloadTemplateOrExample,
  downloadOpts,
} = require('../utils/downloadTemplateOrExample');

async function testDownload(browser, opts) {
  await browser.init();
  await navigateToDataTemplate(browser);
  await downloadTemplateOrExample(browser, opts);
  browser.end();
}

const { templateExcel, templateCSV, exampleExcel, exampleCSV } = downloadOpts;

/**
 * NOTE: We skip this test right now because nightwatch doesn't allow
 * us to use regex matching to check string names, so we can't just
 * have a download suite that has all download tests. Instead, we
 * separate everything out into its own test and test just for
 * the existence of a file being downloaded in that run (since this
 * will have to be the requested template). Not deleting this file
 * in case we use it later.
 */
module.exports = {
  // Need to skip this in edge and ie because testing download functionality with browserstack doesn't work in those browsers
  // https://www.browserstack.com/docs/automate/selenium/test-file-download
  '@disabled': true,
  '@tags': ['download', 'skip-edge'],
  downloadExcelTemplate: async function (browser) {
    await testDownload(browser, templateExcel);
  },
  downloadCSVTemplate: async function (browser) {
    await testDownload(browser, templateCSV);
  },
  downloadExcelExample: async function (browser) {
    await testDownload(browser, exampleExcel);
  },
  downloadCSVExample: async function (browser) {
    await testDownload(browser, exampleCSV);
  },
  checkForWrongFileName: async function (browser) {
    await testDownload(browser, {
      buttonText: templateExcel.buttonText,
      fileName: 'foo.txt',
      expect: false,
    });
  },
};
