const { login } = require('../utils/login');
const { clickOnChildInRoster } = require('../utils/clickOnChildInRoster');
const { enterFormValue, clickFormEl } = require('../utils/enterFormValue');
const { uploadFile } = require('../utils/uploadFile');

module.exports = {
  '@tags': ['child', 'withdraw'],
  withdrawChild: async function (browser) {
    await browser.init();
    await browser.timeoutsImplicitWait(10000);
    await login(browser);
    await uploadFile(browser);
    const clickedChildLinkText = await clickOnChildInRoster(browser);
    const lastName = clickedChildLinkText.split(',')[0];

    // Expect the edit record h1 to contain the child's last name
    await browser.verify.elementPresent({
      locateStrategy: 'xpath',
      selector: `//*/h1[contains(., '${lastName}')]`,
    });

    await browser.click('xpath', "//*/button[contains(., 'Withdraw')]");
    await enterFormValue(browser, 'end-date-month', 1);
    await enterFormValue(browser, 'end-date-day', 10);
    await enterFormValue(browser, 'end-date-year', 2030);
    await clickFormEl(browser, 'exit-reason', { clickChildIndex: 1 });
    await browser.element(
      'css selector',
      '#last-reporting-period',
      async (result) => {
        if (result.state === 'success') {
          await clickFormEl(browser, 'last-reporting-period', 12);
        }
      }
    );
    await browser.click('xpath', "//*/button[contains(., 'Withdraw')]");
    // TODO: change if we change alert header level
    await browser.waitForElementVisible(
      'xpath',
      "//*/h2[contains(., 'Record withdrawn')]"
    );
    await browser.verify.containsText(
      { locateStrategy: 'css selector', selector: '.usa-alert' },
      firstName
    );

    await browser.waitForElementVisible(
      'xpath',
      "//*/p[contains(., '19 children enrolled')]"
    );
    // Expect the first tab nav content to not have that link text in it
    await browser.assert.not.containsText(
      { locateStrategy: 'css selector', selector: '.oec-tab-nav--content' },
      clickedChildLinkText
    );
    browser.end();
  },
};
