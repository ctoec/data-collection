import React from 'react';
import BatchEdit from './BatchEdit';
import { snapshotTestHelper, accessibilityTestHelper } from '../../testHelpers';
import { Child, Family } from '../../shared/models';
import moment from 'moment';
import { ValidationError } from 'class-validator';

const children: Child[] = [
  {
    id: '00000000-0000-0000-0000-000000000000',
    firstName: 'First',
    lastName: 'Last',
    birthdate: moment.utc('2019-06-01', 'YYYY-MM-DD'),
    family: {} as Family,
    validationErrors: [{} as ValidationError],
  } as Child,
];

describe('BatchEdit', () => {
  snapshotTestHelper(<BatchEdit />, {
    wrapInRouter: true,
    name: 'matches snapshot when no records are missing info',
  });

  snapshotTestHelper(<BatchEdit />, {
    wrapInRouter: true,
    name: 'matches snapshot when >0 records are missing info',
  });

  accessibilityTestHelper(<BatchEdit />, { wrapInRouter: true });
});
