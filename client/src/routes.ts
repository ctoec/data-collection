import React from 'react';
import Home from './containers/Home/Home';
import Login from './containers/Login/Login';
import PageNotFound from './containers/PageNotFound/PageNotFound';


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
		path: '/:unknown',
		component: PageNotFound,
		unauthorized: true,
	},
];

export default routes;
