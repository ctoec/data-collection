const { login } = require('../utils/login');
const { clickOnChildInRoster } = require('../utils/clickOnChildInRoster');
const { enterFormValue, clickFormEl } = require('../utils/enterFormValue');
const { uploadFile } = require('../utils/uploadFile');
const { scrollToElement } = require('../utils/scrollToElement');
const { UploadFileTypes } = require('../utils/UploadFileTypes');
const { clearDb } = require('../utils/clearDb');

module.exports = {

  before(browser) {
    clearDb();
  },

  '@tags': ['child', 'withdraw'],
  withdrawChild: async function (browser) {
    await browser.init();
    await browser.timeoutsImplicitWait(10000);
    await login(browser);
    await uploadFile(browser, UploadFileTypes.CSV, 'complete', true);

    await sortMissingInfoChildrenLast(browser);
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
      // woof, this is pretty yuck
      document
        .evaluate(
          '//*/button[contains(text(), "Withdraw")]',
          document,
          null,
          9, // https://developer.mozilla.org/en-US/docs/Web/API/Document/evaluate#result_types
          null
        )
        .singleNodeValue.click();
    }, []);

    // These two elements say the withdraw happened when the alert appears
    await browser.waitForElementVisible(
      'xpath',
      "//*/h2[contains(., 'Record withdrawn')]"
    );

    // This expect allows the test to end with a success code
    browser.expect.element('p.usa-alert__text').text.to.contain(lastName);
    browser.end();
  },
};

//  SUPER SORTING HACK so that children without missing info are at the top of the page,
//  because we can't withdraw children that are missing info
async function sortMissingInfoChildrenLast(browser) {
  await browser.execute(`window.scrollTo(280,900);`);
  await browser.click(
    'xpath',
    "//*/button[contains(text(), 'Missing info')][1]"
  );

  await browser.execute(`window.scrollTo(280,900);`);
  await browser.click(
    'xpath',
    "//*/button[contains(text(), 'Missing info')][1]"
  );
}
