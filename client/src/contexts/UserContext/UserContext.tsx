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
					// TODO: Convert this to use apiKey and update the server for direct
					// TSOA security usage, instead of manually configuring authn/z
					headers: {
						authorization: `Bearer ${accessToken}`,
					}
				}
			))
			.getCurrentUser()
			.then(data => setUser(data))
			.then(_ => setUserLoading(false))
			.finally(() => setUserLoading(false));
		}
	}, [accessToken]);

	return <Provider value={{ loading: userLoading, user }}>{children}</Provider>;
};

export { UserProvider };
export { Consumer as UserConsumer };
export default UserContext;
