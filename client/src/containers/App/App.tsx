import React from 'react';
import { BrowserRouter, Switch, Link } from 'react-router-dom';
import { AuthenticationProvider } from '../../contexts/AuthenticationContext/AuthenticationContext';
import './App.css';
import routes from '../../routes';
import MakeRouteWithSubRoutes from './MakeRouteWithSubroute';

const App: React.FC = () => (
	<BrowserRouter>
		<AuthenticationProvider
			clientId="data-collection"
			localStorageAccessTokenKey="data-collection-key"
			localStorageIdTokenKey="data-collection-id"
			defaultOpenIdConnectUrl={process.env.REACT_APP_DEFAULT_WINGED_KEYS_URL}
			// NOTE: "offline_access" is required in scope string to retrieve refresh tokens
			scope="openid profile data_collection_backend offline_access"
			extras={{
				// NOTE: Required for refresh tokens
				access_type: 'offline',
			}}
		>
			<div className="App">
				<header>
					<h1>OEC Data Collection</h1>
					<nav><Link to="/login">Sign in</Link></nav>
				</header>
				<Switch>
					{routes.map((route, index) => <MakeRouteWithSubRoutes key={index} {...route} />)}
				</Switch>
			</div>
		</AuthenticationProvider>
	</BrowserRouter>
);

export default App;
