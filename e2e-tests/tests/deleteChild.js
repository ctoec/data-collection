const { login } = require('../utils/login');
const { clickOnChildInRoster } = require('../utils/clickOnChildInRoster');
const { uploadFile } = require('../utils/uploadFile');
const { UploadFileTypes } = require('../utils/UploadFileTypes');
const { clearDb } = require('../utils/clearDb');

module.exports = {

  before(browser) {
    clearDb();
  },

  '@tags': ['child', 'delete'],
  deleteChild: async function (browser) {
    try {
      await browser.init();
      await browser.timeoutsImplicitWait(10000);
      await login(browser);
      await uploadFile(browser, UploadFileTypes.CSV, 'complete', true);
      const clickedChildLinkText = await clickOnChildInRoster(browser);
      const lastName = clickedChildLinkText.split(',')[0];
      // Expect the edit record h1 to contain the child's last name
      await browser.verify.elementPresent({
        locateStrategy: 'xpath',
        selector: `//*/h1[contains(., '${lastName}')]`,
      });

      await browser.click('xpath', "//*/button[contains(., 'Delete record')]");
      await browser.click(
        'xpath',
        "//*/button[contains(., 'Yes, delete record')]"
      );
      // TODO: change if we change alert header level
      await browser.waitForElementVisible(
        'xpath',
        "//*/h2[contains(., 'Record deleted')]"
      );
      await browser.verify.containsText(
        { locateStrategy: 'css selector', selector: '.usa-alert' },
        lastName
      );

      // Expect the first tab nav content to not have that link text in it
      await browser.assert.not.containsText(
        { locateStrategy: 'css selector', selector: '.oec-tab-nav--content' },
        clickedChildLinkText
      );
    } finally {
      browser.end();
    }
  },
};
