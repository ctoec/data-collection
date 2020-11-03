import React from 'react';
import { RenderResult, render, cleanup, act } from '@testing-library/react';
import { axe } from 'jest-axe';
import { BrowserRouter } from 'react-router-dom';
import { SWRConfig } from 'swr';
import { apiGet } from './utils/api';

type RenderHelperOpts = {
  before?: (_: RenderResult) => Promise<void>;
  wrapInRouter?: boolean;
  wrapInSWRConfig?: boolean;
  name?: string;
};

export const renderHelper = async (
  component: React.ReactElement,
  opts: RenderHelperOpts = {}
) => {
  let renderComponent = component;
  if (opts.wrapInRouter)
    renderComponent = <BrowserRouter>{renderComponent}</BrowserRouter>;
  if (opts.wrapInSWRConfig)
    renderComponent = (
      <SWRConfig value={{ fetcher: apiGet }}>{renderComponent}</SWRConfig>
    );

  const renderResult = render(renderComponent);

  if (opts.before) {
    await opts.before(renderResult);
  }
  return renderResult;
};

export const accessibilityTestHelper = (
  component: React.ReactElement,
  opts: RenderHelperOpts = {}
) => {
  it(opts.name || 'passes AXE accessibility checks', async () => {
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
  opts: RenderHelperOpts = {}
) => {
  it(opts.name || 'matches snapshot', async () => {
    await act(async () => {
      const renderResult = await renderHelper(component, opts);
      expect(renderResult.asFragment()).toMatchSnapshot();
    });

    cleanup();
  });
};
