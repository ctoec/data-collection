import React from 'react';
import {
  accessibilityTestHelper,
  snapshotTestHelper,
} from '../../../../testHelpers';
import { ChangeFundingCard } from './Card';
import {
  Child,
  Site,
  AgeGroup,
  FundingSource,
  ReportingPeriod,
  Funding,
} from '../../../../shared/models';
import moment from 'moment';
import { RenderResult } from '@testing-library/react';
import { fireEvent, wait } from '@testing-library/dom';

const enrollment = {
  child: {} as Child,
  id: 1,
  site: { id: 1, siteName: 'Site' } as Site,
  ageGroup: AgeGroup.InfantToddler,
  entry: moment.utc('2020-09-01'),
};

const enrollmentWithFunding = {
  ...enrollment,
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

const waitExpand = (buttonText: string) => async (
  renderResult: RenderResult
) => {
  const expandButton = await renderResult.findByText(buttonText);
  fireEvent.click(expandButton);
  await wait();
};

describe('EditRecord', () => {
  describe('EnrollmentFundng', () => {
    describe('ChangeFunding', () => {
      [
        {
          enrollment,
          before: waitExpand('Start new funding'),
          name: 'matches snapshot - without funding',
        },
        {
          enrollment: enrollmentWithFunding,
          before: waitExpand('Start new funding'),
          name: 'matches snapshot - start funding',
        },
        {
          enrollment: enrollmentWithFunding,
          before: waitExpand('End current funding'),
          name: 'matches snapshot - end funding',
        },
      ].forEach(({ enrollment, before, name }) => {
        snapshotTestHelper(
          <ChangeFundingCard
            enrollment={enrollment}
            orgId={1}
            afterSaveSuccess={jest.fn()}
            topHeadingLevel="h3"
          />,
          { before, name }
        );
        accessibilityTestHelper(
          <ChangeFundingCard
            enrollment={enrollment}
            orgId={1}
            afterSaveSuccess={jest.fn()}
            topHeadingLevel="h2"
          />,
          { before, name }
        );
      });
    });
  });
});
