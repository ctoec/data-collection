import React from 'react';
import {
  renderHelper,
} from '../../../testHelpers';
import { WithdrawRecord } from '.';
import { Enrollment } from '../../../shared/models';
import { RenderResult, fireEvent, cleanup } from '@testing-library/react';
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
          childName="Name"
          enrollment={enrollment}
          reportingPeriods={[]}
        />,
        { before: expandModal }
      );

      const modal = screen.getByRole('dialog');
      expect(modal).toMatchSnapshot();
    });

    it('passes AXE accessibility checks', async () => {
      await renderHelper(
        <WithdrawRecord
          childName="Name"
          enrollment={enrollment}
          reportingPeriods={[]}
        />,
        { before: expandModal }
      );

      const modal = screen.getByRole('dialog');
      const results = await axe(modal);
      expect(results).toHaveNoViolations();
      cleanup();
    });
  });
});
