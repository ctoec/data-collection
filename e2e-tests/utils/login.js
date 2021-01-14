const { scrollToElement } = require('../utils/scrollToElement');
const { headerMatch } = require('../utils/headerMatch');
module.exports = {
  login: async function (browser, okayIfAlreadyLoggedIn = true) {
    // Click login from ECE Reporter
    await browser.click('xpath', "//*/a[contains(@href,'/login')]");
    await browser.waitForElementVisible('css selector', 'body');
    await browser.title(async function (result) {
      if (!okayIfAlreadyLoggedIn) {
        await browser.assert.title('IdentityServer4');
      }
      // If we didn't go to login page, we must already be logged in
      // Just verify the correct landing page and we're done
      else if (result.value !== 'IdentityServer4') {
        console.log('Already logged in');
        // At this point it will either be "Hello Voldemort" or "Your data is complete"
        return;
      }
    });

    // Enter username and password
    await browser.setValue('css selector', '#Username', 'voldemort');
    await browser.setValue('css selector', '#Password', 'thechosenone');
    await browser.click('xpath', "//*/button[contains(@value,'login')]");

    // Enforce waiting for the login page to disappear before
    // giving time for the new page (whatever it is) to appear
    // One of our fail reasons was not getting a clear page
    // transition.
    await browser.waitForElementNotPresent(
      'xpath',
      "//*/button[contains(@value,'login')]"
    );
    await browser.waitForElementVisible('body');

    // Accept the confidentiality agreement if we need to for this run
    const confidentialityBoxArgs = [
      'css selector',
      'input#confidentiality-checkbox',
    ];
    await browser.element(...confidentialityBoxArgs, async (result) => {
      if (result.state === 'success') {
        console.log('Need to accept agreement');
        await scrollToElement(browser, confidentialityBoxArgs, false);

        // For reasons I do not understand because selenium, the
        // checkbox on the agreement page gets interpreted as
        // "non-interactable", so need to use direct JS injection
        // to click, like in scrollToElement
        await browser.execute(
          `document.querySelector('input#confidentiality-checkbox').click()`
        );
        const continueButtonArgs = [
          'xpath',
          "//*/button[contains(.,'Continue to ECE Reporter')]",
        ];
        await browser.waitForElementVisible(...continueButtonArgs);
        await browser.click(...continueButtonArgs);
        console.log('Accepted confidentiality agreement');
      } else {
        console.log('Confidentiality agreement already accepted');
      }
    });

    // Check to see if we logged in and the title has been changed
    // Use 'main' instead of 'body' here because the body element
    // captures the 'ECE Reporter' at the top of the page and parses
    // that as a title (was another fail reason)
    await browser.waitForElementVisible('main');
    await headerMatch(browser, 'Hello Voldemort!');
  },
};
