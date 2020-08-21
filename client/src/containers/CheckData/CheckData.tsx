import React, { useContext, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import pluralize from 'pluralize';
import PerfectScrollbar from 'react-perfect-scrollbar';
import 'react-perfect-scrollbar/dist/css/styles.css';
import AuthenticationContext from '../../contexts/AuthenticationContext/AuthenticationContext';
import { apiGet } from '../../utils/api';
import {
  Organization,
  Site,
  Child,
  Family,
  IncomeDetermination,
  Enrollment,
  Funding,
} from 'shared/models';
import { apiGet } from '../../utils/api';
import { TextWithIcon, Button, Table, Column } from '@ctoec/component-library';
import { ReactComponent as Arrow } from '@ctoec/component-library/dist/assets/images/arrowRight.svg';
import { tableColumns } from './TableColumns';

export type TableRow = {
  rowId: number;
  organization: Organization;
  site: Site;
  child: Child;
  family?: Family;
  incomeDetermination?: IncomeDetermination;
  enrollment?: Enrollment;
  funding?: Funding;
};

const CheckData: React.FC = () => {
  const { reportId } = useParams();

  const { accessToken } = useContext(AuthenticationContext);
<<<<<<< HEAD
  const [reportData, setReportData] = useState<FlattenedEnrollment[]>([]);
  const [columnMetadata, setColumnMetadata] = useState<ColumnMetadata[]>(
    []
  );

  useEffect(() => {
    apiGet('column-metadata').then((metadata) => setColumnMetadata(metadata));
  }, []);
=======
  const [reportData, setReportData] = useState<TableRow[]>([]);
>>>>>>> A bunch of changes

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
              <Table<TableRow>
                id="enrollment-report-table"
                rowKey={(row) => row.child.id}
                data={reportData}
                columns={tableColumns(reportId)}
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
