import React, { useContext } from 'react';
import { Switch } from 'react-router-dom';
import { Header } from '@ctoec/component-library';

import routes from '../../routes';
import MakeRouteWithSubRoutes from './MakeRouteWithSubroute';
import UserContext from '../../contexts/UserContext/UserContext';
import { mailToLinkProps } from '../../components/MailToLink';
import { TemplateDownloadLink } from '../../components/TemplateDownloadLink';

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
            id: 'templates-nav',
            text: 'Data template',
            type: 'secondary',
            children: [
              {
                text: 'Excel',
                renderer: () => <TemplateDownloadLink type="xlsx" nav />,
              },
              {
                text: '.csv',
                renderer: () => <TemplateDownloadLink type="csv" nav />,
              },
            ],
          },
          {
            type: 'secondary',
            text: 'Data requirements',
            path: '/data-requirements',
          },
          {
            text: 'Feedback',
            type: 'secondary',
            path: mailToLinkProps.href,
            target: mailToLinkProps.target,
            external: true,
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
