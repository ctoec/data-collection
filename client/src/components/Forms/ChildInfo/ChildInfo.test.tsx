import React from 'react';
import {
  snapshotTestHelper,
  accessibilityTestHelper,
} from '../../../testHelpers';
import { ChildInfoForm } from './Form';
import { Family } from '../../../shared/models';

const child = {
  id: '00000000-0000-0000-0000-000000000000',
  firstName: 'First',
  lastName: 'Last',
  family: {} as Family,
};

describe('EditRecord', () => {
  describe('ChildInfo', () => {
    snapshotTestHelper(
      <ChildInfoForm
        child={child}
        afterSaveSuccess={jest.fn()}
        setAlerts={jest.fn()}
      />,
      { wrapInRouter: true }
    );

    accessibilityTestHelper(
      <ChildInfoForm
        child={child}
        afterSaveSuccess={jest.fn()}
        setAlerts={jest.fn()}
      />,
      { wrapInRouter: true }
    );
  });
});
