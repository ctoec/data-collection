import React from 'react';
import {
  snapshotTestHelper,
  accessibilityTestHelper,
} from '../../../testHelpers';
import { DeleteRecord } from '.';
import { Child } from '../../../shared/models';

const child = {
  id: '00000000-0000-0000-0000-000000000000',
  firstName: 'First',
  lastName: 'Last',
} as Child;

describe('EditRecord', () => {
  describe('DeleteRecord', () => {
    snapshotTestHelper(<DeleteRecord child={child} toggleOpen={jest.fn()} />);

    accessibilityTestHelper(
      <DeleteRecord child={child} toggleOpen={jest.fn()} />
    );
  });
});
