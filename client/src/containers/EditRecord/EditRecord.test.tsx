import React from 'react';
import EditRecord from './EditRecord';
import { accessibilityTestHelper, snapshotTestHelper } from '../../testHelpers';
import DataCacheContext, {
  DataCacheContextType,
  ReadOnlyDataCache,
} from '../../contexts/DataCacheContext/DataCacheContext';
import {
  FundingSpace,
  ReportingPeriod,
  Child,
  Organization,
} from '../../shared/models';

const child = {
  id: '00000000-0000-0000-0000-000000000000',
  firstName: 'First',
  lastName: 'Last',
  organization: { id: 1 } as Organization,
  enrollments: [],
  family: {
    id: 1,
    incomeDeterminations: [],
  },
} as Child;

const cache = {
  children: {
    records: [child],
    loading: false,
    getRecordById: () => child,
    addOrUpdateRecord: jest.fn(),
    removeRecordById: jest.fn(),
    refetch: jest.fn(),
  },
  fundingSpaces: {} as ReadOnlyDataCache<FundingSpace>,
  reportingPeriods: {} as ReadOnlyDataCache<ReportingPeriod>,
} as DataCacheContextType;

describe('EditRecord', () => {
  snapshotTestHelper(
    <DataCacheContext.Provider value={cache}>
      <EditRecord />
    </DataCacheContext.Provider>,
    { wrapInRouter: true }
  );
  accessibilityTestHelper(
    <DataCacheContext.Provider value={cache}>
      <EditRecord />
    </DataCacheContext.Provider>,
    { wrapInRouter: true }
  );
});
