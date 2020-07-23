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

import { createMuiTheme, MuiThemeProvider } from '@material-ui/core';

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

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#4caf50',
    },
    secondary: {
      main: '#ff9100',
    },
  },

});

const CheckData: React.FC = () => {
  return <MaterialTable
    icons={tableIcons}
    title="Example Data Table"
    columns={[
      {
        title: 'Name', field: 'name',
      },
      { title: 'Surname', field: 'surname' },
      { title: 'Birth Year', field: 'birthYear', type: 'numeric' },
      {
        title: 'Birth Place',
        field: 'birthCity',
        lookup: { 34: 'Somewhere', 63: 'Somewhere Else' },
      },
    ]}
    data={[
      { name: 'Michael', surname: 'Jordan', birthYear: 1987, birthCity: 63 },
      { name: 'LeBron', surname: 'James', birthYear: 2017, birthCity: 34 },
      { name: 'Giannis', surname: 'Antetokounmpo', birthYear: 1987, birthCity: 63 },
      { name: 'James', surname: 'Harden', birthYear: 2017, birthCity: 34 },
      { name: 'Steph', surname: 'Curry', birthYear: 2017, birthCity: 34 }
    ]}
    options={{
      selection: true
    }}
  />;
};

export default CheckData;
