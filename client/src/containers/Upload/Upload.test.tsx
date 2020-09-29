import React from 'react';
import { snapshotTestHelper, accessibilityTestHelper } from '../../testHelpers';
import Upload from './Upload';

jest.mock('../../utils/api');
import * as api from '../../utils/api';
const apiMock = api as jest.Mocked<typeof api>;

describe('Upload', () => {
  beforeAll(() => {
    apiMock.apiGet.mockReturnValue(new Promise((resolve) => resolve(0)));
  });
  snapshotTestHelper(<Upload />, { wrapInRouter: true });
  accessibilityTestHelper(<Upload />, { wrapInRouter: true });
});
