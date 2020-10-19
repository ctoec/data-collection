import React, { useState, useContext, useEffect } from 'react';
import { useParams, useLocation, useHistory } from 'react-router-dom';
import { AlertProps, TabNav, TabItem } from '@ctoec/component-library';
import AuthenticationContext from '../../contexts/AuthenticationContext/AuthenticationContext';
import { apiGet } from '../../utils/api';
import { BackButton } from '../../components/BackButton';
import { WithdrawRecord } from './WithdrawRecord/WithdrawRecord';
import { DeleteRecord } from './DeleteRecord';
import { useAlerts } from '../../hooks/useAlerts';
import { getH1RefForTitle } from '../../utils/getH1RefForTitle';
import { useFocusFirstError } from '../../hooks/useFocusFirstError';
import { getTabItems, getTabContent } from './tabItems';
import {
  SECTION_KEYS,
  formSections,
} from '../../components/Forms/formSections';
import DataCacheContext from '../../contexts/DataCacheContext/DataCacheContext';
import { Child } from '../../shared/models';

const EditRecord: React.FC = () => {
  const h1Ref = getH1RefForTitle('Edit record');
  const { childId } = useParams() as { childId: string };
  const { accessToken } = useContext(AuthenticationContext);
  const { alertElements, setAlerts } = useAlerts();
  const {
    children: { addOrUpdateRecord: updateRecordInCache },
  } = useContext(DataCacheContext);
  const [child, setChild] = useState<Child>();

  // Counter to trigger re-run of child fetch in
  // useEffect hook
  const [triggerRefetchCounter, setTriggerRefetchCounter] = useState(0);

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
      setChild(updatedChild);
      updateRecordInCache(updatedChild);

      // On initial fetch, refetch = 0 AND we do not want to create alerts
      if (triggerRefetchCounter > 0) {
        const newAlerts: AlertProps[] = [
          {
            type: 'success',
            heading: 'Record updated',
            text: `Your changes to ${updatedChild?.firstName} ${updatedChild?.lastName}'s record have been saved.`,
          },
        ];
        const formStepInfo = formSections.find((s) => s.key === activeTab);
        const incomplete = formStepInfo?.hasError(updatedChild);
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
  }, [accessToken, childId, triggerRefetchCounter]);

  useFocusFirstError([child]);

  if (!child) {
    return <></>;
  }

  const commonFormProps = {
    child,
    afterSaveSuccess: () => setTriggerRefetchCounter((r) => r + 1),
    setAlerts,
  };
  const activeEnrollment = (child?.enrollments || []).find((e) => !e.exit);
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
        items={getTabItems(commonFormProps)}
        activeId={activeTab}
        onClick={(tabId) => {
          history.replace({ hash: tabId });
        }}
      >
        {getTabContent(activeTab, commonFormProps)}
      </TabNav>
    </div>
  );
};

export default EditRecord;
