import React from 'react';
import {
  snapshotTestHelper,
  accessibilityTestHelper,
  renderHelper,
} from '../../testHelpers';
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
import { waitFor, fireEvent, wait } from '@testing-library/dom';
import UserContext from '../../contexts/UserContext/UserContext';
import moment from 'moment';
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

const user = {
  organizations: [{ id: 1, providerName: 'Organization' }],
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

  it('correctly separates children by agegroup', async () => {
    const renderResult = await renderHelper(<Roster />, helperOpts);

    // Assert there are two roster sections
    const accordionHeaders = await renderResult.findAllByText(/\d+ children$/);
    expect(accordionHeaders).toHaveLength(2);

    // Assert first section (infant/toddler) has 2 items in table,
    const infantToddlerHeader = accordionHeaders.find((header) =>
      header.innerHTML.includes(AgeGroup.InfantToddler)
    );
    expect(infantToddlerHeader).toContainHTML('2');

    // and second (preschool) has 1
    const preschoolHeader = accordionHeaders.find((header) =>
      header.innerHTML.includes(AgeGroup.Preschool)
    );
    expect(preschoolHeader).toContainHTML('1');
  });

  afterAll(() => jest.clearAllMocks());
});
