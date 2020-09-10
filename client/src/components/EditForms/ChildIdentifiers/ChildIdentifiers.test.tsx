import React from 'react';
import {
  snapshotTestHelper,
  accessibilityTestHelper,
} from '../../../testHelpers';
import { ChildIdentifiersForm } from './Form';
import { Family } from '../../../shared/models';

const child = {
  id: '00000000-0000-0000-0000-000000000000',
  firstName: 'First',
  lastName: 'Last',
  family: {} as Family,
};

describe('EditRecord', () => {
  describe('ChildIdentifiers', () => {
    snapshotTestHelper(
      <ChildIdentifiersForm
        child={child}
        onSuccess={jest.fn()}
        setAlerts={jest.fn()}
      />
    );

    accessibilityTestHelper(
      <ChildIdentifiersForm
        child={child}
        onSuccess={jest.fn()}
        setAlerts={jest.fn()}
      />
    );
  });
});
