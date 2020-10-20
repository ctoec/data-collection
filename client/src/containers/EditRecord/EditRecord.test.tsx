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

jest.mock('../../utils/api');
import * as api from '../../utils/api';
import { waitFor } from '@testing-library/dom';
const apiMock = api as jest.Mocked<typeof api>;
const waitFetchChild = () => waitFor(() => expect(apiMock.apiGet).toBeCalled());

describe('EditRecord', () => {
  beforeEach(() => {
    apiMock.apiGet.mockReturnValue(new Promise((resolve) => resolve(child)));
  });
  snapshotTestHelper(
    <DataCacheContext.Provider value={cache}>
      <EditRecord />
    </DataCacheContext.Provider>,
    { wrapInRouter: true, before: waitFetchChild }
  );
  accessibilityTestHelper(
    <DataCacheContext.Provider value={cache}>
      <EditRecord />
    </DataCacheContext.Provider>,
    { wrapInRouter: true, before: waitFetchChild }
  );
  afterEach(() => jest.clearAllMocks());
});
