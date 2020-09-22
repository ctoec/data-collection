import React, { useContext, useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import pluralize from 'pluralize';
import PerfectScrollbar from 'react-perfect-scrollbar';
import 'react-perfect-scrollbar/dist/css/styles.css';
import AuthenticationContext from '../../contexts/AuthenticationContext/AuthenticationContext';
import { apiGet } from '../../utils/api';
import { Child } from '../../shared/models';
import { Button, Table } from '@ctoec/component-library';
import { tableColumns } from './TableColumns';
import { BackButton } from '../../components/BackButton';
import { useAlerts } from '../../hooks/useAlerts';
import { getH1RefForTitle } from '../../utils/getH1RefForTitle';
import { FixedBottomBar } from '../../components/FixedBottomBar/FixedBottomBar';

/**
 * TODO: Right now, the CheckData page just redirects straight
 * to success (with no processing done) when you click the Send
 * to OEC button. Once we have the infrastructure for what it
 * means to actually send to OEC, we can alter this.
 */
const CheckData: React.FC = () => {
  const h1Ref = getH1RefForTitle();
  const { reportId } = useParams();
  const { alertElements } = useAlerts();
  const { accessToken } = useContext(AuthenticationContext);
  const [reportData, setReportData] = useState<Child[]>([]);

  useEffect(() => {
    if (reportId) {
      apiGet(`enrollment-reports/${reportId}`, { accessToken }).then(
        (_reportData) => {
          if (_reportData && _reportData.children) {
            setReportData(_reportData.children);
          }
        }
      );
    }
  }, [reportId, accessToken]);

  const organization =
    reportData && reportData.length ? reportData[0].organization : null;
  // TODO: WHAT'S THE BEST WAY TO GET THE ORG FOR ADD CHILD?

  return (
    <>
      <div className="CheckData__content margin-top-4 grid-container">
        <div className="margin-x-4">
          <BackButton />
          <h1>Check data for {pluralize('child', reportData.length, true)}</h1>
          <p>Make sure all of your data was uploaded correctly. </p>
          <p>If everything looks good, submit to OEC.</p>
          <Link to={{ pathname: '/create-record', state: { organization } }}>
            Add a record
          </Link>
          {reportData.length ? (
            <PerfectScrollbar>
              <Table<Child>
                id="enrollment-report-table"
                rowKey={(row) => row.id}
                data={reportData}
                columns={tableColumns}
              />
            </PerfectScrollbar>
          ) : (
            'Loading...'
          )}
        </div>
      </div>
      <FixedBottomBar>
        <Button text="Back to upload" href="/upload" appearance="outline" />
        <Button text="Send to OEC" href={`/success/${reportId}`} />
      </FixedBottomBar>
    </>
  );
};

export default CheckData;
