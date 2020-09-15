import React from 'react';
import { RenderResult, render, cleanup, act } from '@testing-library/react';
import { axe } from 'jest-axe';
import { BrowserRouter } from 'react-router-dom';

export const renderHelper = async (
  component: React.ReactElement,
  opts: {
    before?: (_: RenderResult) => Promise<void>;
    wrapInRouter?: boolean;
  } = {}
) => {
  const renderResult = render(
    opts.wrapInRouter ? <BrowserRouter>{component}</BrowserRouter> : component
  );

  if (opts.before) {
    await opts.before(renderResult);
  }
  return renderResult;
};

export const accessibilityTestHelper = (
  component: React.ReactElement,
  opts: {
    before?: (_: RenderResult) => Promise<void>;
    wrapInRouter?: boolean;
  } = {}
) => {
  it('passes AXE accessibility checks', async () => {
    await act(async () => {
      const renderResult = await renderHelper(component, opts);
      const results = await axe(renderResult.container);
      expect(results).toHaveNoViolations();
    });

    cleanup();
  });
};

export const snapshotTestHelper = (
  component: React.ReactElement,
  opts: {
    before?: (_: RenderResult) => Promise<void>;
    wrapInRouter?: boolean;
  } = {}
) => {
  it('matches snapshot', async () => {
    await act(async () => {
      const renderResult = await renderHelper(component, opts);
      expect(renderResult.asFragment()).toMatchSnapshot();
    });

    cleanup();
  });
};
