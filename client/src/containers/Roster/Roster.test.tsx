import React from 'react';
import moment from 'moment';
import { waitFor } from '@testing-library/react';
import { snapshotTestHelper, accessibilityTestHelper } from '../../testHelpers';
import Roster from './Roster';
import UserContext from '../../contexts/UserContext/UserContext';
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
  FundingTime,
} from '../../shared/models';

const commonUserProvider = {
  loading: false,
  confidentialityAgreedDate: moment.utc(),
  setConfidentialityAgreedDate: () => {},
};

const _child = {
  firstName: '',
  lastName: '',
  id: '',
} as Child;

const INFANT_TODDLER_CDC = {
  id: 1,
  source: FundingSource.CDC,
  ageGroup: AgeGroup.InfantToddler,
  capacity: 3,
  time: FundingTime.FullDay,
} as FundingSpace;

const INFANT_TODDLER_PSR = {
  id: 2,
  source: FundingSource.PSR,
  ageGroup: AgeGroup.InfantToddler,
  capacity: 5,
  time: FundingTime.FullTime,
} as FundingSpace;

const PRESCHOOL_CDC = {
  id: 3,
  source: FundingSource.CDC,
  ageGroup: AgeGroup.Preschool,
  capacity: 10,
  time: FundingTime.ExtendedDay,
} as FundingSpace;

const children: Child[] = [
  {
    id: '0000000-0000-0000-0000-0000000000000',
    firstName: 'First',
    lastName: 'Toddler',
    birthdate: moment.utc('2019-06-01', 'YYYY-MM-DD'),
    family: {} as Family,
    enrollments: [
      {
        child: _child,
        id: 1,
        site: { id: 1, siteName: 'Site' } as Site,
        ageGroup: AgeGroup.InfantToddler,
        fundings: [
          {
            id: 1,
            fundingSpace: INFANT_TODDLER_CDC,
            firstReportingPeriod: {} as ReportingPeriod,
          } as Funding,
        ],
      },
    ],
  } as Child,
  {
    id: '11111111-0000-0000-0000-0000000000000',
    firstName: 'Second',
    lastName: 'Toddler',
    birthdate: moment.utc('2018-11-01', 'YYYY-MM-DD'),
    family: {} as Family,
    enrollments: [
      {
        child: _child,
        id: 1,
        site: { id: 1, siteName: 'Site' } as Site,
        ageGroup: AgeGroup.InfantToddler,
        fundings: [
          {
            id: 1,
            fundingSpace: INFANT_TODDLER_PSR,
            firstReportingPeriod: {} as ReportingPeriod,
          } as Funding,
        ],
      },
    ],
  } as Child,
  {
    id: '22222222-0000-0000-0000-0000000000000',
    firstName: 'First',
    lastName: 'Preschool',
    birthdate: moment.utc('2016-01-01', 'YYYY-MM-DD'),
    family: {} as Family,
    enrollments: [
      {
        child: _child,
        id: 1,
        site: { id: 1, siteName: 'Site' } as Site,
        ageGroup: AgeGroup.Preschool,
        fundings: [
          {
            id: 1,
            fundingSpace: PRESCHOOL_CDC,
            firstReportingPeriod: {} as ReportingPeriod,
          } as Funding,
        ],
      },
    ],
  } as Child,
];

const oneSiteUser = {
  organizations: [{ id: 1, providerName: 'Organization' }],
  sites: [{ id: 1, siteName: 'Site1' }],
  accessType: 'site',
} as User;

const oneOrgUser = {
  organizations: [{ id: 1, providerName: 'Organization' }],
  sites: [
    { id: 1, siteName: 'Site1', organizationId: 1 },
    { id: 2, siteName: 'Site 2', organizationId: 1 },
  ],
  accessType: 'organization',
} as User;

const multiOrgUser = {
  organizations: [
    { id: 1, providerName: 'Organization' },
    { id: 2, providerName: 'Org 2' },
  ],
  sites: [
    { id: 1, siteName: 'Site1', organizationId: 1 },
    { id: 2, siteName: 'Site 2', organizationId: 2 },
  ],
  accessType: 'organization',
} as User;

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: () => ({
    search: '?organization=1',
  }),
}));

jest.mock('./hooks/usePaginatedChildData');
import * as paginatedChildData from './hooks/usePaginatedChildData';
const paginatedChildDataMock = paginatedChildData as jest.Mocked<
  typeof paginatedChildData
>;

const helperOpts = {
  wrapInRouter: true,
  wrapInSWRConfig: true,
};

describe('Roster', () => {
  beforeAll(async () => {
    paginatedChildDataMock.usePaginatedChildData.mockReturnValue({
      children,
      stillFetching: false,
      mutate: async () => undefined,
      error: undefined,
    });
  });

  snapshotTestHelper(
    <UserContext.Provider value={{ ...commonUserProvider, user: oneSiteUser }}>
      <Roster />
    </UserContext.Provider>,
    {
      ...helperOpts,
      name: 'matches snapshot for site level user',
    }
  );

  snapshotTestHelper(
    <UserContext.Provider value={{ ...commonUserProvider, user: oneOrgUser }}>
      <Roster />
    </UserContext.Provider>,
    {
      ...helperOpts,
      name: 'matches snapshot for one-org, multi-site user',
    }
  );

  snapshotTestHelper(
    <UserContext.Provider value={{ ...commonUserProvider, user: multiOrgUser }}>
      <Roster />
    </UserContext.Provider>,
    {
      ...helperOpts,
      name: 'matches snapshot for multi-org user',
    }
  );

  accessibilityTestHelper(
    <UserContext.Provider value={{ ...commonUserProvider, user: multiOrgUser }}>
      <Roster />
    </UserContext.Provider>,
    helperOpts
  );

  afterAll(() => jest.clearAllMocks());
});
