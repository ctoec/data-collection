const { login } = require('../utils/login');
const { navigateToRoster } = require('../utils/navigateToRoster');
const { scrollToElement } = require('../utils/scrollToElement');

const childIdentFields = [
  {
    id: 'firstName',
    newValue: 'New child',
  },
  {
    id: 'lastName',
    newValue: 'From e2e test',
  },
  {
    id: 'dateOfBirth-picker-month',
    newValue: '10',
  },
  {
    id: 'dateOfBirth-picker-day',
    newValue: '10',
  },
  {
    id: 'dateOfBirth-picker-year',
    newValue: '2017',
  },
  {
    id: 'Non-US-birth-certificate',
    selectorArgs: ['css selector', 'label[for=Non-US-birth-certificate]'],
  },
];
const childInfoFields = [
  {
    id: 'raceNotDisclosed',
  },
  {
    id: 'hispanic-ethnicity-yes',
  },
  {
    id: 'gender-select',
    addTrueAttribute: 'selected',
  },
  {
    id: 'disability-yes',
  },
  {
    id: 'dual-no',
  },
  {
    id: 'foster-unknown',
  },
];
// const familyAddressFields = [];
// const familyIncomeFields = [];
// const enrollmentFundingFields = [];

module.exports = {
  '@tags': ['child', 'new'],
  newChild: async function (browser) {
    // Initializes with the launch_url value set in config
    await browser.init();
    // Log in
    await login(browser);
    // Navigate to roster
    await navigateToRoster(browser);
    // Add child
    await browser.click('xpath', `//*/a[contains(., 'Add a record')]`);
    await browser.waitForElementVisible('body');
    browser.assert.title('Add a child record');

    const setsOfInfo = [childIdentFields, childInfoFields];
    // For each of the sets of data
    for (let j = 0; j < setsOfInfo.length; j++) {
      const setOfFields = setsOfInfo[j];
      for (let i = 0; i < setOfFields.length; i++) {
        const field = setOfFields[i];
        const { id, addTrueAttribute, newValue, selectorArgs: inputSelectorArgs } = field;
        const selectorArgs = inputSelectorArgs || ['css selector', `#${id}`];
        // If addTrueAttribute, add that attribute
        await scrollToElement(browser, selectorArgs);
        if (addTrueAttribute) {
          await browser.execute(
            `document.querySelector('#${id}').setAttribute('${addTrueAttribute}', 'true');`
          );
        } else if (newValue) {
          // If the value is specified, set the value
          await browser.execute(
            `document.querySelector('#${id}').setAttribute('value', '${newValue}');`
          );
        } else {
          // If only the id is specified, click on it
          await browser.click(...selectorArgs);
        }
      }
      // Click save and wait
      browser.click('xpath', "//*/input[contains(@value,'Save')]");
    }

    // TODO: expect that child to show up in the right place on the roster
    browser.end();
  },
};
