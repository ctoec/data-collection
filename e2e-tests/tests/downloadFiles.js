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

module.exports = {
  // Need to skip this in edge and ie because testing download functionality with browserstack doesn't work in those browsers
  // https://www.browserstack.com/docs/automate/selenium/test-file-download
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
