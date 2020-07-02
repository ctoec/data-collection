import React, { useContext, useEffect, useState } from 'react';
import { useFetch } from 'use-http';
import type { User } from '../../../../src/models/user';
import AuthenticationContext from '../AuthenticationContext/AuthenticationContext';

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
			fetch('/api/users/current', {
				headers: {
					authorization: `Bearer ${accessToken}`
				}
			})
			.then(data => data.json())
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
