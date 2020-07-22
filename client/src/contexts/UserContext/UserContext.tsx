import React, { useContext, useEffect, useState } from 'react';
import AuthenticationContext from '../AuthenticationContext/AuthenticationContext';
import { User, Configuration, DefaultApi } from '../../generated';
import { getCurrentHost } from '../../utils/getCurrentHost';

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
<<<<<<< HEAD
  const { accessToken, loading } = useContext(AuthenticationContext);
  const [user, setUser] = useState<User | null>(null);
  const [userLoading, setUserLoading] = useState(loading);

  useEffect(() => {
    setUserLoading(false);
    if (accessToken) {
      setUserLoading(true);
      new DefaultApi(
        new Configuration({
          basePath: `${getCurrentHost()}/api`,
          apiKey: `Bearer ${accessToken}`,
        })
      )
        .getCurrentUser()
        .then((data) => setUser(data))
        .then((_) => setUserLoading(false))
        .finally(() => setUserLoading(false));
    }
  }, [accessToken]);

  return <Provider value={{ loading: userLoading, user }}>{children}</Provider>;
=======
	const { accessToken, loading } = useContext(AuthenticationContext);
	const [user, setUser] = useState<User | null>(null);
	const [userLoading, setUserLoading] = useState(loading);

	useEffect(() => {
		setUserLoading(false);
		if (accessToken) {
			setUserLoading(true);
			new DefaultApi(
				new Configuration({
					basePath: `${getCurrentHost()}/api`,
					apiKey: `Bearer ${accessToken}`,
				}
			))
			.getCurrentUser()
			.then(data => setUser(data))
			.then(_ => setUserLoading(false))
			.finally(() => setUserLoading(false));
		}
	}, [accessToken]);

	return <Provider value={{ loading: userLoading, user }}>{children}</Provider>;
>>>>>>> Add TSOA, generate spec and client code (PR #68) (Issue #57)
};

export { UserProvider };
export { Consumer as UserConsumer };
export default UserContext;
