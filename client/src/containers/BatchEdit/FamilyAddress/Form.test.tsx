import React from 'react';
import {
  snapshotTestHelper,
  accessibilityTestHelper,
  renderHelper,
} from '../../../testHelpers';
import { FamilyAddressForm } from './Form';
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
  family: {
    streetAddress: '1234 Number Drive',
    town: 'Placeville',
    state: 'MA',
  } as Family,
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
  describe('FamilyAddressForm', () => {
    snapshotTestHelper(
      <FamilyAddressForm
        child={child}
        afterSaveSuccess={jest.fn}
        setAlerts={jest.fn()}
        showField={jest.fn()}
      />
    );

    accessibilityTestHelper(
      <FamilyAddressForm
        child={child}
        afterSaveSuccess={jest.fn}
        setAlerts={jest.fn()}
        showField={jest.fn()}
      />
    );

    /**
     * Commented out because there is no "Save" button text for forms that aren't
     * EnrollmentFunding. The save thing was residual from earlier BatchEdit
     * testing.
     * TODO: Check to make sure this is cool to cut out.
     */
    // it('only shows forms for families with validationErrors in their address fields', async () => {
    //   const renderResult = await renderHelper(
    //     <FamilyAddressForm
    //       child={child}
    //       afterSaveSuccess={jest.fn}
    //       setAlerts={jest.fn()}
    //       showField={jest.fn()}
    //     />
    //   );

    //   // Assert there are only forms for objects with validation errors:
    //   // 1 enrollment and 1 funding.
    //   //
    //   // For now, we can only deduce presence of forms based on their submit
    //   // buttons (TODO: add some headings to the forms?)
    //   const formSubmitButtons = await renderResult.findAllByText('Save');
    //   expect(formSubmitButtons).toHaveLength(2);
    // });
  });
});
