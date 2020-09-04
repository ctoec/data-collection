import React from 'react';
import {
  snapshotTestHelper,
  accessibilityTestHelper,
} from '../../../../testHelpers';
import { FamilyInfoForm } from './Form';
import { Family } from '../../../../shared/models';

describe('EditRecord', () => {
  describe('FamilyInfo', () => {
    snapshotTestHelper(
      <FamilyInfoForm family={{} as Family} refetchChild={jest.fn()} />
    );
    accessibilityTestHelper(
      <FamilyInfoForm family={{} as Family} refetchChild={jest.fn()} />
    );
  });
});
