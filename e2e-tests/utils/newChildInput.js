module.exports = {
  childIdentFields: [
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
  ],
  childInfoFields: [
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
      getChildIndex: 2,
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
  ],
  familyAddressFields: [
    {
      id: 'street-address',
      newValue: '4 Privet Drive',
    },
    {
      id: 'town',
      newValue: 'Hartford',
    },
    {
      id: 'town',
      getChildIndex: 2,
      addTrueAttribute: 'selected',
    },
    {
      id: 'zip',
      newValue: '01234',
    },
    {
      id: 'homelessness-no',
      clickLabel: true,
    },
  ],
  familyIncomeFields: [],
  enrollmentFundingFields: [],
};
