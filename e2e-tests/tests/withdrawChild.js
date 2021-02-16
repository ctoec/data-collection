const { login } = require('../utils/login');
const { clickOnChildInRoster } = require('../utils/clickOnChildInRoster');
const { enterFormValue, clickFormEl } = require('../utils/enterFormValue');
const { uploadFile } = require('../utils/uploadFile');
const { scrollToElement } = require('../utils/scrollToElement');
const { UploadFileTypes } = require('../utils/UploadFileTypes');

module.exports = {
  '@tags': ['child', 'withdraw'],
  withdrawChild: async function (browser) {
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
    await browser.click('xpath', "//*/button[contains(., 'Withdraw')]");

    // Fill out the withdraw modal form with acceptable values
    await enterFormValue(browser, 'end-date-month', 1);
    await enterFormValue(browser, 'end-date-day', 10);
    await enterFormValue(browser, 'end-date-year', 2020);
    await clickFormEl(browser, 'exit-reason', { clickChildIndex: 3 });
    const lastReportingPeriodArgs = ['css selector', '#last-reporting-period'];
    await scrollToElement(browser, lastReportingPeriodArgs);
    await clickFormEl(browser, 'last-reporting-period', {
      clickChildIndex: 12,
    });

    // Nightwatch has an issue scrolling with the modal because there's a dropdown
    // input with options extending "over" the button so need direct injection
    // to click it
    await browser.execute(function () {
      document.querySelector('input[value="Withdraw"]').click();
    }, []);

    // These two elements say the withdraw happened when the alert appears
    await browser.waitForElementVisible(
      'xpath',
      "//*/h2[contains(., 'Record withdrawn')]"
    );
    await browser.waitForElementVisible(
      'xpath',
      "//*/p[contains(., '19 children enrolled')]"
    );

    // This expect allows the test to end with a success code
    browser.expect.element('p.usa-alert__text').text.to.contain(lastName);
    browser.end();
  },
};
