const { scrollToElement } = require('./scrollToElement');

module.exports = {
  enterFormValue: async function (browser, id, input) {
    const selectorArgs = ['css selector', `#${id}`];
    await scrollToElement(browser, selectorArgs);
    await browser.clearValue(...selectorArgs);
    await browser.setValue(...selectorArgs, input);
    await browser.pause(1000); // Wait for change... annoying but better than flaky tests
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
  enterFormSection: async function (browser, setOfFields) {
    // To enter one of the sections in nweChildInput
    for (let i = 0; i < setOfFields.length; i++) {
      const field = setOfFields[i];
      const { id, newValue } = field;
      if (newValue) {
        // If the value is specified, set the value
        await enterFormValue(browser, id, newValue);
      } else {
        // Otherwise click on it
        await clickFormEl(browser, id, field);
      }
    }
  },
  // TODO: keyboard interactivity
};
