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

jest.mock('../../utils/api');
import * as api from '../../utils/api';
import { waitFor } from '@testing-library/react';
const apiMock = api as jest.Mocked<typeof api>;

describe('Home', () => {
  snapshotTestHelper(HomeWithUserProvider, {
    before: async () => {
      apiMock.apiGet.mockReturnValue(
        new Promise((resolve) => resolve({ submitted: false }))
      );
      return waitFor(() => expect(apiMock.apiGet).toBeCalled());
    },
    wrapInRouter: true,
    name: 'snapshot matches pre-submit user',
  });

  snapshotTestHelper(HomeWithUserProvider, {
    before: async () => {
      apiMock.apiGet.mockReturnValue(
        new Promise((resolve) => resolve({ submitted: true }))
      );
      return waitFor(() => expect(apiMock.apiGet).toBeCalled());
    },
    wrapInRouter: true,
    name: 'snapshot matches post-submit user',
  });

  accessibilityTestHelper(HomeWithUserProvider, {
    wrapInRouter: true,
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
