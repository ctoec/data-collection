import React, { useState, useContext, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { TabNav } from '@ctoec/component-library';
import { TableRow } from '../CheckData/CheckData';
import AuthenticationContext from '../../contexts/AuthenticationContext/AuthenticationContext';
import { apiGet } from '../../utils/api';

const EditRecord: React.FC = () => {
  const { reportId, rowId } = useParams();
  const { accessToken } = useContext(AuthenticationContext);
  const [rowData, setRowData] = useState<TableRow>();

  useEffect(() => {
    apiGet(`enrollment-reports/${reportId}/row/${rowId}`, {
      accessToken,
    }).then((_rowData) => setRowData(_rowData));
  }, [accessToken, reportId, rowId]);

  return rowData ? (
    <div className="grid-container">
      <div className="margin-top-4">
        <h2>
          Edit information for {rowData.child.firstName}{' '}
          {rowData.child.lastName}
        </h2>
      </div>
      <TabNav
        items={[
          // TODO: Each of these can be refactored into a form element that
          // we store somewhere in the repo and just call here. This is
          // just a placeholder as we develop the forms.
          {
            id: 'child-tab',
            text: 'Child Info',
            content: <span>This is where the child info form goes</span>,
          },
          {
            id: 'family-tab',
            text: 'Family Info',
            content: <span>This is where the family info form goes</span>,
          },
          {
            id: 'income-tab',
            text: 'Family Income',
            content: <span>This is where the family income form goes</span>,
          },
          {
            id: 'enrollment-tab',
            text: 'Enrollment and funding',
            content: <span>This is where the enrollment form goes</span>,
          },
          {
            id: 'care-tab',
            text: 'Care 4 Kids',
            content: <span>This is where the care for kids form goes</span>,
          },
        ]}
        activeId="child-tab"
      />
    </div>
  ) : (
    <> </>
  );
};

export default EditRecord;
