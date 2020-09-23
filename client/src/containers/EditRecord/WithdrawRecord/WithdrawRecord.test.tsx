import React from 'react';
import {
  snapshotTestHelper,
  accessibilityTestHelper,
} from '../../../testHelpers';
import { WithdrawRecord } from '.';
import { Enrollment } from '../../../shared/models';

const enrollment = {
  site: { siteName: 'Name' },
} as Enrollment;
describe('EditRecord', () => {
  describe('WithdrawRecord', () => {
    snapshotTestHelper(
      <WithdrawRecord
        childName="Name"
        enrollment={enrollment}
        reportingPeriods={[]}
        toggleOpen={jest.fn()}
      />
    );

    accessibilityTestHelper(
      <WithdrawRecord
        childName="Name"
        enrollment={enrollment}
        reportingPeriods={[]}
        toggleOpen={jest.fn()}
      />
    );
  });
});
