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
      // Index starts at 1 for css selectors
      clickChildIndex: 2,
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
      id: 'state',
      clickChildIndex: 2,
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
