import React from 'react';
import {
  snapshotTestHelper,
  accessibilityTestHelper,
  renderHelper,
} from '../../../testHelpers';
import { EnrollmentFundingForm } from './Form';
import {
  Family,
  Organization,
  Child,
  Site,
  FundingSource,
  FundingTime,
  Funding,
} from '../../../shared/models';
import moment from 'moment';
import { ValidationError } from 'class-validator';

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
      validationErrors: [
        {
          property: 'site',
        } as ValidationError,
      ],
    },
    {
      id: 2,
      child: {} as Child,
      site: { siteName: 'Site B', organization: { id: 1 } } as Site,
      entry: moment.utc('2019-09-03'),
      exit: moment.utc('2020-08-01'),
      validationErrors: [
        {
          property: 'fundings',
        } as ValidationError,
      ],
      fundings: [
        {
          id: 1,
          fundingSpace: {
            source: FundingSource.CDC,
            time: FundingTime.FullTime,
          },
          firstReportingPeriod: { period: moment.utc('2019-09-01') },
          lastReportingPeriod: { period: moment.utc('2020-07-01') },
          validationErrors: [
            {
              property: 'firstReportingPeriod',
            } as ValidationError,
          ],
        } as Funding,
      ],
    },
    {
      id: 3,
      child: {} as Child,
      site: { siteName: 'Site A', organization: { id: 1 } } as Site,
      entry: moment.utc('2018-09-03'),
      exit: moment.utc('2019-08-01'),
    },
  ],
};
describe('BatchEdit', () => {
  describe('EnrollmentFundingForm', () => {
    snapshotTestHelper(
      <EnrollmentFundingForm
        child={child}
        afterSaveSuccess={jest.fn}
        setAlerts={jest.fn()}
        showField={jest.fn()}
      />
    );

    accessibilityTestHelper(
      <EnrollmentFundingForm
        child={child}
        afterSaveSuccess={jest.fn}
        setAlerts={jest.fn()}
        showField={jest.fn()}
      />
    );

    it('only shows forms for enrollments or fundings with validationErrors', async () => {
      const renderResult = await renderHelper(
        <EnrollmentFundingForm
          child={child}
          afterSaveSuccess={jest.fn}
          setAlerts={jest.fn()}
          showField={jest.fn()}
        />
      );

      // Assert there are only forms for objects with validation errors:
      // 1 enrollment and 1 funding.
      //
      // For now, we can only deduce presence of forms based on their submit
      // buttons (TODO: add some headings to the forms?)
      const formSubmitButtons = await renderResult.findAllByText('Save');
      expect(formSubmitButtons).toHaveLength(2);
    });
  });
});
