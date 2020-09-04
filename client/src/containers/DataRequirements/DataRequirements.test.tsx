import React from 'react';
import DataRequirements from './DataRequirements';
import { accessibilityTestHelper, snapshotTestHelper } from '../../testHelpers';
import { BrowserRouter } from 'react-router-dom';

const routerWrapped = (
  <BrowserRouter>
    <DataRequirements />
  </BrowserRouter>
);
describe('DataRequirements', () => {
  snapshotTestHelper(routerWrapped);
  accessibilityTestHelper(routerWrapped);
});
