import React, { useState, useContext, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { TabNav } from '@ctoec/component-library';
import AuthenticationContext from '../../contexts/AuthenticationContext/AuthenticationContext';
import { apiGet } from '../../utils/api';
import { Child } from '../../shared/models';
import { CareForKidsForm } from './Forms/CareForKidsForm';

const EditRecord: React.FC = () => {
  const { childId } = useParams();
  const { accessToken } = useContext(AuthenticationContext);
  const [rowData, setRowData] = useState<Child>();

  useEffect(() => {
    apiGet(`children/${childId}`, {
      accessToken,
    }).then((_rowData) => setRowData(_rowData));
  }, [accessToken, childId]);

  // Wrapped method to hand off to child forms to allow lifting
  // state back up to the EditRecord page. This is good because
  // then only the EditRecord page has to make any calls to the
  // database or API, allowing for a single, unfiied formulation
  // here rather than individual forms.
  function handleChange(newRow: Child) {
    setRowData(newRow);
  }

  return rowData ? (
    <div className="grid-container">
      <div className="margin-top-4">
        <h2>
          Edit information for {rowData.firstName} {rowData.lastName}
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
            content: (
              <CareForKidsForm initState={rowData} passData={handleChange} />
            ),
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
