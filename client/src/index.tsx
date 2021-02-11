// https://stackoverflow.com/questions/56421417/react-app-not-working-in-internet-explorer-11
import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';
import 'formdata-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { SWRConfig } from 'swr';

import App from './containers/App/App';
import { AuthenticationProvider } from './contexts/AuthenticationContext/AuthenticationContext';
import { UserProvider } from './contexts/UserContext/UserContext';
import * as serviceWorker from './serviceWorker';

import '@ctoec/component-library/dist/assets/styles/index.scss';
import './index.scss';
import { apiGet } from './utils/api';
import { RosterProvider } from './contexts/RosterContext/RosterContext';

const render = (Component: React.FC) =>
  ReactDOM.render(
    <React.StrictMode>
      <BrowserRouter>
        <AuthenticationProvider
          clientId="data-collection"
          localStorageAccessTokenKey="data-collection-key"
          localStorageRefreshTokenKey="data-collection-refresh"
          localStorageIdTokenKey="data-collection-id"
          defaultOpenIdConnectUrl={
            process.env.REACT_APP_DEFAULT_WINGED_KEYS_URL
          }
          // NOTE: "offline_access" is required in scope string to retrieve refresh tokens
          scope="openid profile data_collection_backend offline_access"
          extras={{
            // NOTE: Required for refresh tokens
            access_type: 'offline',
            max_age: 60,
          }}
        >
          <UserProvider>
            <SWRConfig
              value={{
                fetcher: apiGet,
              }}
            >
              <RosterProvider>
                <Component />
              </RosterProvider>
            </SWRConfig>
          </UserProvider>
        </AuthenticationProvider>
      </BrowserRouter>
    </React.StrictMode>,
    document.getElementById('root')
  );

render(App);

// @ts-ignore
if (module.hot) {
  // @ts-ignore
  module.hot.accept('./containers/App/App', () => {
    const NextApp = require('./containers/App/App').default;
    render(NextApp);
  });
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
