import React, { useContext, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import queryString from 'query-string';
import MaterialTable from 'material-table';
import {
  tableIcons,
  DeleteOutline,
  oecFontFamily,
} from '../../utils/materialTable';
import AuthenticationContext from '../../contexts/AuthenticationContext/AuthenticationContext';
import { FlattenedEnrollment } from 'models';
import { apiGet } from '../../utils/api';

const CheckData: React.FC = () => {
  const { accessToken } = useContext(AuthenticationContext);
  const [reportData, setReportData] = useState<FlattenedEnrollment[]>([]);
  const reportId = parseInt(
    (queryString.parse(useLocation().search).reportId as string) || ''
  );

  useEffect(() => {
    apiGet(`enrollment-reports/${reportId}`, { accessToken }).then((report) => {
      if (report && report.enrollments) {
        setReportData(report.enrollments);
      }
    });
  }, [reportId, accessToken]);

  return (
    <MaterialTable
      icons={tableIcons}
      title="Example Data Table"
      data={reportData}
      columns={[
        {
          title: 'Name',
          field: 'name',
          validate: (rowData) => rowData.name !== '',
        },
      ]}
      editable={{
        onRowAdd,
        onRowUpdate,
        onRowDelete,
      }}
      actions={[
        {
          tooltip: 'Remove All Selected Users',
          icon: () => <DeleteOutline />,
          onClick: (evt, data) => alert('You want to delete rows?'),
        },
      ]}
      options={{
        rowStyle: {
          fontFamily: oecFontFamily,
        },
        headerStyle: {
          fontFamily: oecFontFamily,
        },
        selection: true,
        showTitle: false,
      }}
    />
  );
};

export default CheckData;

///////////////////////////////////////////////////

//  TODO: Capture and store new data entered to data table
function onRowAdd(newData: any) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, 1000);
  });
}

//  TODO: Capture and store data table updates
function onRowUpdate(newData: any, oldData: any) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, 1000);
  });
}

//  TODO: Capture and apply deletions made to data table
function onRowDelete(oldData: any) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, 1000);
  });
}
