import React from 'react';
import App from './App';
import { accessibilityTestHelper, snapshotTestHelper } from '../../testHelpers';

describe('App', () => {
  snapshotTestHelper(<App />, { wrapInRouter: true });
  accessibilityTestHelper(<App />, { wrapInRouter: true });
});
