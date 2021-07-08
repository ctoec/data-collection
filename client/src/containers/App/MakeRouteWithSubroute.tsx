import React from 'react';
import { Route } from 'react-router-dom';
import { RouteConfig } from '../../routes';
import { ConfidentialityAgreement } from './ConfidentialityAgreement';
import { NotSignedInRedirect } from './NotSignedInRedirect';
import { AdminRedirect } from './AdminRedirect';

// Derived from: https://www.freecodecamp.org/news/hitchhikers-guide-to-react-router-v4-c98c39892399/

const MakeRouteWithSubRoutes = (route: RouteConfig) => {
  return (
    <Route
      path={route.path}
      exact={route.exact}
      render={(props) => {
        const component = (
          <route.component {...props} {...route.props} routes={route.routes} />
        );
        
        let renderedComponent = route.unauthorized ? (
          component
        ) : (
          <NotSignedInRedirect>
            <ConfidentialityAgreement>{component}</ConfidentialityAgreement>
          </NotSignedInRedirect>
        );
        renderedComponent = route.adminOnly ? (
          <AdminRedirect>{renderedComponent}</AdminRedirect>
        ) : renderedComponent;
        
        return renderedComponent;
      }}
    />
  );
};

export default MakeRouteWithSubRoutes;
