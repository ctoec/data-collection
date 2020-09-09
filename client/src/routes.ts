import React from 'react';
import Home from './containers/Home/Home';
import Login from './containers/Login/Login';
import PageNotFound from './containers/PageNotFound/PageNotFound';
import Upload from './containers/Upload/Upload';
import GettingStarted from './containers/GettingStarted/GettingStarted';
import CheckData from './containers/CheckData/CheckData';
import EditRecord from './containers/EditRecord/EditRecord';
import DataRequirements from './containers/DataRequirements/DataRequirements';
import SubmitSuccess from './containers/SubmitSuccess/SubmitSuccess';
import AddChild from './containers/AddChild/AddChild';

export type RouteConfig = {
  path: string;
  component: React.FC<any>;
  exact?: boolean;
  routes?: RouteConfig[];
  unauthorized?: boolean;
  props?: any;
};

export const routes: RouteConfig[] = [
  {
    path: '/',
    exact: true,
    component: Home,
    unauthorized: true,
  },
  {
    path: '/login',
    component: Login,
    unauthorized: true,
  },
  {
    path: '/logout',
    component: Login,
    unauthorized: true,
  },
  {
    path: '/getting-started',
    component: GettingStarted,
    unauthorized: false,
  },
  {
    path: '/data-requirements',
    component: DataRequirements,
    unauthorized: true,
  },
  {
    path: '/upload',
    component: Upload,
    unauthorized: false,
  },
  {
    path: '/check-data/:reportId',
    component: CheckData,
    unauthorized: false,
    exact: true,
  },
  {
    path: '/create-record/:childId',
    component: AddChild,
    unauthorized: false,
  },
  {
    path: '/create-record',
    component: AddChild,
    unauthorized: false,
  },
  {
    path: '/edit-record/:childId',
    component: EditRecord,
    unauthorized: false,
  },
  {
    path: '/success/:idArray',
    component: SubmitSuccess,
    unauthorized: false,
  },
  {
    path: '/:unknown',
    component: PageNotFound,
    unauthorized: true,
  },
];

export default routes;
