import React from 'react';
import {
  snapshotTestHelper,
  accessibilityTestHelper,
  renderHelper,
} from '../../../testHelpers';
import { ChildIdentifiersForm } from './Form';
import {
  BirthCertificateType,
  Child,
  Family,
  Organization,
} from '../../../shared/models';

const child = {
  name: 'First Last',
  firstName: 'First',
  lastName: 'Last',
  birthCertificateType: BirthCertificateType.unavailable,
  id: '00000000-0000-0000-0000-000000000000',
  family: {} as Family,
  organization: { id: 1 } as Organization,
} as Child;

describe('BatchEdit', () => {
  describe('EnrollmentFundingForm', () => {
    snapshotTestHelper(
      <ChildIdentifiersForm
        child={child}
        afterSaveSuccess={jest.fn}
        setAlerts={jest.fn()}
        showField={jest.fn()}
      />
    );

    accessibilityTestHelper(
      <ChildIdentifiersForm
        child={child}
        afterSaveSuccess={jest.fn}
        setAlerts={jest.fn()}
        showField={jest.fn()}
      />
    );

    it('only shows forms for children with identifier validationErrors', async () => {
      const renderResult = await renderHelper(
        <ChildIdentifiersForm
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
