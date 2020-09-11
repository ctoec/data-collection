import React from 'react';
import { snapshotTestHelper, accessibilityTestHelper } from '../../testHelpers';
import SubmitSuccess from './SubmitSuccess';

describe('SubmitSuccess', () => {
  snapshotTestHelper(<SubmitSuccess />, { wrapInRouter: true });
  accessibilityTestHelper(<SubmitSuccess />, { wrapInRouter: true });
});
