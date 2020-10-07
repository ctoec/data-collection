import React, { useState, useContext, useEffect } from 'react';
import { useParams, useLocation, useHistory } from 'react-router-dom';
import { AlertProps, TabNav } from '@ctoec/component-library';
import AuthenticationContext from '../../contexts/AuthenticationContext/AuthenticationContext';
import { apiGet } from '../../utils/api';
import { BackButton } from '../../components/BackButton';
import { WithdrawRecord } from './WithdrawRecord/WithdrawRecord';
import { DeleteRecord } from './DeleteRecord';
import { useAlerts } from '../../hooks/useAlerts';
import { getH1RefForTitle } from '../../utils/getH1RefForTitle';
import { useFocusFirstError } from '../../hooks/useFocusFirstError';
import { tabItems } from './tabItems';
import {
  SECTION_KEYS,
  formSections,
} from '../../components/Forms/formSections';
import DataCacheContext from '../../contexts/DataCacheContext/DataCacheContext';

const EditRecord: React.FC = () => {
  const h1Ref = getH1RefForTitle('Edit record');
  const { childId } = useParams() as { childId: string };
  const { accessToken } = useContext(AuthenticationContext);
  const { alertElements, setAlerts } = useAlerts();
  const { children } = useContext(DataCacheContext);
  const child = children.getRecordById(childId);

  // Counter to trigger re-run of child fetch in
  // useEffect hook
  const [refetch, setRefetch] = useState(0);

  // Persist active tab in URL hash
  const activeTab = useLocation().hash.slice(1);
  // Clear any previously displayed alerts from other tabs
  useEffect(() => {
    setAlerts([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);
  const history = useHistory();
  // and make child tab active by default if no hash
  // (but only on first render)
  useEffect(() => {
    if (!activeTab) {
      history.replace({ hash: SECTION_KEYS.IDENT });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Get child data
  useEffect(() => {
    apiGet(`children/${childId}`, {
      accessToken,
    }).then((updatedChild) => {
      children.addOrUpdateRecord(updatedChild);

      // On initial fetch, refetch = 0 AND we do not want to create alerts
      if (refetch) {
        const newAlerts: AlertProps[] = [
          {
            type: 'success',
            heading: 'Record updated',
            text: `Your changes to ${child?.firstName} ${child?.lastName}'s record have been saved.`,
          },
        ];
        const formStepInfo = formSections.find((s) => s.key === activeTab);
        const incomplete = formStepInfo?.status(updatedChild);
        const formName = formStepInfo?.name.toLowerCase();
        if (incomplete) {
          newAlerts.push({
            type: 'error',
            heading: 'This record has missing or incorrect info',
            text: `You'll need to add the needed info in ${formName} before submitting your data to OEC.`,
          });
        }
        setAlerts(newAlerts);
      }
    });
  }, [accessToken, childId, refetch]);

  useFocusFirstError([child]);

  if (!child) {
    return <></>;
  }

  const activeEnrollment = (child?.enrollments || []).find((e) => !e.exit);

  const afterDataSave = () => {
    setRefetch((r) => r + 1);
  };

  const commonFormProps = {
    child: child,
    afterSaveSuccess: afterDataSave,
    setAlerts,
  };

  return (
    <div className="grid-container">
      {alertElements}
      <BackButton />
      <div className="display-flex flex-justify">
        <div>
          <h1 ref={h1Ref} className="margin-top-0">
            <span className="h2 h2--lighter">Edit record </span>
            {child.firstName} {child.lastName}
          </h1>
        </div>
        <div className="display-flex flex-col flex-align-center">
          {!!activeEnrollment && (
            <>
              <WithdrawRecord
                childName={child.firstName}
                enrollment={activeEnrollment}
              />
            </>
          )}
          <DeleteRecord child={child} />
        </div>
      </div>
      <TabNav
        items={tabItems(commonFormProps)}
        activeId={activeTab}
        onClick={(tabId) => {
          history.replace({ hash: tabId });
        }}
      />
    </div>
  );
};

export default EditRecord;
