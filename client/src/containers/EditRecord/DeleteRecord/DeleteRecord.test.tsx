import React from 'react';
import { screen } from '@testing-library/dom';
import { DeleteRecord } from '.';
import { Child } from '../../../shared/models';
import {
  RenderResult,
  fireEvent,
  wait,
  render,
  act,
  waitFor,
} from '@testing-library/react';
import { renderHelper } from '../../../testHelpers';
import { axe } from 'jest-axe';

const child = {
  id: '00000000-0000-0000-0000-000000000000',
  firstName: 'First',
  lastName: 'Last',
} as Child;

describe('EditRecord', () => {
  describe('DeleteRecord', () => {
    const expandModal = async (renderResult: RenderResult) => {
      const deleteButton = renderResult.getByText(/Delete/);
      fireEvent.click(deleteButton);
    };

    it('matches snapshot', async () => {
      await renderHelper(<DeleteRecord child={child} />, {
        before: expandModal,
      });

      const modal = screen.getByRole('dialog');
      expect(modal).toMatchSnapshot();
    });

    it('passes AXE accessibility checks', async () => {
      await renderHelper(<DeleteRecord child={child} />, {
        before: expandModal,
      });

      const modal = screen.getByRole('dialog');
      const results = await axe(modal);
      expect(results).toHaveNoViolations();
    });
  });
});
