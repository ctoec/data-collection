import { Button, Calendar, TextWithIcon } from '@ctoec/component-library';
import { Moment } from 'moment';
import React, { useState, useContext } from 'react';
import { AddRecordButton } from '../../components/AddRecordButton';
import { CSVExcelDownloadButton } from '../../components/CSVExcelDownloadButton';
import { MonthFilterModal } from './MonthFilter/MonthFilterModal';
import UserContext from '../../contexts/UserContext/UserContext';

type RosterButtonsTable = {
  filterByMonth?: Moment;
  setFilterByMonth: (_: any) => void;
};

export const RosterButtonsTable: React.FC<RosterButtonsTable> = ({
  filterByMonth,
  setFilterByMonth,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const toggleModal = () => setIsModalOpen((o) => !o);
  return (
    <table className="oec-table buttons-table margin-top-2 margin-bottom-4">
      <tbody>
        <tr>
          <th scope="row">Actions</th>
          <td>
            <div className="display-flex">
              <AddRecordButton
                className="margin-right-2"
                id="add-record-in-actions"
              />
              <CSVExcelDownloadButton fileType="csv" whichDownload="roster" />
            </div>
          </td>
        </tr>
        <tr>
          <th scope="row">Views</th>
          <td>
            <div className="display-flex">
              <Button
                text={<TextWithIcon Icon={Calendar} text="Past enrollments" />}
                appearance="unstyled"
                onClick={toggleModal}
              />
              <MonthFilterModal
                filterByMonth={filterByMonth}
                setFilterByMonth={setFilterByMonth}
                toggleModal={toggleModal}
                isModalOpen={isModalOpen}
              />
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  );
};
