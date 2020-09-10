import React from 'react';
import Home from './Home';
import { snapshotTestHelper, accessibilityTestHelper } from '../../testHelpers';
import UserContext from '../../contexts/UserContext/UserContext';

const HomeWithUserProvider = (
  <UserContext.Provider value={{ loading: false, user: null }}>
    <Home />
  </UserContext.Provider>
);

describe('Home', () => {
  snapshotTestHelper(HomeWithUserProvider, { wrapInRouter: true });
  accessibilityTestHelper(HomeWithUserProvider, { wrapInRouter: true });
});
