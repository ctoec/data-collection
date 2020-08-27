import React, { useState, useContext, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { TabNav } from '@ctoec/component-library';
import AuthenticationContext from '../../contexts/AuthenticationContext/AuthenticationContext';
import { apiGet } from '../../utils/api';
import { Child, Family } from '../../shared/models';
import { CareForKidsForm } from './Forms/CareForKidsForm';
import { FamilyInfoForm } from './Forms/FamilyInfoForm';

const EditRecord: React.FC = () => {
  const { childId } = useParams();
  const { accessToken } = useContext(AuthenticationContext);
  const [rowData, setRowData] = useState<Child>();
  const [refetch, setRefetch] = useState<number>(0);

  useEffect(() => {
    apiGet(`children/${childId}`, {
      accessToken,
    }).then((_rowData) => setRowData(_rowData));
  }, [accessToken, childId, refetch]);

  const refetchChild = () => {
    setRefetch((r) => r + 1);
  };

  // // Wrapped method to hand off to child forms to allow lifting
  // // state back up to the EditRecord page.
  // function handleChildChange(newRow: Child) {
  //   setRowData(newRow);
  // }

  // // Wrapped method that creates a deep clone of the local state
  // // to hand off to the family form so that changes it makes
  // // a) only affect the family (which is the only scope it needs
  // // to know), and b) can be passed back up and saved
  // function handleFamilyChange(newFam: Family) {
  //   var newState: Child = JSON.parse(JSON.stringify(rowData));
  //   newState.family = newFam;
  //   setRowData(newState);
  // }

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
            content: (
              <FamilyInfoForm
                initState={rowData.family}
                refetchChild={refetchChild}
              />
            ),
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
              <CareForKidsForm
                initState={rowData}
                refetchChild={refetchChild}
              />
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
