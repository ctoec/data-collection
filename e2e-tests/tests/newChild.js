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
    clickLabel: true,
  },
];

const childInfoFields = [
  {
    id: 'raceNotDisclosed',
    clickLabel: true,
  },
  {
    id: 'hispanic-ethnicity-yes',
    clickLabel: true,
  },
  {
    id: 'gender-select',
    addTrueAttribute: 'selected',
  },
  {
    id: 'disability-yes',
    clickLabel: true,
  },
  {
    id: 'dual-no',
    clickLabel: true,
  },
  {
    id: 'foster-unknown',
    clickLabel: true,
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
        const { id, addTrueAttribute, newValue, clickLabel } = field;
        const selectorArgs = ['css selector', `#${id}`];
        if (clickLabel) {
          selectorArgs[1] = `label[for=${id}]`;
        }
        // If addTrueAttribute, add that attribute
        await scrollToElement(browser, selectorArgs);
        if (addTrueAttribute) {
          await browser.execute(
            `document.querySelector('#${id}').setAttribute('${addTrueAttribute}', 'true');`
          );
        } else if (newValue) {
          // If the value is specified, set the value
          await browser.setValue(...selectorArgs, newValue);
        } else {
          // If only the id is specified, click on it
          await browser.click(...selectorArgs);
        }
        await browser.pause(1000);
      }
      // Click save and wait
      await browser.click('css selector', 'input[value=Save]');
      await browser.pause(1000);
    }

    // TODO: expect that child to show up in the right place on the roster
    browser.end();
  },
};
