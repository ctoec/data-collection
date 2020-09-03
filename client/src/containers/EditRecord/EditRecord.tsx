import React, { useState, useContext, useEffect } from 'react';
import { useParams, useLocation, useHistory } from 'react-router-dom';
import { TabNav, Button } from '@ctoec/component-library';
import AuthenticationContext from '../../contexts/AuthenticationContext/AuthenticationContext';
import { apiGet, apiDelete } from '../../utils/api';
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
import Modal from 'react-modal';
import { useReportingPeriods } from '../../hooks/useReportingPeriods';

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
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

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

  function deleteRecord() {
    setIsDeleting(true);
    apiDelete(`children/${childId}`, { accessToken })
      // TODO: Swap this total hack out for the roster page
      // once we have that implemented
      .then(() => history.push('/check-data/1'))

      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setDeleteModalOpen(false);
        setIsDeleting(false);
      });
  }

  if (!rowData) {
    return <></>;
  }
  const activeEnrollment = (rowData?.enrollments || []).find((e) => !e.exit);

  const commonFormProps = {
    child: rowData,
    onSuccess: refetchChild,
    reportingPeriods,
  };

  return (
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
                className='margin-right-2'
              />
              <WithdrawForm
                childName={rowData.firstName}
                enrollment={activeEnrollment}
                reportingPeriods={reportingPeriods}
                isOpen={withdrawModalOpen}
                toggleOpen={toggleModal}
              />
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
                contentLabel="Delete Modal"
                // Use style to dynamically trim the bottom to fit the
                // message, then center in middle of form
                style={{
                  content: { bottom: 'auto', transform: 'translate(0%, 100%)' },
                }}
              >
                <div className="grid-container">
                  <div className="grid-row margin-top-2">
                    <h2>
                      Do you want to delete the enrollment for {rowData.firstName}{' '}
                      {rowData.lastName}?
                    </h2>
                  </div>
                  <div className="grid-row margin-top-2">
                    <span>
                      Deleting an enrollment record will permanently remove all of its
                      data
                    </span>
                  </div>
                  <div className="margin-top-4">
                    <div className="grid-row flex-first-baseline space-between-4">
                      <Button
                        appearance="outline"
                        onClick={toggleDeleteModal}
                        text="No, cancel"
                      />
                      <Button
                        appearance={isDeleting ? 'outline' : 'default'}
                        onClick={deleteRecord}
                        text={
                          isDeleting ? 'Deleting record...' : 'Yes, delete record'
                        }
                      />
                    </div>
                  </div>
                </div>
              </Modal>
            </>
          )}
        </div>
      </div>
      <TabNav
        items={[
          {
            id: TAB_IDS.CHILD,
            text: 'Child Info',
            content: <ChildInfoForm {...commonFormProps} />,
          },
          {
            id: TAB_IDS.FAMILY,
            text: 'Family Info',
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
