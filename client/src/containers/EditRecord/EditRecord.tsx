import React, { useState, useContext, useEffect } from 'react';
import { useParams, useLocation, useHistory } from 'react-router-dom';
import { TabNav, Button, } from '@ctoec/component-library';
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
import { WithdrawForm } from './Forms/Withdraw/Form';
import { useReportingPeriods } from '../../hooks/useReportingPeriods';
import { DeleteRecord } from './Forms/DeleteRecord';
import { ChildIdentifiersForm } from './Forms/ChildIdentifiers/Form';
import { useAlerts } from '../../hooks/useAlerts';

const TAB_IDS = {
  IDENT: 'identifiers',
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
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const { alertElements, setAlerts } = useAlerts();

  // Basic trigger functions to operate the delete warning modal
  function toggleDeleteModal() {
    setDeleteModalOpen(!deleteModalOpen);
  }

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
  // TODO: we should probably use context rather than making lots of network requests
  const { reportingPeriods } = useReportingPeriods();

  // Get child data
  useEffect(() => {
    apiGet(`children/${childId}`, {
      accessToken,
    }).then((_rowData) => setRowData(_rowData));
  }, [accessToken, childId, refetch]);

  if (!rowData) {
    return <></>;
  }
  const activeEnrollment = (rowData?.enrollments || []).find((e) => !e.exit);

  const commonFormProps = {
    child: rowData,
    onSuccess: refetchChild,
    reportingPeriods,
    setAlerts,
  };

  return (
    <div className="margin-top-4 grid-container">
      <BackButton />
      {alertElements}
      <div className="display-flex flex-justify">
        <div>
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
                className="margin-right-2"
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
          <Button
            appearance="unstyled"
            onClick={toggleDeleteModal}
            text="Delete record"
            className="margin-right-0"
          />
          <DeleteRecord
            child={rowData}
            isOpen={deleteModalOpen}
            toggleOpen={toggleDeleteModal}
          />
        </div>
      </div>
      <TabNav
        items={[
          {
            id: TAB_IDS.CHILD,
            text: 'Child Identifiers',
            content: <ChildIdentifiersForm {...commonFormProps} />,
          },
          {
            id: TAB_IDS.CHILD,
            text: 'Child Info',
            content: <ChildInfoForm {...commonFormProps} />,
          },
          {
            id: TAB_IDS.FAMILY,
            text: 'Family Address',
            content: <FamilyInfoForm {...commonFormProps} />,
          },
          {
            id: TAB_IDS.INCOME,
            text: 'Family Income',
            content: <FamilyIncomeForm {...commonFormProps} />,
          },
          {
            id: TAB_IDS.ENROLLMENT,
            text: 'Enrollment and funding',
            content: <EnrollmentFundingForm {...commonFormProps} />,
          },
          {
            id: TAB_IDS.C4K,
            text: 'Care 4 Kids',
            content: <CareForKidsForm {...commonFormProps} />,
          },
        ]}
        activeId={activeTab}
        onClick={(tabId) => {
          history.replace({ hash: tabId });
        }}
      />
    </div>
  );
};

export default EditRecord;
