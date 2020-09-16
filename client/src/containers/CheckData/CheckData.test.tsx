import React from 'react';
import { waitFor } from '@testing-library/react';
import { Child, FundingSource } from '../../shared/models';
import CheckData from './CheckData';
import { accessibilityTestHelper, snapshotTestHelper } from '../../testHelpers';

// mock react-router-dom useParams
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ reportId: '1' }),
}));

// mock API response to generate table data
jest.mock('../../utils/api');
import * as api from '../../utils/api';
const apiMock = api as jest.Mocked<typeof api>;
const child = {
  id: '00000000-0000-0000-0000-0000000000000',
  firstName: 'First',
  lastName: 'Last',
  enrollments: [
    {
      site: { siteName: 'Site' },
      fundings: [
        {
          fundingSpace: { source: FundingSource.CDC },
        },
      ],
    },
  ],
} as Child;

describe('CheckData', () => {
  beforeAll(() =>
    apiMock.apiGet.mockReturnValue(new Promise((resolve) => resolve([child])))
  );

  const helperOpts = {
    wrapInRouter: true,
    before: () => waitFor(() => expect(apiMock.apiGet).toBeCalled()),
  };
  snapshotTestHelper(<CheckData />, helperOpts);
  accessibilityTestHelper(<CheckData />, helperOpts);

  afterAll(() => jest.clearAllMocks());
});
