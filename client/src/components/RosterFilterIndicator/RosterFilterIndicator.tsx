import React from 'react';
import { ReactComponent as Calendar } from '@ctoec/component-library/dist/assets/images/calendar.svg';
import { Button } from '@ctoec/component-library';

type RosterFilterIndicatorProps = {
  filterTitleText: string;
  reset: (_: any) => void;
};

export const RosterFilterIndicator: React.FC<RosterFilterIndicatorProps> = ({
  filterTitleText,
  reset,
}) =>
  <div className="roster-filter-indicator">
    <Calendar className="height-5" />
    <div className="h2">{filterTitleText}</div>
    <Button
      appearance="unstyled"
      onClick={reset}
      text="Return to current roster"
    />
  </div>
