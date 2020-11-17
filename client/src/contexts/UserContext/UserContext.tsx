import React, { useContext, useEffect, useState } from 'react';
import AuthenticationContext from '../AuthenticationContext/AuthenticationContext';
import { User } from '../../shared/models';
import { apiGet } from '../../utils/api';
import { useHistory } from 'react-router-dom';
import { handleJWTError } from '../../utils/handleJWTError';

export type UserContextType = {
  user: User | null;
  loading: boolean;
};

const UserContext = React.createContext<UserContextType>({
  user: null,
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
  const history = useHistory();

  useEffect(() => {
    if (accessToken) {
      setUserLoading(true);
      apiGet('users/current', accessToken)
        .then((data) => {
          setUser(data);
        })
        .catch(
          handleJWTError(history, (err) => {
            throw new Error(err);
          })
        )
        .finally(() => {
          setUserLoading(false);
        });
    } else {
      setUserLoading(loading);
    }
  }, [accessToken, loading]);

  return <Provider value={{ loading: userLoading, user }}>{children}</Provider>;
};

export { UserProvider };
export { Consumer as UserConsumer };
export default UserContext;
