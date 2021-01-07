const { enterFormValue, clickFormEl } = require('./enterFormValue');

module.exports = {
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
};
