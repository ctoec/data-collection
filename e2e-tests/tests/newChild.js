const { login } = require('../utils/login');
const { navigateToRoster } = require('../utils/navigateToRoster');

// const childIdentFields = [
//   {
//     id: 'firstName',
//     value: 'New child',
//   },
//   {
//     id: 'lastName',
//     value: 'From e2e test',
//   },
//   {
//     id: 'dateOfBirth-picker-month',
//     value: '10',
//   },
//   {
//     id: 'dateOfBirth-picker-day',
//     value: '10',
//   },
//   {
//     id: 'dateOfBirth-picker-year',
//     value: '2017',
//   },
//   // TODO: FIX ID FOR BIRTH CERT RADIO BUTTONS
// ];
// const childInfoFields = [
//   {
//     id: 'raceNotDisclosed',
//     value: true,
//   },
//   {
//     // TODO: fix radio button ids
//     id: 'Unknown',
//     // TODO: make enter form data func able to handle attribute changes
//     change: {
//       attribute: 'checked',
//       value: 'true',
//     },
//     // TODO: gender-- need to indicate which option is selected
//     // TODO: fix radio button ids for disability services, dual language, foster family
//   },
// ];
// const familyAddressFields = [];
// const familyIncomeFields = [];
// const enrollmentFundingFields = [];

module.exports = {
  '@tags': ['child', 'new'],
  newChild: async function (browser) {
    // Initializes with the launch_url value set in config
    await browser.init();
    // Log in
    await login(browser, true);
    // Navigate to roster
    await navigateToRoster(browser);
    // Add child
    await browser.click('xpath', `//*/a[contains(., 'Add a record')]`);
    // TODO: deal with jwt expired error that happens when adding a child after being logged out
    await browser.waitForElementVisible('body');
    browser.assert.title('Add a child record');

    // TODO: enter info-- need to fix radio button id stuff first
    // TODO: expect that child to show up in the right place on the roster
    browser.end();
  },
};
