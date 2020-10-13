import React from 'react';
import BatchEdit from './BatchEdit';
import { snapshotTestHelper, accessibilityTestHelper } from '../../testHelpers';
import DataCacheContext, {
  ReadOnlyDataCache,
  ReadWriteDataCache,
} from '../../contexts/DataCacheContext/DataCacheContext';
import {
  Child,
  Family,
  FundingSpace,
  ReportingPeriod,
} from '../../shared/models';
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

const cacheContext = {
  children: {
    records: [],
    loading: false,
    refetch: jest.fn(),
    addOrUpdateRecord: jest.fn(),
    getRecordById: jest.fn(),
    removeRecordById: jest.fn(),
  },
  fundingSpaces: {} as ReadOnlyDataCache<FundingSpace>,
  reportingPeriods: {} as ReadOnlyDataCache<ReportingPeriod>,
};

describe('BatchEdit', () => {
  snapshotTestHelper(
    <DataCacheContext.Provider value={cacheContext}>
      <BatchEdit />
    </DataCacheContext.Provider>,
    {
      wrapInRouter: true,
      name: 'matches snapshot when no records are missing info',
    }
  );

  snapshotTestHelper(
    <DataCacheContext.Provider
      value={{
        ...cacheContext,
        children: {
          records: children,
          loading: false,
          addOrUpdateRecord: jest.fn(),
          getRecordById: () => children[0],
          refetch: jest.fn(),
          removeRecordById: jest.fn(),
        },
      }}
    >
      <BatchEdit />
    </DataCacheContext.Provider>,
    {
      wrapInRouter: true,
      name: 'matches snapshot when >0 records are missing info',
    }
  );

  accessibilityTestHelper(
    <DataCacheContext.Provider value={cacheContext}>
      <BatchEdit />
    </DataCacheContext.Provider>,
    { wrapInRouter: true }
  );
});
