import React, { useState, useContext, useEffect } from 'react';
import { useParams, useLocation, useHistory, Link } from 'react-router-dom';
import { TabNav, Button } from '@ctoec/component-library';

import AuthenticationContext from '../../contexts/AuthenticationContext/AuthenticationContext';
import { apiGet } from '../../utils/api';
import { Child, ReportingPeriod } from '../../shared/models';
import { BackButton } from '../../components/BackButton';
import {
  FamilyIncomeForm,
  ChildInfoForm,
  CareForKidsForm,
  FamilyInfoForm,
  EnrollmentFundingForm,
} from './Forms';
import { WithdrawForm } from './Forms/Withdraw/Form';

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
  // (but only on first render)
  useEffect(() => {
    if (!activeTab) {
      history.replace({ hash: TAB_IDS.CHILD });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [withdrawModalOpen, setWithdrawModalOpen] = useState(false);
  const toggleModal = () => {
    setWithdrawModalOpen((isOpen) => !isOpen);
  };

  // Get reporting periods (needed to update enrollments with fundings)
  const [reportingPeriods, setReportingPeriods] = useState<ReportingPeriod[]>(
    []
  );
  useEffect(() => {
    apiGet('reporting-periods', { accessToken }).then((_reportingPeriods) =>
      setReportingPeriods(_reportingPeriods || [])
    );
  }, [accessToken]);

  // Get child data
  useEffect(() => {
    apiGet(`children/${childId}`, {
      accessToken,
    }).then((_rowData) => setRowData(_rowData));
  }, [accessToken, childId, refetch]);

  const activeEnrollment = (rowData?.enrollments || []).find((e) => !e.exit);
  return rowData ? (
    <div className="grid-container">
      <div className="margin-top-4 display-flex flex-justify">
        <div>
          <BackButton />
          <h1>Edit record</h1>
          <h2>
            {rowData.firstName} {rowData.lastName}
          </h2>
        </div>
        <div className="display-flex flex-col flex-align-center">
          {!!activeEnrollment && (
            <>
              <Button
                appearance="unstyled"
                text="Withdraw"
                onClick={() => toggleModal()}
              />
              <WithdrawForm
                childName={rowData.firstName}
                enrollment={activeEnrollment}
                reportingPeriods={reportingPeriods}
                isOpen={withdrawModalOpen}
                toggleOpen={toggleModal}
              />
            </>
          )}
        </div>
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
                reportingPeriods={reportingPeriods}
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
