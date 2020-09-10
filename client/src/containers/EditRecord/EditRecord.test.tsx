import React from 'react';
import EditRecord from './EditRecord';
import { accessibilityTestHelper, snapshotTestHelper } from '../../testHelpers';

jest.mock('../../utils/api');
import * as api from '../../utils/api';
import { waitFor } from '@testing-library/react';
const apiMock = api as jest.Mocked<typeof api>;

const rowData = {
  id: '00000000-0000-0000-0000-000000000000',
  firstName: 'First',
  lastName: 'Last',
  enrollments: [],
  family: {
    id: 1,
    incomeDeterminations: [],
  },
};
describe('EditRecord', () => {
  beforeAll(() =>
    apiMock.apiGet.mockReturnValue(new Promise((resolve) => resolve(rowData)))
  );

  const helperOpts = {
    wrapInRouter: true,
    before: () => waitFor(() => expect(apiMock.apiGet).toBeCalled()),
  };
  snapshotTestHelper(<EditRecord />, helperOpts);
  accessibilityTestHelper(<EditRecord />, helperOpts);

  afterAll(() => jest.clearAllMocks());
});
