import React, { useState } from 'react';
import moment, { Moment } from 'moment';
import cx from 'classnames';
import {
  Button,
  DateInput,
  FormStatusProps,
  Modal,
} from '@ctoec/component-library';

type MonthFilterModal = {
  filterByMonth?: Moment;
  setFilterByMonth: (_: any) => void;
  toggleModal: () => void;
  isModalOpen: boolean;
};

export const MonthFilterModal: React.FC<MonthFilterModal> = ({
  filterByMonth,
  setFilterByMonth,
  toggleModal,
  isModalOpen,
}) => {
  // Duplicate of month value on roster-- needed bc we want to preserve the value but don't want to trigger the filtering until the user clicks the button
  const [selectedMonth, setSelectedMonth] = useState<Moment | undefined>(
    filterByMonth
  );
  const monthRecentEnough = selectedMonth?.isSameOrAfter(
    moment('July 2020', 'MMMM YYYY')
  );
  const monthInPast = selectedMonth?.isSameOrBefore(moment());
  let monthStatus: FormStatusProps | undefined = undefined;
  if (selectedMonth && !monthRecentEnough) {
    // Must be same or after July 2020
    monthStatus = {
      type: 'error',
      id: 'month-too-far-back',
      message: 'Month cannot be before July 2020',
    };
  } else if (selectedMonth && !monthInPast) {
    // Must be same or before right now
    monthStatus = {
      type: 'error',
      id: 'month-in-future',
      message: 'Month cannot be in the future',
    };
  }

  return (
    <Modal
      isOpen={isModalOpen}
      onModalClose={toggleModal}
      header={<h2>View past enrollments</h2>}
      content={
        <>
          <div className={cx('grid-row', { 'margin-left-3': !!monthStatus })}>
            <DateInput
              defaultValue={selectedMonth}
              onChange={(moment) => setSelectedMonth(moment)}
              label="View your roster for a past month"
              id="roster-filter-date-input"
              hideField={{
                day: true,
                calendar: true,
              }}
              status={monthStatus}
            />
          </div>
          <div className="margin-top-4">
            <div className="grid-row flex-first-baseline space-between-4">
              <Button
                appearance="outline"
                onClick={toggleModal}
                text="No, cancel"
              />
              <Button
                appearance="default"
                onClick={() => {
                  if (!monthStatus) {
                    setFilterByMonth(selectedMonth);
                    toggleModal();
                  }
                }}
                disabled={!!monthStatus}
                text="View roster"
              />
            </div>
          </div>
        </>
      }
    />
  );
};
