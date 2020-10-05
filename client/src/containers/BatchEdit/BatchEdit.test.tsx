import React from 'react';
import BatchEdit from './BatchEdit';
import { snapshotTestHelper, accessibilityTestHelper } from '../../testHelpers';
import DataCacheContext from '../../contexts/DataCacheContext/DataCacheContext';
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
  },
];

describe('BatchEdit', () => {
  snapshotTestHelper(
    <DataCacheContext.Provider
      value={{
        children: { records: [], loading: false, addOrUpdateRecord: jest.fn() },
      }}
    >
      <BatchEdit />
    </DataCacheContext.Provider>,
    { wrapInRouter: true },
    'matches snapshot when no records are missing info'
  );

  snapshotTestHelper(
    <DataCacheContext.Provider
      value={{
        children: {
          records: children,
          loading: false,
          addOrUpdateRecord: jest.fn(),
        },
      }}
    >
      <BatchEdit />
    </DataCacheContext.Provider>,
    { wrapInRouter: true },
    'matches snapshot when >0 records are missing info'
  );

  accessibilityTestHelper(
    <DataCacheContext.Provider
      value={{
        children: { records: [], loading: false, addOrUpdateRecord: jest.fn() },
      }}
    >
      <BatchEdit />
    </DataCacheContext.Provider>,
    { wrapInRouter: true }
  );
});
