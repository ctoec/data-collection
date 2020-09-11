import React from 'react';
import { snapshotTestHelper, accessibilityTestHelper } from '../../testHelpers';
import Upload from './Upload';

describe('Upload', () => {
  snapshotTestHelper(<Upload />, { wrapInRouter: true });
  accessibilityTestHelper(<Upload />, { wrapInRouter: true });
});
