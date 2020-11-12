import React, { useContext } from 'react';
import { Switch } from 'react-router-dom';
import { Header } from '@ctoec/component-library';

import routes from '../../routes';
import MakeRouteWithSubRoutes from './MakeRouteWithSubroute';
import UserContext from '../../contexts/UserContext/UserContext';
import { mailToLinkProps } from '../../components/MailToLink';

const App: React.FC = () => {
  const { user } = useContext(UserContext);

  return (
    <div className="App">
      <a className="usa-skipnav" href="#main-content">
        Skip to main content
      </a>
      <Header
        primaryTitle="ECE Reporter"
        loginPath="/login"
        logoutPath="/logout"
        showPrimaryNavItems={!!user?.firstName}
        navItems={[
          {
            type: 'primary',
            text: 'Home',
            path: '/getting-started',
          },
          {
            type: 'primary',
            text: 'Roster',
            path: '/roster',
          },
          {
            type: 'primary',
            text: 'Batch upload',
            path: '/upload',
          },
          {
            text: 'Privacy policy',
            type: 'secondary',
            path: '/privacy',
          },
          {
            text: 'Data template',
            type: 'secondary',
            path: '/template',
          },
          {
            type: 'secondary',
            text: 'Data requirements',
            path: '/data-requirements',
          },
          {
            text: 'Help',
            type: 'secondary',
            path: '/help',
          },
        ]}
        userFirstName={user?.firstName}
      />
      <main id="main-content">
        <Switch>
          {routes.map((route, index) => (
            <MakeRouteWithSubRoutes key={index} {...route} />
          ))}
        </Switch>
      </main>
    </div>
  );
};

export default App;
