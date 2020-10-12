import React from 'react';
import {
  snapshotTestHelper,
  accessibilityTestHelper,
} from '../../../testHelpers';
import { ChildIdentifiersForm } from './Form';
import { Family, Child } from '../../../shared/models';

const child = {
  id: '00000000-0000-0000-0000-000000000000',
  firstName: 'First',
  lastName: 'Last',
  family: {} as Family,
} as Child;

describe('EditRecord', () => {
  describe('ChildIdentifiers', () => {
    snapshotTestHelper(
      <ChildIdentifiersForm
        child={child}
        afterSaveSuccess={jest.fn()}
        setAlerts={jest.fn()}
      />,
      { wrapInRouter: true }
    );

    accessibilityTestHelper(
      <ChildIdentifiersForm
        child={child}
        afterSaveSuccess={jest.fn()}
        setAlerts={jest.fn()}
      />,
      { wrapInRouter: true }
    );
  });
});
