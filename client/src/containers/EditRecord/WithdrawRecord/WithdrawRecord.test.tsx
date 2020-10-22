import React from 'react';
import {
  snapshotTestHelper,
  accessibilityTestHelper,
  renderHelper,
} from '../../../testHelpers';
import { WithdrawRecord } from './WithdrawRecord';
import { Enrollment, Child } from '../../../shared/models';
import { RenderResult, fireEvent } from '@testing-library/react';
import { screen } from '@testing-library/dom';
import { axe } from 'jest-axe';

const enrollment = {
  site: { siteName: 'Name' },
} as Enrollment;
describe('EditRecord', () => {
  describe('WithdrawRecord', () => {
    const expandModal = async (renderResult: RenderResult) => {
      const withdrawButton = await renderResult.findByText('Withdraw');
      fireEvent.click(withdrawButton);
    };
    it('matches snapshot', async () => {
      await renderHelper(
        <WithdrawRecord
          child={{ firstName: 'Name' } as Child}
          enrollment={enrollment}
        />,
        { before: expandModal }
      );

      const modal = screen.getByRole('dialog');
      expect(modal).toMatchSnapshot();
    });

    it('passes AXE accessibility checks', async () => {
      await renderHelper(
        <WithdrawRecord
          child={{ firstName: 'Name' } as Child}
          enrollment={enrollment}
        />,
        { before: expandModal }
      );

      const modal = screen.getByRole('dialog');
      const results = await axe(modal);
      expect(results).toHaveNoViolations();
    });
  });
});
