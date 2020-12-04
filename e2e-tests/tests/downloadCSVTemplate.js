const { navigateToDataTemplate } = require('../utils/navigateToDataTemplate');
const {
  downloadTemplateOrExample,
} = require('../utils/downloadTemplateOrExample');

module.exports = {
  '@tags': ['download', 'skip-edge'],
  downloadExcelTemplate: async function (browser) {
    await browser.init();
    await navigateToDataTemplate(browser);
    await downloadTemplateOrExample(browser, {
      buttonText: 'Download CSV template',
    });
    browser.end();
  },
};
