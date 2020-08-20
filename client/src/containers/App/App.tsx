import React, { useContext } from 'react';
import { Switch } from 'react-router-dom';
import { SimpleHeader } from '@ctoec/component-library';

import routes from '../../routes';
import MakeRouteWithSubRoutes from './MakeRouteWithSubroute';
import UserContext from '../../contexts/UserContext/UserContext';
import { MailToLink } from '../../components/MailToLink';

const App: React.FC = () => {
  const { user } = useContext(UserContext);
  return (
    <div className="App">
      <SimpleHeader
        secondaryTitle="Early childhood enrollment data"
        primaryTitle="Office of Early Childhood"
        loginPath="/login"
        logoutPath="/logout"
        navItems={[
          {
            id: 'templates-nav',
            title: 'Data template',
            children: [
              {
                id: 'excel-template-nav',
                title: 'Excel',
                path: '/upload_template/ECE Data Collection Template.xlsx',
              },
              {
                id: 'csv-template-nav',
                title: '.csv',
                path: '/upload_template/ECE Data Collection Template.csv',
              },
            ],
            renderer: (props) => (
              <a {...props} onClick={undefined} href={props.value}>
                {props.text}
              </a>
            ),
          },
          {
            id: 'data-definitions-nav',
            title: 'Data definitions',
            path: '/column-metadata',
          },
          {
            id: 'feedback-nav',
            title: 'Feedback',
            renderer: () => <MailToLink text="Feedback" />,
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
