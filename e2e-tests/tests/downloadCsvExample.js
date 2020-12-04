const { navigateToDataTemplate } = require('../utils/navigateToDataTemplate');
const {
  downloadTemplateOrExample,
  buttonTexts,
} = require('../utils/downloadTemplateOrExample');

module.exports = {
  // Need to skip this in edge and ie because testing download functionality with browserstack doesn't work in those browsers
  // https://www.browserstack.com/docs/automate/selenium/test-file-download
  '@tags': ['download-csv-example', 'skip-edge'],
  downloadCSVExample: async function (browser) {
    opts = {
      buttonText: buttonTexts.exampleCSV,
      expect: true,
    };
    await browser.init();
    await navigateToDataTemplate(browser);
    await downloadTemplateOrExample(browser, opts);
    browser.end();
  },
};
