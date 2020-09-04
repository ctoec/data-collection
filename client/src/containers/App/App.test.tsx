import React from 'react';
import { render } from '@testing-library/react';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { accessibilityTestHelper, snapshotTestHelper } from '../../testHelpers';

const routerWrapped = (
  <BrowserRouter>
    <App />
  </BrowserRouter>
);

describe('App', () => {
  snapshotTestHelper(routerWrapped);
  accessibilityTestHelper(routerWrapped);
});
