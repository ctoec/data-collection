import React from 'react';
import {
  accessibilityTestHelper,
  snapshotTestHelper,
} from '../../../testHelpers';
import { CareForKidsForm } from './CareForKids';
import { Family, Child } from '../../../shared/models';

const child = {
  id: '00000000-0000-0000-0000-000000000000',
  firstName: 'First',
  lastName: 'Last',
  family: {} as Family,
} as Child;

describe('EditRecord', () => {
  describe('CareForKids', () => {
    snapshotTestHelper(
      <CareForKidsForm child={child} refetchChild={jest.fn()} />
    );
    accessibilityTestHelper(
      <CareForKidsForm child={child} refetchChild={jest.fn()} />
    );
  });
});
