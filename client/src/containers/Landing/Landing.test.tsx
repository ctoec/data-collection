import React from 'react';
import Landing from './Landing';
import { snapshotTestHelper, accessibilityTestHelper } from '../../testHelpers';
import UserContext from '../../contexts/UserContext/UserContext';
import moment from 'moment';

const LandingWithUserProvider = (
  <UserContext.Provider
    value={{
      loading: false,
      user: null,
      confidentialityAgreedDate: moment.utc(),
      setConfidentialityAgreedDate: () => {},
    }}
  >
    <Landing />
  </UserContext.Provider>
);

describe('Landing', () => {
  snapshotTestHelper(LandingWithUserProvider, { wrapInRouter: true });
  accessibilityTestHelper(LandingWithUserProvider, { wrapInRouter: true });
});
