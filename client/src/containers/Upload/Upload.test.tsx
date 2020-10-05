import React from 'react';
import { snapshotTestHelper, accessibilityTestHelper } from '../../testHelpers';
import Upload from './Upload';

jest.mock('../../utils/api');
import * as api from '../../utils/api';
import { waitFor } from '@testing-library/react';
const apiMock = api as jest.Mocked<typeof api>;

const helperOpts = {
  wrapInRouter: true,
  before: () => waitFor(() => expect(apiMock.apiGet).toBeCalled()),
};
describe('Upload', () => {
  beforeAll(() => {
    apiMock.apiGet.mockReturnValue(new Promise((resolve) => resolve(0)));
  });
  snapshotTestHelper(<Upload />, helperOpts);
  accessibilityTestHelper(<Upload />, helperOpts);
});
