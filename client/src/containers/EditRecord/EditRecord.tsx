import React, { useState, useContext, useEffect } from 'react';
import { useParams, useLocation, useHistory } from 'react-router-dom';
import { TabNav, Button } from '@ctoec/component-library';
import Modal from 'react-modal';
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
  ChildIdentifiersForm,
} from '../../components/EditForms';
import { WithdrawRecord } from './WithdrawRecord';
import { DeleteRecord } from './DeleteRecord';
import { useReportingPeriods } from '../../hooks/useReportingPeriods';
import { useAlerts } from '../../hooks/useAlerts';
import { getH1RefForTitle } from '../../utils/getH1RefForTitle';

const TAB_IDS = {
  IDENT: 'identifiers',
  CHILD: 'child',
  FAMILY: 'family',
  INCOME: 'income',
  ENROLLMENT: 'enrollment',
  C4K: 'c4k',
};

const EditRecord: React.FC = () => {
  const h1Ref = getH1RefForTitle('Edit record');
  const { childId } = useParams();
  const { accessToken } = useContext(AuthenticationContext);
  const [rowData, setRowData] = useState<Child>();
  const { alertElements, setAlerts } = useAlerts();

  // state for modal display
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  function toggleDeleteModal() {
    setDeleteModalOpen((isOpen) => !isOpen);
  }
  const [withdrawModalOpen, setWithdrawModalOpen] = useState(false);
  const toggleWithdrawModal = () => {
    setWithdrawModalOpen((isOpen) => !isOpen);
  };

  // Counter to trigger re-run of child fetch in
  // useEffect hook
  const [refetch, setRefetch] = useState<number>(0);

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

  const onSuccess = () => {
    setRefetch((r) => r + 1);
    setAlerts([
      {
        type: 'success',
        heading: 'Record updated',
        text: `Your changes to ${rowData?.firstName} ${rowData?.lastName}'s record have been saved.`,
      },
    ]);
  };

  const commonFormProps = {
    child: rowData,
    onSuccess,
    setAlerts,
    reportingPeriods,
  };

  return (
    <div className="margin-top-4 grid-container">
      <BackButton />
      {alertElements}
      <div className="display-flex flex-justify">
        <div>
          <h1 ref={h1Ref} className="margin-top-0">
            <span className="h2 h2--lighter">Edit record </span>
            {rowData.firstName} {rowData.lastName}
          </h1>
        </div>
        <div className="display-flex flex-col flex-align-center">
          {!!activeEnrollment && (
            <>
              <Button
                appearance="unstyled"
                text="Withdraw"
                onClick={() => toggleWithdrawModal()}
                className="margin-right-2"
              />
              <Modal
                isOpen={withdrawModalOpen}
                onRequestClose={toggleWithdrawModal}
                shouldCloseOnEsc={true}
                shouldCloseOnOverlayClick={true}
                appElement="#main-content"
                contentLabel="Withdraw record"
                style={{
                  content: { bottom: 'auto', transform: 'translate(0%, 100%)' },
                }}
              >
                <WithdrawRecord
                  childName={rowData.firstName}
                  enrollment={activeEnrollment}
                  reportingPeriods={reportingPeriods}
                  toggleOpen={toggleWithdrawModal}
                />
              </Modal>
            </>
          )}
          <Button
            appearance="unstyled"
            onClick={toggleDeleteModal}
            text="Delete record"
            className="margin-right-0"
          />
          <Modal
            isOpen={deleteModalOpen}
            onRequestClose={toggleDeleteModal}
            shouldCloseOnEsc={true}
            shouldCloseOnOverlayClick={true}
            contentLabel="Delete record"
            // Use style to dynamically trim the bottom to fit the
            // message, then center in middle of form
            style={{
              content: { bottom: 'auto', transform: 'translate(0%, 100%)' },
            }}
          >
            <DeleteRecord child={rowData} toggleOpen={toggleDeleteModal} />
          </Modal>
        </div>
      </div>
      <TabNav
        items={[
          {
            id: TAB_IDS.IDENT,
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
