import React from 'react';
import {
  snapshotTestHelper,
  accessibilityTestHelper,
} from '../../../testHelpers';
import { FamilyAddressForm } from './Form';
import { Child } from '../../../shared/models';

describe('EditRecord', () => {
  describe('FamilyInfo', () => {
    snapshotTestHelper(
      <FamilyAddressForm
        child={{} as Child}
        onSuccess={jest.fn()}
        setAlerts={jest.fn()}
      />,
      { wrapInRouter: true }
    );

    accessibilityTestHelper(
      <FamilyAddressForm
        child={{} as Child}
        onSuccess={jest.fn()}
        setAlerts={jest.fn()}
      />,
      { wrapInRouter: true }
    );
  });
});
