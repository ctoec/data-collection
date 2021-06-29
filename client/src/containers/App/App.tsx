import React, { useContext } from 'react';
import { Switch } from 'react-router-dom';
import { ErrorBoundary, Header, HeaderItemProps } from '@ctoec/component-library';

import routes from '../../routes';
import MakeRouteWithSubRoutes from './MakeRouteWithSubroute';
import UserContext from '../../contexts/UserContext/UserContext';
import { defaultErrorBoundaryProps } from '../../utils/defaultErrorBoundaryProps';

const App: React.FC = () => {
  const { user } = useContext(UserContext);

  // Non-admins see these items in their version of the nav bar
  const navItems: HeaderItemProps[] = [
    {
      label: 'Roster',
      href: '/roster',
    },
    {
      label: 'Resources',
      dropdownItems: [
        {
          label: 'Data template',
          path: '/template'
        },
        {
          label: 'Data requirements',
          path: '/data-requirements'
        },
        {
          label: 'Privacy policy',
          path: '/privacy'
        }
      ],
    },
    {
      label: 'Help',
      dropdownItems: [
        {
          label: 'How-to guides',
          path: "https://help.ece-reporter.ctoec.org/",
          target: "_blank"
        },
        {
          label: 'Support requests',
          path: '/support'
        }
      ],
    },
  ];

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
          navItems={[
            ...(!user || user?.isAdmin ? navItems.filter(item => item.label !== 'Roster') : navItems),
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
