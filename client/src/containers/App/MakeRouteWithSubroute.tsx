import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { RouteConfig } from '../../routes';
import { ConfidentialityAgreement } from './ConfidentialityAgreement';
import { NotSignedInRedirect } from './NotSignedInRedirect';

// Derived from: https://www.freecodecamp.org/news/hitchhikers-guide-to-react-router-v4-c98c39892399/

const MakeRouteWithSubRoutes = (route: RouteConfig) => {
  // console.log('redirectPaths', route.redirectPaths);
  console.log('route - make route with sub routes', route);

  return (
    <>
      {route.redirect ? (
        <Route path={route.path}>
          <Redirect to={route.redirect}></Redirect>
        </Route>
      ) : (
        <Route
          path={route.path}
          exact={route.exact}
          render={(props) => {
            const component = (
              <route.component
                {...props}
                {...route.props}
                routes={route.routes}
              />
            );
            return route.unauthorized ? (
              component
            ) : (
              <NotSignedInRedirect>
                <ConfidentialityAgreement>{component}</ConfidentialityAgreement>
              </NotSignedInRedirect>
            );
          }}
        />
      )}
    </>
  );
};

export default MakeRouteWithSubRoutes;
