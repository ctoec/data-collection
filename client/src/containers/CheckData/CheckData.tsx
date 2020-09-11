import React, { useContext, useState, useEffect } from 'react';
import { useParams, Link, useHistory } from 'react-router-dom';
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

const CheckData: React.FC = () => {
  const { reportId } = useParams();
  const { alertElements } = useAlerts();
  const history = useHistory();
  const { accessToken } = useContext(AuthenticationContext);
  const [reportData, setReportData] = useState<Child[]>([]);

  useEffect(() => {
    if (reportId) {
      apiGet(`enrollment-reports/${reportId}`, { accessToken }).then(
        (_reportData) => {
          if (_reportData) {
            setReportData(_reportData);
          }
        }
      );
    }
  }, [reportId, accessToken]);

  /**
   * TODO: Right now, the CheckData page just redirects straight
   * to success (with no processing done) when you click the Send
   * to OEC button. Once we have the infrastructure for what it
   * means to actually send to OEC, we can alter this, but for
   * now, we need a way to send relevant IDs to the success page
   * so that if the user downloads them, we know which children
   * were persisted to the DB (e.g. we need the child IDs because
   * it's possible that a user could delete a record while looking
   * at the CheckData page, and then we wouldn't want to send
   * that child's ID to the success page for exporting to CSV).
   *
   * It's a hacky workaround right now, but it at least lets us
   * get the component working so we have the functionality.
   */
  function sendData() {
    const idArray = reportData.map((child) => {
      return child.id;
    });
    history.push(`/success/${idArray.join()}`);
  }

  const organization =
    reportData && reportData.length ? reportData[0].organization : null;
  // TODO: WHAT'S THE BEST WAY TO GET THE ORG FOR ADD CHILD?

  return (
    <>
      <div className="CheckData__content margin-top-4 grid-container">
        <div className="margin-x-4">
          <BackButton />
          {alertElements}
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
      <div className="CheckData__button-container position-fixed bottom-0 width-full">
        <div className="margin-bottom-0">
          <div className="fixed-buttons">
            <Button text="Back to upload" href="/upload" appearance="outline" />
            <Button text="Send to OEC" onClick={sendData} />
          </div>
        </div>
      </div>
    </>
  );
};

export default CheckData;
