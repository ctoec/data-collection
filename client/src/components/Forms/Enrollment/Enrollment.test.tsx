import React from 'react';
import moment from 'moment';
import {
  snapshotTestHelper,
  accessibilityTestHelper,
} from '../../../testHelpers';
import { EnrollmentForm } from './Form';
import {
  Family,
  Organization,
  Child,
  Site,
  FundingSource,
  FundingTime,
  Funding,
} from '../../../shared/models';

const child = {
  name: 'First Last',
  firstName: 'First',
  lastName: 'Last',
  id: '00000000-0000-0000-0000-000000000000',
  family: {} as Family,
  organization: { id: 1 } as Organization,
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
describe('Forms', () => {
  describe('Enrollment', () => {
    snapshotTestHelper(
      <EnrollmentForm
        child={child}
        afterSaveSuccess={jest.fn()}
        setAlerts={jest.fn()}
      />,
      { wrapInRouter: true }
    );

    accessibilityTestHelper(
      <EnrollmentForm
        child={child}
        afterSaveSuccess={jest.fn()}
        setAlerts={jest.fn()}
      />,
      { wrapInRouter: true }
    );
  });
});
