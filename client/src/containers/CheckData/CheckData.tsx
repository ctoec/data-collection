import React, { useContext, useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import queryString from 'query-string';
import pluralize from 'pluralize';
import moment from 'moment';
import PerfectScrollbar from 'react-perfect-scrollbar';
import 'react-perfect-scrollbar/dist/css/styles.css';
import AuthenticationContext from '../../contexts/AuthenticationContext/AuthenticationContext';
import { FlattenedEnrollment, DataDefinitionInfo } from 'shared/models';
import { apiGet } from '../../utils/api';
import {
  TextWithIcon,
  Button,
  Table,
  Column,
  TextInput,
  ExpandRow,
  TabNav,
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

  const tableColumns: Column<FlattenedEnrollment>[] = columnMetadata.map(
    (columnMeta) => ({
      className: 'text-pre text-center font-body-2xs',
      name: columnMeta.formattedName,
      title: columnMeta.propertyName,
      sort: row => (row as any)[columnMeta.propertyName],
      cell: ({ row }) => {
        // special case for clickable name column that sends user to edit page
        if (columnMeta.propertyName === 'name') {
          return (
            <td>

              // Pass reportId to save/send data back once editing is done
              <Link to={
                {
                  pathname: "/edit-record/" + row.name,
                  state: {
                    'reportId': reportId,
                    'childName': row.name,
                  },
                }
              }>
                <Button
                  className="text-no-wrap font-body-2xs"
                  appearance="unstyled"
                  text={row.name || ''}
                />
              </Link>
            </td>
          );
        }

        // all other columns
        let cellContent: any = (row as any)[columnMeta.propertyName];
        if (typeof cellContent === 'boolean') {
          cellContent = cellContent ? 'yes' : 'no';
        } else if (moment.isMoment(cellContent)) {
          cellContent = cellContent.format('MM/DD/YYYY');
        }

        return <td className="font-body-2xs">{cellContent}</td>;
      },
    })
  );

  return (
    <>
      <div className="CheckData__content margin-top-4">
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
              <Table<FlattenedEnrollment>
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
            <Button text="Send to OEC" href="/success" />
          </div>
        </div>
      </div>
    </>
  );
};

export default CheckData;
