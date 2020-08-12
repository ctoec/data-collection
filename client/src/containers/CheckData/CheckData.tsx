import React, { useContext, useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import queryString from 'query-string';
import pluralize from 'pluralize';

import AuthenticationContext from '../../contexts/AuthenticationContext/AuthenticationContext';
import { FlattenedEnrollment, DataDefinitionInfo } from 'shared/models';
import { apiGet } from '../../utils/api';
import {
  TextWithIcon,
  EditableTable,
  EditableTableColumn,
  Button,
} from '@ctoec/component-library';
import { ReactComponent as Arrow } from '@ctoec/component-library/dist/assets/images/arrowRight.svg';

const CheckData: React.FC = () => {
  const reportId = parseInt(
    (queryString.parse(useLocation().search).reportId as string) || ''
  );

  const { accessToken } = useContext(AuthenticationContext);
  const [reportData, setReportData] = useState<FlattenedEnrollment[]>([]);
  const [columnMetadata, setColumnMetadata] = useState<DataDefinitionInfo[]>(
    []
  );

  useEffect(() => {
    apiGet('data-definitions').then((metadata) => setColumnMetadata(metadata));
  }, []);

  useEffect(() => {
    if (reportId && accessToken) {
      apiGet(`enrollment-reports/${reportId}`, { accessToken }).then(
        (report) => {
          if (report && report.enrollments) {
            setReportData(report.enrollments);
          }
        }
      );
    }
  }, [reportId, accessToken]);

  const tableColumns: EditableTableColumn<
    FlattenedEnrollment
  >[] = columnMetadata.map((columnMeta) => ({
    title: columnMeta.formattedName,
    field: columnMeta.propertyName,
    validate: (rowData: any) => rowData[columnMeta.propertyName] !== '',
    render: (rowData: any) => {
      const cellData = rowData[columnMeta.propertyName];
      return cellData instanceof Date
        ? cellData.toLocaleDateString()
        : cellData;
    },
  }));

  return (
    <>
      <div className="CheckData__content grid-container margin-top-4">
        <div className="margin-bottom-2 text-bold">
          <Link to="/">
            <TextWithIcon
              text="Back"
              Icon={Arrow}
              direction="left"
              iconSide="left"
            />
          </Link>
        </div>
        <h1>Check data for {pluralize('child', reportData.length, true)}</h1>
        <span>Make sure all of your data was uploaded correctly. </span>
        <span>If everything looks good, submit to OEC.</span>
        {reportData.length && (
          <EditableTable<FlattenedEnrollment>
            title="Enrollment report table"
            data={reportData}
            columns={tableColumns}
          />
        )}
      </div>
      <div className="CheckData__button-container position-fixed bottom-0 width-full">
        <div className="grid-container margin-bottom-0">
          <div className="fixed-buttons">
            <Button text="Back to upload" href="/upload" />
            <Button text="Send to OEC" />
          </div>
        </div>
      </div>
    </>
  );
};

export default CheckData;
