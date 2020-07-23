import React from 'react';
import { forwardRef } from 'react';

import MaterialTable from 'material-table'
import AddBox from '@material-ui/icons/AddBox';
import ArrowDownward from '@material-ui/icons/ArrowDownward';
import Check from '@material-ui/icons/Check';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import Edit from '@material-ui/icons/Edit';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Remove from '@material-ui/icons/Remove';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';

const tableIcons = {
    Add: forwardRef<any, any>((props, ref) => <AddBox {...props} ref={ref} />),
    Check: forwardRef<any, any>((props, ref) => <Check {...props} ref={ref} />),
    Clear: forwardRef<any, any>((props, ref) => <Clear {...props} ref={ref} />),
    Delete: forwardRef<any, any>((props, ref) => <DeleteOutline {...props} ref={ref} />),
    DetailPanel: forwardRef<any, any>((props, ref) => <ChevronRight {...props} ref={ref} />),
    Edit: forwardRef<any, any>((props, ref) => <Edit {...props} ref={ref} />),
    Export: forwardRef<any, any>((props, ref) => <SaveAlt {...props} ref={ref} />),
    Filter: forwardRef<any, any>((props, ref) => <FilterList {...props} ref={ref} />),
    FirstPage: forwardRef<any, any>((props, ref) => <FirstPage {...props} ref={ref} />),
    LastPage: forwardRef<any, any>((props, ref) => <LastPage {...props} ref={ref} />),
    NextPage: forwardRef<any, any>((props, ref) => <ChevronRight {...props} ref={ref} />),
    PreviousPage: forwardRef<any, any>((props, ref) => <ChevronLeft {...props} ref={ref} />),
    ResetSearch: forwardRef<any, any>((props, ref) => <Clear {...props} ref={ref} />),
    Search: forwardRef<any, any>((props, ref) => <Search {...props} ref={ref} />),
    SortArrow: forwardRef<any, any>((props, ref) => <ArrowDownward {...props} ref={ref} />),
    ThirdStateCheck: forwardRef<any, any>((props, ref) => <Remove {...props} ref={ref} />),
    ViewColumn: forwardRef<any, any>((props, ref) => <ViewColumn {...props} ref={ref} />)
  };

const oecFontFamily = 'Public Sans Web, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol';

//  TODO: Pull from somewhere instead of this static set of CLEARLY POPULAR basketball players
const tableRows = [
  { name: 'Michael', surname: 'Johnson', birthYear: 1987, birthCity: 63 },
  { name: 'LeBron', surname: 'James', birthYear: 2017, birthCity: 34 },
  { name: 'Giannis', surname: 'Antetokounmpo', birthYear: 1987, birthCity: 63 },
  { name: 'James', surname: 'Harden', birthYear: 2017, birthCity: 34 },
  { name: 'Steph', surname: 'Curry', birthYear: 2017, birthCity: 34 }
];

const CheckData: React.FC = () => {
  return <MaterialTable
      icons={tableIcons}
      title="Example Data Table"
      columns={[
        {
          title: 'Name', field: 'name', validate: rowData => rowData.name !== ''
        },
        { title: 'Surname', field: 'surname', validate: rowData => rowData.surname !== '' },
        { title: 'Birth Year', field: 'birthYear', type: 'numeric' },
        {
          title: 'Birth Place',
          field: 'birthCity',
          lookup: { 34: 'Somewhere', 63: 'Somewhere Else' },
        },
      ]}
      data={tableRows}
      editable={{
        onRowAdd,
        onRowUpdate,
        onRowDelete,
      }}
      actions={[
        {
          tooltip: 'Remove All Selected Users',
          icon: () => <DeleteOutline />,
          onClick: (evt, data) => alert('You want to delete rows?')
        }
      ]}
      options={{
        rowStyle: { 
          fontFamily: oecFontFamily
         },
        headerStyle: {
          fontFamily: oecFontFamily
        },
        selection: true,
        showTitle: false
      }}
    />;
};

export default CheckData;

///////////////////////////////////////////////////

//  TODO: Capture and store new data entered to data table
function onRowAdd(newData: any) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve()
    }, 1000)
  })
}

//  TODO: Capture and store data table updates
function onRowUpdate(newData: any, oldData: any) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve()
    }, 1000)
  });
}

//  TODO: Capture and apply deletions made to data table
function onRowDelete(oldData: any) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve()
    }, 1000)
  });
}


