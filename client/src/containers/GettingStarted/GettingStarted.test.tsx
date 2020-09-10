import React from 'react';
import GettingStarted from './GettingStarted';
import { snapshotTestHelper, accessibilityTestHelper } from '../../testHelpers';

describe('GettingStarted', () => {
  snapshotTestHelper(<GettingStarted />, { wrapInRouter: true });
  accessibilityTestHelper(<GettingStarted />, { wrapInRouter: true });
});
