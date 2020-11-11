import React from 'react';
import { ReactComponent as Calendar } from '@ctoec/component-library/dist/assets/images/calendar.svg';
import { ReactComponent as History } from '@ctoec/component-library/dist/assets/images/history.svg';
import { Button } from '@ctoec/component-library';

type RosterFilterIndicatorProps = {
  filterTitleText: string;
  reset: (_: any) => void;
  icon?: 'calendar' | 'history';
};

export const RosterFilterIndicator: React.FC<RosterFilterIndicatorProps> = ({
  filterTitleText,
  reset,
  icon
}) =>
  <div className="roster-filter-indicator">
    {icon === 'calendar' ?
      <Calendar className="height-5" />
      : <History className="height-5" />
    }
    <div className="roster-filter-indicator__title">{filterTitleText}</div>
    <Button
      appearance="unstyled"
      onClick={reset}
      text="Return to current roster"
    />
  </div>
