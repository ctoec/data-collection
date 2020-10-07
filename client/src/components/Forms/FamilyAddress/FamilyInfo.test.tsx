import React from 'react';
import {
  snapshotTestHelper,
  accessibilityTestHelper,
} from '../../../testHelpers';
import { FamilyAddressForm } from './Form';
import { Child } from '../../../shared/models';
import moment from 'moment';

const child = {
  id: '00000000-0000-0000-0000-000000000000',
  firstName: 'First',
  lastName: 'Last',
  family: {
    id: 1,
    incomeDeterminations: [
      {
        id: 1,
        numberOfPeople: 3,
        income: 50000,
        determinationDate: moment.utc().add(-1, 'year'),
      },
      {
        id: 2,
        numberOfPeople: 3,
        income: 70000,
        determinationDate: moment.utc(),
      },
    ],
  },
} as Child;

describe('EditRecord', () => {
  describe('FamilyInfo', () => {
    snapshotTestHelper(
      <FamilyAddressForm
        child={child}
        afterSaveSuccess={jest.fn()}
        setAlerts={jest.fn()}
      />,
      { wrapInRouter: true }
    );

    accessibilityTestHelper(
      <FamilyAddressForm
        child={child}
        afterSaveSuccess={jest.fn()}
        setAlerts={jest.fn()}
      />,
      { wrapInRouter: true }
    );
  });
});
