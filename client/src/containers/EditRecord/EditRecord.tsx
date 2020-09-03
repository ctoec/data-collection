import React, { useState, useContext, useEffect } from 'react';
import { useParams, useLocation, useHistory } from 'react-router-dom';
import { TabNav } from '@ctoec/component-library';

import AuthenticationContext from '../../contexts/AuthenticationContext/AuthenticationContext';
import { apiGet } from '../../utils/api';
import { Child } from '../../shared/models';
import { BackButton } from '../../components/BackButton';
import {
  FamilyIncomeForm,
  ChildInfoForm,
  CareForKidsForm,
  FamilyInfoForm,
  EnrollmentFundingForm,
} from './Forms';

const TAB_IDS = {
  CHILD: 'child',
  FAMILY: 'family',
  INCOME: 'income',
  ENROLLMENT: 'enrollment',
  C4K: 'c4k',
};

const EditRecord: React.FC = () => {
  const { childId } = useParams();
  const { accessToken } = useContext(AuthenticationContext);
  const [rowData, setRowData] = useState<Child>();

  // Counter to trigger re-run of child fetch in
  // useEffect hook
  const [refetch, setRefetch] = useState<number>(0);
  const refetchChild = () => {
    setRefetch((r) => r + 1);
  };

  // Persist active tab in URL hash
  const activeTab = useLocation().hash.slice(1);
  const history = useHistory();
  // and make child tab active by default if no hash
  useEffect(() => {
    if (!activeTab) {
      history.replace({ hash: TAB_IDS.CHILD });
    }
  }, []);

  useEffect(() => {
    apiGet(`children/${childId}`, {
      accessToken,
    }).then((_rowData) => setRowData(_rowData));
  }, [accessToken, childId, refetch]);

  return rowData ? (
    <div className="grid-container">
      <div className="margin-top-4">
        <BackButton />
        <h1>
          Edit information for {rowData.firstName} {rowData.lastName}
        </h1>
      </div>
      <TabNav
        items={[
          {
            id: TAB_IDS.CHILD,
            text: 'Child Info',
            content: (
              <ChildInfoForm child={rowData} refetchChild={refetchChild} />
            ),
          },
          {
            id: TAB_IDS.FAMILY,
            text: 'Family Info',
            content: (
              <FamilyInfoForm
                family={rowData.family}
                refetchChild={refetchChild}
              />
            ),
          },
          {
            id: TAB_IDS.INCOME,
            text: 'Family Income',
            content: (
              <FamilyIncomeForm
                familyId={rowData.family.id}
                determinations={rowData.family.incomeDeterminations || []}
                refetchChild={refetchChild}
              />
            ),
          },
          {
            id: TAB_IDS.ENROLLMENT,
            text: 'Enrollment and funding',
            content: (
              <EnrollmentFundingForm
                enrollments={rowData.enrollments || []}
                childName={rowData.firstName}
                childId={rowData.id}
                refetchChild={refetchChild}
              />
            ),
          },
          {
            id: TAB_IDS.C4K,
            text: 'Care 4 Kids',
            content: (
              <CareForKidsForm child={rowData} refetchChild={refetchChild} />
            ),
          },
        ]}
        activeId={activeTab}
        onClick={(tabId) => {
          history.replace({ hash: tabId });
        }}
      />
    </div>
  ) : (
    <> </>
  );
};

export default EditRecord;
