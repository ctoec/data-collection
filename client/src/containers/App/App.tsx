import React, { useContext } from 'react';
import { Switch } from 'react-router-dom';
import { ErrorBoundary, Header } from '@ctoec/component-library';

import routes from '../../routes';
import MakeRouteWithSubRoutes from './MakeRouteWithSubroute';
import UserContext from '../../contexts/UserContext/UserContext';
import { mailToLinkProps } from '../../components/MailToLink';
import { defaultErrorBoundaryProps } from '../../utils/defaultErrorBoundaryProps';

const App: React.FC = () => {
  const { user, confidentialityAgreedDate } = useContext(UserContext);

  return (
    <div className="App">
      {/* In case it really hits the fan and not even the header works */}
      <ErrorBoundary alertProps={{ ...defaultErrorBoundaryProps }}>
        <a className="usa-skipnav" href="#main-content">
          Skip to main content
        </a>
        <Header
          primaryTitle="ECE Reporter"
          loginPath="/login"
          logoutPath="/logout"
          showPrimaryNavItems={!!user?.firstName && !!confidentialityAgreedDate}
          navItems={[
            {
              type: 'primary',
              text: 'Home',
              path: '/home',
            },
            {
              type: 'primary',
              text: 'File upload',
              path: '/upload',
            },
            {
              type: 'primary',
              text: 'Roster',
              path: '/roster',
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
      </ErrorBoundary>
      <main id="main-content">
        <ErrorBoundary alertProps={defaultErrorBoundaryProps}>
          <Switch>
            {routes.map((route, index) => (
              <MakeRouteWithSubRoutes key={index} {...route} />
            ))}
          </Switch>
        </ErrorBoundary>
      </main>
    </div>
  );
};

export default App;
