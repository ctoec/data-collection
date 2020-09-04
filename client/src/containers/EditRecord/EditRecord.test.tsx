import React from 'react';
import EditRecord from './EditRecord';
import { accessibilityTestHelper, snapshotTestHelper } from '../../testHelpers';
import { BrowserRouter } from 'react-router-dom';

jest.mock('../../utils/api');
import * as api from '../../utils/api';
import { waitFor } from '@testing-library/react';
const apiMock = api as jest.Mocked<typeof api>;

const routerWrapped = (
  <BrowserRouter>
    <EditRecord />
  </BrowserRouter>
);

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
  beforeAll(() => {
    apiMock.apiGet.mockReturnValue(new Promise((resolve) => resolve(rowData)));
  });
  const afterGet = () => waitFor(() => expect(apiMock.apiGet).toBeCalled());
  snapshotTestHelper(routerWrapped, afterGet);
  accessibilityTestHelper(routerWrapped, afterGet);
  afterAll(() => jest.clearAllMocks());
});
