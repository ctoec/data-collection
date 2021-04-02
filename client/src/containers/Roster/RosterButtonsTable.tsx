import {
  Button,
  Calendar,
  History,
  TextWithIcon,
} from '@ctoec/component-library';
import moment from 'moment';
import React, { useContext, useState } from 'react';
import RosterContext from '../../contexts/RosterContext/RosterContext';
import { AddRecordButton } from '../../components/AddRecordButton';
import { CSVExcelDownloadButton } from '../../components/CSVExcelDownloadButton';
import { MonthFilterModal } from './MonthFilterModal';
import { QUERY_STRING_MONTH_FORMAT } from '../../containers/Roster/rosterUtils';

export const RosterButtonsTable: React.FC = () => {
  const { query, updateQueryMonth, updateQueryWithdrawn } = useContext(
    RosterContext
  );
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
                text={<TextWithIcon Icon={History} text="Withdrawn records" />}
                appearance="unstyled"
                onClick={() => updateQueryWithdrawn(true)}
                className="margin-right-2"
              />
              <Button
                text={
                  <TextWithIcon
                    Icon={Calendar}
                    text="Roster for a past month"
                  />
                }
                appearance="unstyled"
                onClick={toggleModal}
              />
              <MonthFilterModal
                filterByMonth={
                  moment.utc(query.month, QUERY_STRING_MONTH_FORMAT) ??
                  undefined
                }
                setFilterByMonth={updateQueryMonth}
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
