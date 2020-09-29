import React, { useState, useContext, useEffect } from 'react';
import { useParams, useLocation, useHistory } from 'react-router-dom';
import {
  TabNav,
} from '@ctoec/component-library';
import AuthenticationContext from '../../contexts/AuthenticationContext/AuthenticationContext';
import { apiGet } from '../../utils/api';
import { Child } from '../../shared/models';
import { BackButton } from '../../components/BackButton';
import { WithdrawRecord } from './WithdrawRecord';
import { DeleteRecord } from './DeleteRecord';
import { useReportingPeriods } from '../../hooks/useReportingPeriods';
import { useAlerts } from '../../hooks/useAlerts';
import { getH1RefForTitle } from '../../utils/getH1RefForTitle';
import { useFocusFirstError } from '../../hooks/useFocusFirstError';
import { tabItems } from './tabItems';
import { TAB_IDS } from '../../components/Forms/commonFormStepInfo';

const EditRecord: React.FC = () => {
  const h1Ref = getH1RefForTitle('Edit record');
  const { childId } = useParams() as { childId: string };
  const { accessToken } = useContext(AuthenticationContext);
  const [rowData, setRowData] = useState<Child>();
  const { alertElements, setAlerts } = useAlerts();

  // Counter to trigger re-run of child fetch in
  // useEffect hook
  const [refetch, setRefetch] = useState(0);

  // Persist active tab in URL hash
  const activeTab = useLocation().hash.slice(1);
  // Clear any previously displayed alerts from other tabs
  useEffect(() => {
    setAlerts([]);
  }, [activeTab]);
  const history = useHistory();
  // and make child tab active by default if no hash
  // (but only on first render)
  useEffect(() => {
    if (!activeTab) {
      history.replace({ hash: TAB_IDS.IDENT });
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

  // TODO: revisit whether we need this depending on whether errors in edit block save or are warnings
  useFocusFirstError([rowData]);

  if (!rowData) {
    return <></>;
  }

  const activeEnrollment = (rowData?.enrollments || []).find((e) => !e.exit);

  const afterDataSave = () => {
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
    afterDataSave,
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
              <WithdrawRecord
                childName={rowData.firstName}
                enrollment={activeEnrollment}
                reportingPeriods={reportingPeriods}
              />
            </>
          )}
          <DeleteRecord child={rowData} />
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
