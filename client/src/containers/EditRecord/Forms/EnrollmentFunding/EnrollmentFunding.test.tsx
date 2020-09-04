import React from 'react';
import moment from 'moment';
import { EnrollmentFundingForm } from './Form';
import {
  snapshotTestHelper,
  accessibilityTestHelper,
} from '../../../../testHelpers';
import {
  Child,
  Site,
  FundingSource,
  FundingTime,
  Funding,
} from '../../../../shared/models';

const enrollments = [
  {
    id: 1,
    child: {} as Child,
    site: { name: 'Site A' } as Site,
    entry: moment.utc('2020-09-03'),
  },
  {
    id: 2,
    child: {} as Child,
    site: { name: 'Site B' } as Site,
    entry: moment.utc('2019-09-03'),
    exit: moment.utc('2020-08-01'),
    fundings: [
      {
        id: 1,
        fundingSpace: { source: FundingSource.CDC, time: FundingTime.Full },
        firstReportingPeriod: { period: moment.utc('2019-09-01') },
        lastReportingPeriod: { period: moment.utc('2020-07-01') },
      } as Funding,
    ],
  },
];

jest.mock('../../../../utils/api');
describe('EditRecord', () => {
  describe('EnrollmetFunding', () => {
    snapshotTestHelper(
      <EnrollmentFundingForm
        childName="Name"
        childId="00000000-0000-0000-0000-000000000000"
        refetchChild={jest.fn()}
        enrollments={enrollments}
      />
    );
    accessibilityTestHelper(
      <EnrollmentFundingForm
        childName="Name"
        childId="00000000-0000-0000-0000-000000000000"
        refetchChild={jest.fn()}
        enrollments={enrollments}
      />
    );
  });
});
