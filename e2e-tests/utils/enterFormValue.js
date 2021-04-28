const { scrollToElement } = require('./scrollToElement');

module.exports = {
  enterFormValue: async function (browser, id, input) {
    const selectorArgs = ['css selector', `#${id}`];
    await scrollToElement(browser, selectorArgs);
    await browser.clearValue(...selectorArgs);
    await browser.setValue(...selectorArgs, input);
    await browser.pause(1000); // Wait for change... annoying but better than flaky tests

    //  Super hack to click somewhere else on the page to hide the calendar display
    //  In order to prevent it from keeping other elements out of view
    if (id === 'determination-date--input') {
      await browser.click('xpath', "//*/h2[contains(., 'income')]");
    }
  },
  clickFormEl: async function (browser, id, opts) {
    const { clickLabel, clickChildIndex } = opts || {};
    const selectorArgs = ['css selector', `#${id}`];
    if (clickLabel) {
      selectorArgs[1] = `label[for*=${id}]`;
    }
    await scrollToElement(browser, selectorArgs);
    if (clickChildIndex) {
      // Used for select/option
      selectorArgs[1] = `#${id} *:nth-child(${clickChildIndex})`;
    }
    await browser.click(...selectorArgs);
    await browser.pause(1000); // Wait for change... annoying but better than flaky tests
  },
  // TODO: keyboard interactivity
};
