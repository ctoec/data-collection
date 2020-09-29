import React, { useContext, useEffect, useState } from 'react';
import AuthenticationContext from '../AuthenticationContext/AuthenticationContext';
import { User } from '../../shared/models';
import { apiGet } from '../../utils/api';

type UserType =
  | 'multi-org'
  | 'org'
  | 'multi-provider'
  | 'provider'
  | 'multi-site'
  | 'site';

export type UserContextType = {
  user: User | null;
  type: UserType | null;
  loading: boolean;
};

const UserContext = React.createContext<UserContextType>({
  user: null,
  type: null,
  loading: true,
});

const { Provider, Consumer } = UserContext;

export type UserProviderPropsType = {};

/**
 * Context Provider for injecting User object into React hierarchy
 *
 * @param props Props with user
 */
const UserProvider: React.FC<UserProviderPropsType> = ({ children }) => {
  const { accessToken, loading } = useContext(AuthenticationContext);
  const [user, setUser] = useState<User | null>(null);
  const [userLoading, setUserLoading] = useState(loading);

  useEffect(() => {
    if (accessToken) {
      setUserLoading(true);
      apiGet('users/current', { accessToken })
        .then((data) => {
          setUser(data);
        })
        .finally(() => {
          setUserLoading(false);
        });
    } else {
      setUserLoading(loading);
    }
  }, [accessToken, loading]);

  let userType: UserType | null = null;
  if (user) {
    if (user.organizations)
      userType = user.organizations.length > 1 ? 'multi-org' : 'org';
    else if (user.providers)
      userType = user.providers.length > 1 ? 'multi-provider' : 'provider';
    else if (user.sites)
      userType = user.sites.length > 1 ? 'multi-site' : 'site';
  }

  return (
    <Provider value={{ loading: userLoading, user, type: userType }}>
      {children}
    </Provider>
  );
};

export { UserProvider };
export { Consumer as UserConsumer };
export default UserContext;
