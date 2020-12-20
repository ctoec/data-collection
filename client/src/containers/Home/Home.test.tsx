import React from 'react';
import Home from './Home';
import { snapshotTestHelper, accessibilityTestHelper } from '../../testHelpers';
import UserContext from '../../contexts/UserContext/UserContext';
import { User } from '../../shared/models';
import moment from 'moment';

const testUser = {
  firstName: 'Voldy',
  organizations: [
    { id: 1, providerName: 'Mort School For Dark-Inclined Wizards' },
  ],
  sites: [
    { id: 1, siteName: 'Students of Salazaar', organizationId: 1 },
    { id: 2, siteName: 'Karkaroff Kids', organizationId: 1 },
    { id: 3, siteName: 'Nocturn Alley Nargles', organizationId: 1 },
  ],
} as User;

const HomeWithUserProvider = (
  <UserContext.Provider
    value={{
      loading: false,
      user: testUser,
      confidentialityAgreedDate: moment(),
      setConfidentialityAgreedDate: () => {},
    }}
  >
    <Home />
  </UserContext.Provider>
);

describe('Home', () => {
  snapshotTestHelper(HomeWithUserProvider, { wrapInRouter: true });
  accessibilityTestHelper(HomeWithUserProvider, {
    wrapInRouter: true,
  });
});
