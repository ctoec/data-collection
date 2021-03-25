import React from 'react';
import {
  snapshotTestHelper,
  accessibilityTestHelper,
} from '../../../testHelpers';
import { ChildInfoForm } from './Form';
import { Family, Organization } from '../../../shared/models';

const child = {
  id: '00000000-0000-0000-0000-000000000000',
  firstName: 'First',
  lastName: 'Last',
  family: {} as Family,
  organization: {} as Organization,
};

describe('EditRecord', () => {
  describe('ChildInfo', () => {
    snapshotTestHelper(
      <ChildInfoForm
        child={child}
        afterSaveSuccess={jest.fn()}
        setAlerts={jest.fn()}
        topHeadingLevel="h2"
      />,
      { wrapInRouter: true }
    );

    accessibilityTestHelper(
      <ChildInfoForm
        child={child}
        afterSaveSuccess={jest.fn()}
        setAlerts={jest.fn()}
        topHeadingLevel="h3"
      />,
      { wrapInRouter: true }
    );
  });
});
