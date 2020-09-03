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
      <Header
        secondaryTitle="Early childhood enrollment data"
        primaryTitle="Office of Early Childhood"
        loginPath="/login"
        logoutPath="/logout"
        navItems={[
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
            // TODO: FIX-- needs to not be a nav link :/
            text: 'Feedback',
            type: 'secondary',
            path: mailToLinkProps.href,
            target: mailToLinkProps.target,
            rel: mailToLinkProps.rel,
          },
        ]}
        userFirstName={user?.firstName}
      />
      <Switch>
        {routes.map((route, index) => (
          <MakeRouteWithSubRoutes key={index} {...route} />
        ))}
      </Switch>
    </div>
  );
};

export default App;
