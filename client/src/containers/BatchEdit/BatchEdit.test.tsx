import React from 'react';
import BatchEdit from './BatchEdit';
import { snapshotTestHelper, accessibilityTestHelper } from '../../testHelpers';

describe('BatchEdit', () => {
  snapshotTestHelper(<BatchEdit />, { wrapInRouter: true });
  accessibilityTestHelper(<BatchEdit />, { wrapInRouter: true });
});
