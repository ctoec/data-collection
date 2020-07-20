import React from 'react';
import Home from './containers/Home/Home';
import Login from './containers/Login/Login';
import PageNotFound from './containers/PageNotFound/PageNotFound';
import Upload from './containers/Upload/Upload';
import GettingStarted from './containers/GettingStarted/GettingStarted';
import CheckData from './containers/CheckData/CheckData';

export type RouteConfig = {
  path: string;
  component: React.FC<any>;
  exact?: boolean;
  routes?: RouteConfig[];
  unauthorized?: boolean;
  props?: any;
};

export const routes: RouteConfig[] = [
<<<<<<< HEAD
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
    path: '/:unknown',
    component: PageNotFound,
    unauthorized: true,
  },
=======
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
		path: '/upload',
		component: Upload,
		unauthorized: false,
	},
	{
		path: '/check-data/:fileUploadId',
		component: CheckData,
		unauthorized: false,
	},
	{
		path: '/:unknown',
		component: PageNotFound,
		unauthorized: true,
	},
>>>>>>> 21: Adds data header validation to CheckData
];

export default routes;
