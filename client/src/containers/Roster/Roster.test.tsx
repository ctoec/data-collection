import React from 'react';
import { waitFor } from '@testing-library/dom';
import moment from 'moment';
import {
  snapshotTestHelper,
  accessibilityTestHelper,
  renderHelper,
} from '../../testHelpers';
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
} from '../../shared/models';

jest.mock('../../utils/api');
import * as api from '../../utils/api';
import DataCacheContext from '../../contexts/DataCacheContext/DataCacheContext';
const apiMock = api as jest.Mocked<typeof api>;

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
} as FundingSpace;

const INFANT_TODDLER_PSR = {
  id: 2,
  source: FundingSource.PSR,
  ageGroup: AgeGroup.InfantToddler,
  capacity: 5,
};

const PRESCHOOL_CDC = {
  id: 3,
  source: FundingSource.CDC,
  ageGroup: AgeGroup.Preschool,
  capacity: 10,
};

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
  },
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
  },
];

const oneOrgUser = {
  organizations: [{ id: 1, providerName: 'Organization' }],
} as User;

const multiOrgUser = {
  organizations: [
    { id: 1, providerName: 'Organization' },
    { id: 2, providerName: 'Org 2' },
  ],
} as User;

describe('Roster', () => {
  const helperOpts = {
    wrapInRouter: true,
  };
  snapshotTestHelper(
    <UserContext.Provider value={{ user: oneOrgUser, loading: false }}>
      <DataCacheContext.Provider
        value={{
          children: {
            records: children,
            loading: false,
            addOrUpdateRecord: jest.fn(),
          },
        }}
      >
        <Roster />
      </DataCacheContext.Provider>
    </UserContext.Provider>,
    helperOpts,
    'matches snapshot for user with 1 org'
  );

  snapshotTestHelper(
    <UserContext.Provider value={{ user: multiOrgUser, loading: false }}>
      <DataCacheContext.Provider
        value={{
          children: {
            records: children,
            loading: false,
            addOrUpdateRecord: jest.fn(),
          },
        }}
      >
        <Roster />
      </DataCacheContext.Provider>
    </UserContext.Provider>,
    helperOpts,
    'matches snapshot for user with >1 org'
  );

  accessibilityTestHelper(
    <UserContext.Provider value={{ user: multiOrgUser, loading: false }}>
      <DataCacheContext.Provider
        value={{
          children: {
            records: children,
            loading: false,
            addOrUpdateRecord: jest.fn(),
          },
        }}
      >
        <Roster />
      </DataCacheContext.Provider>
    </UserContext.Provider>,
    helperOpts
  );

  it('correctly separates children by ageGroup', async () => {
    const renderResult = await renderHelper(
      <DataCacheContext.Provider
        value={{
          children: {
            records: children,
            loading: false,
            addOrUpdateRecord: jest.fn(),
          },
        }}
      >
        <Roster />
      </DataCacheContext.Provider>,
      helperOpts
    );

    // Assert there are two roster sections
    const accordionHeaders = (
      await renderResult.findAllByText(/\d+ child(ren)?$/)
    ).map((innerSpanElement) => innerSpanElement.parentElement as HTMLElement);
    expect(accordionHeaders).toHaveLength(2);

    // Assert first section (infant/toddler) has 2 items in table,
    const infantToddlerHeader = accordionHeaders.find((header) =>
      header.innerHTML.includes(AgeGroup.InfantToddler)
    );
    expect(infantToddlerHeader).toContainHTML('2 children');

    // and second (preschool) has 1
    const preschoolHeader = accordionHeaders.find((header) =>
      header.innerHTML.includes(AgeGroup.Preschool)
    );
    expect(preschoolHeader).toContainHTML('1 child');
  });

  afterAll(() => jest.clearAllMocks());
});
