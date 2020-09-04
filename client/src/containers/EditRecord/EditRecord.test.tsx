import React from 'react';
import EditRecord from './EditRecord';
import { accessibilityTestHelper, snapshotTestHelper } from '../../testHelpers';
import { BrowserRouter } from 'react-router-dom';

const routerWrapped = (
  <BrowserRouter>
    <EditRecord />
  </BrowserRouter>
);
describe('EditRecord', () => {
  snapshotTestHelper(routerWrapped);
  accessibilityTestHelper(routerWrapped);
});
