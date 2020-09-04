import React from 'react';
import CheckData from './CheckData';
import { accessibilityTestHelper, snapshotTestHelper } from '../../testHelpers';
import { BrowserRouter } from 'react-router-dom';

const routerWrapped = (
  <BrowserRouter>
    <CheckData />
  </BrowserRouter>
);
describe('CheckData', () => {
  snapshotTestHelper(routerWrapped);
  accessibilityTestHelper(routerWrapped);
});
