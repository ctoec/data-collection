import React, { useState, useContext, useEffect } from 'react';
import { useParams, useLocation, useHistory } from 'react-router-dom';
import { TabNav, Button } from '@ctoec/component-library';
import AuthenticationContext from '../../contexts/AuthenticationContext/AuthenticationContext';
import { apiGet, apiDelete } from '../../utils/api';
import { Child } from '../../shared/models';
import { CareForKidsForm } from './Forms/CareForKids';
import { FamilyInfoForm } from './Forms/FamilyInfo/Form';
import { EnrollmentFundingForm } from './Forms/EnrollmentFunding/Form';
import ChildInfo from './ChildInfo';
import { BackButton } from '../../components/BackButton';
import { FamilyIncomeForm } from './Forms/FamilyIncome/Form';
import Modal from 'react-modal';

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
  // const [checkDataId, setCheckDataId] = useState();

  // Basic trigger functions to operate the delete warning modal
  function openModal() {
    setDeleteModalOpen(true);
  }
  function closeModal() {
    setDeleteModalOpen(false);
  }

  // Counter to trigger re-run of child fetch in
  // useEffect hook
  const [refetch, setRefetch] = useState<number>(0);
  const refetchChild = () => {
    setRefetch((r) => r + 1);
  };

  const activeTab = useLocation().hash.slice(1);
  const history = useHistory();
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

  function deleteRecord() {
    setIsDeleting(true);
    apiDelete(`children/${childId}`, { accessToken })
      .then(() => history.push(``))
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setDeleteModalOpen(false);
        setIsDeleting(false);
      });
  }

  return rowData ? (
    <div className="grid-container">
      <BackButton />
      <div className="grid-row flex-first-baseline flex-space-between">
        <div className="margin-top-4">
          <h1>
            Edit information for {rowData.firstName} {rowData.lastName}
          </h1>
        </div>
        <Button
          appearance="unstyled"
          onClick={openModal}
          text="Delete record"
          className="margin-right-0"
        />
          <Modal
            isOpen={deleteModalOpen}
            contentLabel="Delete Modal"
          >
            <div className='grid-container'>
              <div className='grid-row margin-top-2'>
                <h2>Do you want to delete the enrollment for {rowData.firstName} {rowData.lastName}?</h2>
              </div>
              <div className='grid-row margin-top-2'>
                <span>Deleting an enrollment record will permanently remove all of its data</span>
              </div>
              <div className='margin-top-4'>
                <div className='grid-row flex-first-baseline space-between-4'>
                  <Button 
                    appearance='outline'
                    onClick={closeModal}
                    text='No, cancel'
                  />
                  <Button
                    appearance={isDeleting ? 'outline' : 'default'}
                    onClick={deleteRecord}
                    text={isDeleting ? 'Deleting record...' : 'Yes, delete record'}
                  />
                </div>
              </div>
            </div>
          </Modal>
      </div>
      <TabNav
        items={[
          {
            id: TAB_IDS.CHILD,
            text: 'Child Info',
            content: <ChildInfo child={rowData} refetchChild={refetchChild} />,
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
          history.push({ hash: tabId });
        }}
      />
    </div>
  ) : (
    <> </>
  );
};

export default EditRecord;
