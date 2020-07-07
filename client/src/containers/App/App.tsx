import React, { useContext } from 'react';
import { Switch } from 'react-router-dom';
import { Header } from '@ctoec/component-library';

import routes from '../../routes';
import MakeRouteWithSubRoutes from './MakeRouteWithSubroute';
import UserContext from '../../contexts/UserContext/UserContext';

import './App.css';

const App: React.FC = () => {
	const { user } = useContext(UserContext);
	return (
		<div className="App">
			<Header
				secondaryTitle="Early childhood enrollment data"
				primaryTitle="Office of Early Childhood"
				loginPath="/login"
				logoutPath="/logout"
				navItems={[
					{ type: 'secondary', title: 'Privacy policy', path: '/privacy-policy' },
				]}
				userFirstName={user?.firstName}
			/>
			<Switch>
				{routes.map((route, index) => <MakeRouteWithSubRoutes key={index} {...route} />)}
			</Switch>
		</div>
	);
}

export default App;
