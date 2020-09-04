import React from 'react';
import { RenderResult, render, cleanup, act } from '@testing-library/react';
import { axe } from 'jest-axe';

export const accessibilityTestHelper = (
  component: React.ReactElement,
  before?: (_: RenderResult) => Promise<void>
) => {
  it('passes AXE accessibility checks', async () => {
    await act(async () => {
      const renderResult = render(component);
      if (before) {
        await before(renderResult);
      }
      const results = await axe(renderResult.container);
      expect(results).toHaveNoViolations();
    });
    cleanup();
  });
};

export const snapshotTestHelper = (component: React.ReactElement) => {
  it('matches snapshot', async () => {
    await act(async () => {
      const { asFragment } = render(component);
      expect(asFragment()).toMatchSnapshot();
    });
  });
};
