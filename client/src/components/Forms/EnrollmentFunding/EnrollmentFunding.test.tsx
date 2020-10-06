import React from 'react';
import moment from 'moment';
import { RenderResult, fireEvent, wait } from '@testing-library/react';
import { EnrollmentFundingForm } from './Form';
import {
  snapshotTestHelper,
  accessibilityTestHelper,
} from '../../../testHelpers';
import {
  Child,
  Site,
  FundingSource,
  FundingTime,
  Funding,
  Family,
} from '../../../shared/models';

const child = {
  name: 'First Last',
  firstName: 'First',
  lastName: 'Last',
  id: '00000000-0000-0000-0000-000000000000',
  family: {} as Family,
  enrollments: [
    {
      id: 1,
      child: {} as Child,
      site: { siteName: 'Site A', organization: { id: 1 } } as Site,
      entry: moment.utc('2020-09-03'),
    },
    {
      id: 2,
      child: {} as Child,
      site: { siteName: 'Site B', organization: { id: 1 } } as Site,
      entry: moment.utc('2019-09-03'),
      exit: moment.utc('2020-08-01'),
      fundings: [
        {
          id: 1,
          fundingSpace: {
            source: FundingSource.CDC,
            time: FundingTime.FullTime,
          },
          firstReportingPeriod: { period: moment.utc('2019-09-01') },
          lastReportingPeriod: { period: moment.utc('2020-07-01') },
        } as Funding,
      ],
    },
  ],
};

jest.mock('../../../utils/api');
import * as api from '../../../utils/api';
const apiMock = api as jest.Mocked<typeof api>;
describe('EditRecord', () => {
  describe('EnrollmentFunding', () => {
    beforeAll(() =>
      apiMock.apiGet.mockReturnValue(new Promise((resolve) => resolve([])))
    );

    const waitExpandChangeEnrollment = async (renderResult: RenderResult) => {
      const changeEnrollmentButton = await renderResult.findByText(
        'Change enrollment'
      );
      fireEvent.click(changeEnrollmentButton);
      await wait();
    };

    snapshotTestHelper(
      <EnrollmentFundingForm
        child={child}
        afterDataSave={jest.fn()}
        setAlerts={jest.fn()}
      />,
      { before: waitExpandChangeEnrollment }
    );
    accessibilityTestHelper(
      <EnrollmentFundingForm
        child={child}
        afterDataSave={jest.fn()}
        setAlerts={jest.fn()}
      />,
      { before: waitExpandChangeEnrollment }
    );

    afterAll(() => jest.clearAllMocks());
  });
});
