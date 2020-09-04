import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { snapshotTestHelper, accessibilityTestHelper } from '../../testHelpers';
import SubmitSuccess from './SubmitSuccess';

const routerWrapped = (
  <BrowserRouter>
    <SubmitSuccess />
  </BrowserRouter>
);
describe('SubmitSuccess', () => {
  snapshotTestHelper(routerWrapped);
  accessibilityTestHelper(routerWrapped);
});
