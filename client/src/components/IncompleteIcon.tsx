import React from 'react';
import { InlineIcon, TooltipWrapper } from '@ctoec/component-library';

/**
 * Basic component that layers a tooltip wrapper around the
 * missing info icon. Tooltip appears on standard hover
 * behavior.
 */
export const IncompleteIcon = () => (
  <TooltipWrapper tooltipText="Add missing info">
    {InlineIcon({ icon: 'incomplete' })}
  </TooltipWrapper>
);
