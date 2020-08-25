import React, { useContext, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import pluralize from 'pluralize';
import PerfectScrollbar from 'react-perfect-scrollbar';
import 'react-perfect-scrollbar/dist/css/styles.css';
import AuthenticationContext from '../../contexts/AuthenticationContext/AuthenticationContext';
import { apiGet } from '../../utils/api';
import { Child } from '../../../shared/models';
import { TextWithIcon, Button, Table } from '@ctoec/component-library';
import { ReactComponent as Arrow } from '@ctoec/component-library/dist/assets/images/arrowRight.svg';
import { tableColumns } from './TableColumns';

const CheckData: React.FC = () => {
  const { reportId } = useParams();

  const { accessToken } = useContext(AuthenticationContext);
  const [reportData, setReportData] = useState<Child[]>([]);

  useEffect(() => {
    if (reportId && accessToken) {
      apiGet(`enrollment-reports/${reportId}`, { accessToken }).then(
        (_reportData) => {
          if (_reportData) {
            setReportData(_reportData);
          }
        }
      );
    }
  }, [reportId, accessToken]);

  return (
    <>
      <div className="CheckData__content margin-top-4 grid-container">
        <div className="margin-x-4">
          <Button
            className="margin-bottom-2 text-bold"
            appearance="unstyled"
            text={
              <TextWithIcon
                text="Back"
                Icon={Arrow}
                direction="left"
                iconSide="left"
              />
            }
            href="/upload"
          />
          <h1>Check data for {pluralize('child', reportData.length, true)}</h1>
          <p>Make sure all of your data was uploaded correctly. </p>
          <p>If everything looks good, submit to OEC.</p>
          {reportData.length ? (
            <PerfectScrollbar>
              <Table<Child>
                id="enrollment-report-table"
                rowKey={(row) => row.id}
                data={reportData}
                columns={tableColumns()}
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
            <Button text="Send to OEC" href="/success" />
          </div>
        </div>
      </div>
    </>
  );
};

export default CheckData;
