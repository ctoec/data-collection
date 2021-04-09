import React from 'react';
import BatchEdit from './BatchEdit';
import { snapshotTestHelper, accessibilityTestHelper } from '../../testHelpers';
import { Child, Family } from '../../shared/models';
import moment from 'moment';
import { ValidationError } from 'class-validator';
import { waitFor } from '@testing-library/dom';
import AuthenticationContext from '../../contexts/AuthenticationContext/AuthenticationContext';

const children: Child[] = [
  {
    id: '00000000-0000-0000-0000-000000000000',
    firstName: 'First',
    lastName: 'Last',
    birthdate: moment.utc('2019-06-01', 'YYYY-MM-DD'),
    family: {} as Family,
    validationErrors: [{} as ValidationError],
  } as Child,
];

jest.mock('../../utils/api');
import * as api from '../../utils/api';
import { cache } from 'swr';
const apiMock = api as jest.Mocked<typeof api>;
const waitGetChild = () => waitFor(() => expect(apiMock.apiGet).toBeCalled());

describe('BatchEdit', () => {
  snapshotTestHelper(
    <AuthenticationContext.Provider
      value={{
        accessToken: 'faketoken',
        loading: false,
      }}
    >
      <BatchEdit />
    </AuthenticationContext.Provider>,
    {
      before: async () => {
        apiMock.apiGet.mockReturnValue(new Promise((resolve) => resolve([])));
        return waitGetChild();
      },
      wrapInRouter: true,
      wrapInSWRConfig: true,
      name: 'matches snapshot when no records are missing info',
    }
  );

  snapshotTestHelper(
    <AuthenticationContext.Provider
      value={{
        accessToken: 'faketoken',
        loading: false,
      }}
    >
      <BatchEdit />
    </AuthenticationContext.Provider>,
    {
      before: async () => {
        apiMock.apiGet.mockReturnValue(
          new Promise((resolve) => resolve(children))
        );
        return waitGetChild();
      },
      wrapInRouter: true,
      wrapInSWRConfig: true,
      name: 'matches snapshot when >0 records are missing info',
    }
  );

  accessibilityTestHelper(<BatchEdit />, { wrapInRouter: true });

  afterEach(() => {
    jest.clearAllMocks();
    cache.clear();
  });
});
