import React from 'react';
import {
  snapshotTestHelper,
  accessibilityTestHelper,
} from '../../../testHelpers';
import { FamilyInfoForm } from './Form';
import { Family, Child } from '../../../shared/models';

describe('EditRecord', () => {
  describe('FamilyInfo', () => {
    snapshotTestHelper(
      <FamilyInfoForm
        child={{} as Child}
        onSuccess={jest.fn()}
        setAlerts={jest.fn()}
      />
    );

    accessibilityTestHelper(
      <FamilyInfoForm
        child={{} as Child}
        onSuccess={jest.fn()}
        setAlerts={jest.fn()}
      />
    );
  });
});
