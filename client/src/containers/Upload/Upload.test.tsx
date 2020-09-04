import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { snapshotTestHelper, accessibilityTestHelper } from '../../testHelpers';
import Upload from './Upload';

const routerWrapped = (
  <BrowserRouter>
    <Upload />
  </BrowserRouter>
);
describe('Upload', () => {
  snapshotTestHelper(routerWrapped);
  accessibilityTestHelper(routerWrapped);
});
