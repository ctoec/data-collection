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

const userProps = {
  loading: false,
  user: testUser,
  confidentialityAgreedDate: moment(),
  setConfidentialityAgreedDate: () => {},
};

const HomeWithUserProvider = (
  <UserContext.Provider value={{ ...userProps }}>
    <Home />
  </UserContext.Provider>
);

const RevisionFormWithUserProvider = (
  <UserContext.Provider value={{ ...userProps }}>
    <RevisionRequest />
  </UserContext.Provider>
);

jest.mock('../../utils/api');
import * as api from '../../utils/api';
import { waitFor } from '@testing-library/react';
import { RevisionRequest } from './RevisionRequest';
const apiMock = api as jest.Mocked<typeof api>;

describe('Home', () => {
  snapshotTestHelper(HomeWithUserProvider, {
    before: async () => {
      apiMock.apiGet.mockReturnValue(
        new Promise((resolve) => resolve({ allSubmitted: false }))
      );
      return waitFor(() => expect(apiMock.apiGet).toBeCalled());
    },
    wrapInRouter: true,
    name: 'snapshot matches pre-submit user',
  });

  snapshotTestHelper(HomeWithUserProvider, {
    before: async () => {
      apiMock.apiGet.mockReturnValue(
        new Promise((resolve) => resolve({ allSubmitted: true }))
      );
      return waitFor(() => expect(apiMock.apiGet).toBeCalled());
    },
    wrapInRouter: true,
    name: 'snapshot matches post-submit user',
  });

  accessibilityTestHelper(HomeWithUserProvider, {
    wrapInRouter: true,
    before: async () => {
      apiMock.apiGet.mockReturnValue(
        new Promise((resolve) => resolve({ allSubmitted: true }))
      );
      return waitFor(() => expect(apiMock.apiGet).toBeCalled());
    },
  });

  snapshotTestHelper(RevisionFormWithUserProvider, {
    wrapInRouter: true,
    name: 'snapshot matches revise site request form',
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
