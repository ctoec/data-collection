import React from 'react';
import {
  snapshotTestHelper,
  accessibilityTestHelper,
} from '../../../testHelpers';
import { ChildIdentifiersForm } from './Form';
import {
  Family,
  Child,
  UniqueIdType,
  Organization,
} from '../../../shared/models';

const child = {
  id: '00000000-0000-0000-0000-000000000000',
  firstName: 'First',
  lastName: 'Last',
  family: {} as Family,
  organization: { uniqueIdType: UniqueIdType.None },
} as Child;

describe('EditRecord', () => {
  describe('ChildIdentifiers', () => {
    snapshotTestHelper(
      <ChildIdentifiersForm
        child={child}
        afterSaveSuccess={jest.fn()}
        setAlerts={jest.fn()}
        topHeadingLevel="h2"
      />,
      { wrapInRouter: true, name: 'matches snapshot - no unique id' }
    );

    snapshotTestHelper(
      <ChildIdentifiersForm
        child={{
          ...child,
          organization: { uniqueIdType: UniqueIdType.Other } as Organization,
        }}
        afterSaveSuccess={jest.fn()}
        setAlerts={jest.fn()}
        topHeadingLevel="h2"
      />,
      { wrapInRouter: true, name: 'matches snapshot - other unique id' }
    );

    snapshotTestHelper(
      <ChildIdentifiersForm
        child={{
          ...child,
          organization: { uniqueIdType: UniqueIdType.SASID } as Organization,
        }}
        afterSaveSuccess={jest.fn()}
        setAlerts={jest.fn()}
        topHeadingLevel="h2"
      />,
      { wrapInRouter: true, name: 'matches snapshot - sasid' }
    );

    accessibilityTestHelper(
      <ChildIdentifiersForm
        child={child}
        afterSaveSuccess={jest.fn()}
        setAlerts={jest.fn()}
        topHeadingLevel="h2"
      />,
      { wrapInRouter: true }
    );
  });
});
