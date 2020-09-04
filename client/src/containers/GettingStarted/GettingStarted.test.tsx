import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import GettingStarted from './GettingStarted';
import { snapshotTestHelper, accessibilityTestHelper } from '../../testHelpers';

const routerWrapped = (
  <BrowserRouter>
    <GettingStarted />
  </BrowserRouter>
);
describe('GettingStarted', () => {
  snapshotTestHelper(routerWrapped);
  accessibilityTestHelper(routerWrapped);
});
