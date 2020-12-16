import React from 'react';
import GettingStarted from './GettingStarted';
import { snapshotTestHelper, accessibilityTestHelper } from '../../testHelpers';
import UserContext from '../../contexts/UserContext/UserContext';
import { User } from '../../shared/models';

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

const GettingStartedWithUserProvider = (
  <UserContext.Provider value={{ loading: false, user: testUser }}>
    <GettingStarted />
  </UserContext.Provider>
);

describe('GettingStarted', () => {
  snapshotTestHelper(GettingStartedWithUserProvider, { wrapInRouter: true });
  accessibilityTestHelper(GettingStartedWithUserProvider, {
    wrapInRouter: true,
  });
});
