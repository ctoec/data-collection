import React from 'react';
import Landing from './containers/Landing/Landing';
import TemplateDownload from './containers/TemplateDownload/TemplateDownload';
import Login from './containers/Login/Login';
import PageNotFound from './containers/PageNotFound/PageNotFound';
import Upload from './containers/Upload/Upload';
import Home from './containers/Home/Home';
import EditRecord from './containers/EditRecord/EditRecord';
import DataRequirements from './containers/DataRequirements/DataRequirements';
import SubmitSuccess from './containers/SubmitSuccess/SubmitSuccess';
import AddRecord from './containers/CreateRecord/CreateRecord';
import FundingSourceTimes from './containers/FundingSourceTimes/FundingSourceTimes';
import Roster from './containers/Roster/Roster';
import BatchEdit from './containers/BatchEdit/BatchEdit';
import DevUtility from './containers/DevUtility/DevUtility';
import PrivacyPolicy from './containers/PrivacyPolicy/PrivacyPolicy';

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
    component: Landing,
    unauthorized: true,
  },
  {
    path: '/template',
    exact: true,
    component: TemplateDownload,
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
    path: '/home',
    component: Home,
    unauthorized: false,
  },
  {
    path: '/data-requirements',
    component: DataRequirements,
    unauthorized: true,
  },
  {
    path: '/privacy',
    component: PrivacyPolicy,
    unauthorized: true,
  },
  {
    path: '/funding-space-types',
    component: FundingSourceTimes,
    unauthorized: true,
  },
  {
    path: '/roster',
    component: Roster,
    unauthorized: false,
  },
  {
    path: '/upload',
    component: Upload,
    unauthorized: false,
  },
  {
    path: '/create-record/:childId?',
    component: AddRecord,
    unauthorized: false,
  },
  {
    path: '/edit-record/:childId',
    component: EditRecord,
    unauthorized: false,
  },
  {
    path: '/success',
    component: SubmitSuccess,
    unauthorized: false,
  },
  {
    path: '/batch-edit/:childId?',
    component: BatchEdit,
    unauthorized: false,
  },
  {
    path: '/dev',
    component:
      process.env.REACT_APP_STAGE !== 'production' ? DevUtility : PageNotFound,
    // TODO: make sure prod is actually called production or change this
    unauthorized: true,
  },
  {
    path: '/:unknown',
    component: PageNotFound,
    unauthorized: true,
  },
];

export default routes;
