import React from 'react';
import {
  snapshotTestHelper,
  accessibilityTestHelper,
} from '../../../../testHelpers';
import { ChangeEnrollmentCard } from './Card';
import moment from 'moment';
import {
  Family,
  Site,
  AgeGroup,
  ReportingPeriod,
  Funding,
  Child,
  FundingSource,
} from '../../../../shared/models';
import { RenderResult } from '@testing-library/react';
import { fireEvent, wait } from '@testing-library/dom';

const enrollment = {
  child: {} as Child,
  id: 1,
  site: { id: 1, siteName: 'Site' } as Site,
  ageGroup: AgeGroup.InfantToddler,
  entry: moment.utc('2020-09-01'),
  fundings: [
    {
      id: 1,
      fundingSpace: {
        ageGroup: AgeGroup.InfantToddler,
        source: FundingSource.CDC,
      },
      firstReportingPeriod: {} as ReportingPeriod,
    } as Funding,
  ],
};

const child = {
  id: '0000000-0000-0000-0000-0000000000000',
  firstName: 'First',
  lastName: 'Toddler',
  birthdate: moment.utc('2019-06-01', 'YYYY-MM-DD'),
  family: {} as Family,
  enrollments: [enrollment],
  organization: { id: 1 },
} as Child;

const waitExpandChangeEnrollment = async (renderResult: RenderResult) => {
  const changeEnrollmentButton = await renderResult.findByText(
    'Change enrollment'
  );
  fireEvent.click(changeEnrollmentButton);
  await wait();
};

describe('EditRecord', () => {
  describe('EnrollmentFunding', () => {
    describe('ChangeEnrollment', () => {
      snapshotTestHelper(
        <ChangeEnrollmentCard
          child={child}
          currentEnrollment={enrollment}
          afterSaveSuccess={jest.fn()}
        />,
        { before: waitExpandChangeEnrollment }
      );

      accessibilityTestHelper(
        <ChangeEnrollmentCard
          child={child}
          currentEnrollment={enrollment}
          afterSaveSuccess={jest.fn()}
        />,
        { before: waitExpandChangeEnrollment }
      );
    });
  });
});
