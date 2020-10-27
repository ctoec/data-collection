import React from 'react';
import { Moment } from 'moment';
import { ReactComponent as Calendar } from '@ctoec/component-library/dist/assets/images/calendar.svg';
import { Button } from '@ctoec/component-library';

type MonthFilterModal = {
  filterByMonth?: Moment;
  setFilterByMonth: (_: any) => void;
};

export const MonthFilterIndicator: React.FC<MonthFilterModal> = ({
  filterByMonth,
  setFilterByMonth,
}) =>
  filterByMonth ? (
    <div className="month-filter-indicator">
      <Calendar className="height-5" />
      <div className="h2">{filterByMonth.format('MMMM YYYY')}</div>
      <Button
        appearance="unstyled"
        onClick={() => setFilterByMonth(undefined)}
        text="Return to current roster"
      />
    </div>
  ) : (
    <></>
  );
