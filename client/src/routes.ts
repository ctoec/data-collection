import React from 'react';
import Home from './containers/Home/Home';
import Login from './containers/Login/Login';
import PageNotFound from './containers/PageNotFound/PageNotFound';
import Upload from './containers/Upload/Upload';
import GettingStarted from './containers/GettingStarted/GettingStarted';
import CheckData from './containers/CheckData/CheckData';
import ColumnMetadata from './containers/ColumnMetadata/ColumnMetadata';
import SubmitSuccess from './containers/SubmitSuccess/SubmitSuccess';

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
    path: '/data-definitions',
    component: ColumnMetadata,
    unauthorized: true,
  },
  {
    path: '/upload',
    component: Upload,
    unauthorized: false,
  },
  {
    path: '/check-data',
    component: CheckData,
    unauthorized: false,
  },
  {
    path: '/success',
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
