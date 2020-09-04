import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import Home from './Home';
import { snapshotTestHelper, accessibilityTestHelper } from '../../testHelpers';
import UserContext from '../../contexts/UserContext/UserContext';

const routerWrapped = (
  <BrowserRouter>
    <UserContext.Provider value={{ loading: false, user: null }}>
      <Home />
    </UserContext.Provider>
  </BrowserRouter>
);
describe('Home', () => {
  snapshotTestHelper(routerWrapped);
  accessibilityTestHelper(routerWrapped);
});
