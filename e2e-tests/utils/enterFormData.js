const { scrollToElement } = require('./scrollToElement');

module.exports = {
  enterFormData: async function (browser, selectorArgs, input) {
    await scrollToElement(browser, selectorArgs);
    await browser.clearValue(...selectorArgs);
    await browser.setValue(...selectorArgs, input);
    await browser.pause(5000); // Wait for change... annoying but better than flaky tests
  },
};
