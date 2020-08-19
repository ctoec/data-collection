import React, { useContext } from 'react';
import { Switch } from 'react-router-dom';
import { SimpleHeader } from '@ctoec/component-library';

import routes from '../../routes';
import MakeRouteWithSubRoutes from './MakeRouteWithSubroute';
import UserContext from '../../contexts/UserContext/UserContext';
import { MailToLink } from '../../components/MailToLink';
import { downloadStreamToFile } from '../../utils/fileDownload';

const App: React.FC = () => {
  const { user } = useContext(UserContext);

  async function downloadTemplate(title: string) {
    const type: string = title === 'Excel' ? 'xlsx' : 'csv';

    await downloadStreamToFile(`column-metadata/${type}`, `ECE Data Collection Template.${type}`);
  }

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
                title: 'Excel'
              },
              {
                id: 'csv-template-nav',
                title: '.csv'
              },
            ],
            renderer: (props) => (
              <a {...props}  onClick={() => downloadTemplate(props.text)}>
                {props.text}
              </a>
            ),
            path: '///',
          },
          {
            id: 'data-requirements-nav',
            title: 'Data requirements',
            path: '/data-requirements',
          },
          {
            id: 'feedback-nav',
            title: 'Feedback',
            renderer: () => <MailToLink text="Feedback" />,
            path: '',
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
