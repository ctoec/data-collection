import React from 'react';
import { snapshotTestHelper, accessibilityTestHelper } from '../../testHelpers';
import Roster from './Roster';
import {
  Family,
  Child,
  Site,
  FundingSpace,
  FundingSource,
  AgeGroup,
  ReportingPeriod,
  Funding,
  User,
} from '../../shared/models';

jest.mock('../../utils/api');
import * as api from '../../utils/api';
import { waitFor } from '@testing-library/dom';
import UserContext, {
  UserProvider,
} from '../../contexts/UserContext/UserContext';
const apiMock = api as jest.Mocked<typeof api>;

const _child = {
  firstName: '',
  lastName: '',
  id: '',
} as Child;

const INFANT_TODDLER_CDC = {
  source: FundingSource.CDC,
  ageGroup: AgeGroup.InfantToddler,
} as FundingSpace;

const INFANT_TODDLER_PSR = {
  source: FundingSource.PSR,
  ageGroup: AgeGroup.InfantToddler,
};

const PRESCHOOL_CDC = {
  source: FundingSource.CDC,
  ageGroup: AgeGroup.Preschool,
};

const children: Child[] = [
  {
    id: '0000000-0000-0000-0000-0000000000000',
    firstName: 'First',
    lastName: 'Toddler',
    family: {} as Family,
    enrollments: [
      {
        child: _child,
        id: 1,
        site: { id: 1 } as Site,
        fundings: [
          {
            id: 1,
            fundingSpace: INFANT_TODDLER_CDC,
            firstReportingPeriod: {} as ReportingPeriod,
          } as Funding,
        ],
      },
    ],
  },
  {
    id: '11111111-0000-0000-0000-0000000000000',
    firstName: 'Second',
    lastName: 'Toddler',
    family: {} as Family,
    enrollments: [
      {
        child: _child,
        id: 1,
        site: { id: 1 } as Site,
        fundings: [
          {
            id: 1,
            fundingSpace: INFANT_TODDLER_PSR,
            firstReportingPeriod: {} as ReportingPeriod,
          } as Funding,
        ],
      },
    ],
  },
  {
    id: '22222222-0000-0000-0000-0000000000000',
    firstName: 'First',
    lastName: 'Preschool',
    family: {} as Family,
    enrollments: [
      {
        child: _child,
        id: 1,
        site: { id: 1 } as Site,
        fundings: [
          {
            id: 1,
            fundingSpace: PRESCHOOL_CDC,
            firstReportingPeriod: {} as ReportingPeriod,
          } as Funding,
        ],
      },
    ],
  },
];

const user = {
  organizations: [{ id: 1, name: 'Organization' }],
} as User;

describe('Roster', () => {
  beforeAll(() =>
    apiMock.apiGet.mockReturnValue(new Promise((resolve) => resolve(children)))
  );

  const helperOpts = {
    wrapInRouter: true,
    before: () => waitFor(() => expect(apiMock.apiGet).toBeCalled()),
  };
  snapshotTestHelper(
    <UserContext.Provider value={{ user, loading: false }}>
      <Roster />
    </UserContext.Provider>,
    helperOpts
  );
  accessibilityTestHelper(
    <UserContext.Provider value={{ user, loading: false }}>
      <Roster />
    </UserContext.Provider>,
    helperOpts
  );

  afterAll(() => jest.clearAllMocks());
});
