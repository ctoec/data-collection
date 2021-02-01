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
  familyIncomeFields: [
    {
      id: 'number-of-people',
      newValue: '5',
    },
    {
      id: 'income-determination',
      newValue: '40000',
    },
    {
      id: 'determination-date--month',
      newValue: '10',
    },
    {
      id: 'determination-date--day',
      newValue: '10',
    },
    {
      id: 'determination-date--year',
      newValue: '2018',
    },
  ],
  enrollmentFundingFields: [
    {
      id: 'site',
      clickLabel: true,
    },
    {
      id: 'start-date-month',
      newValue: '10',
    },
    {
      id: 'start-date-day',
      newValue: '10',
    },
    {
      id: 'start-date-year',
      newValue: '2018',
    },
    {
      id: 'In-person',
      clickLabel: true,
    },
    {
      id: 'Preschool',
      clickLabel: true,
    },
    {
      id: 'CDC-Child-Day-Care',
      clickLabel: true,
    },
    {
      id: 'contract-space',
      clickChildIndex: 2,
    },
    {
      id: 'first-reporting-period',
      clickChildIndex: 2,
    },
  ],
};
