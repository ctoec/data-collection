import React, { useContext } from 'react';
import { Switch } from 'react-router-dom';
import { ErrorBoundary, Header, HeaderItemProps } from '@ctoec/component-library';

import routes from '../../routes';
import MakeRouteWithSubRoutes from './MakeRouteWithSubroute';
import UserContext from '../../contexts/UserContext/UserContext';
import { defaultErrorBoundaryProps } from '../../utils/defaultErrorBoundaryProps';

const App: React.FC = () => {
  const { user } = useContext(UserContext);

   // TODO: When we tackle the admin nav bar, this will change because
  // We'll probably use a pattern of a single top right nav bar,
  // so the admin things may eventually migrate there.
  // TLDR: The comment below (which is from the original page) is not true.
  // Only non-admins see this.

  // All users see these "secondary" styled nav items
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
            ...(user?.isAdmin ? [] : navItems),
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
