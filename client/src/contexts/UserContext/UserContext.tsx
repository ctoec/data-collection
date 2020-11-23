import React, {
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from 'react';
import AuthenticationContext from '../AuthenticationContext/AuthenticationContext';
import { User } from '../../shared/models';
import { apiGet, apiPost } from '../../utils/api';

export type UserContextType = {
  user: User | null;
  loading: boolean;
  setConfidentialityAgreed: Dispatch<SetStateAction<boolean>>;
  confidentialityAgreed: boolean;
};

const UserContext = React.createContext<UserContextType>({
  user: null,
  loading: true,
  confidentialityAgreed: false,
  setConfidentialityAgreed: () => {},
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
  const [refetchUser, setRefetchUser] = useState(false);

  useEffect(() => {
    if (accessToken) {
      setUserLoading(true);
      apiGet('users/current', accessToken)
        .then((data) => {
          setUser(data);
        })
        .catch((err) => {
          // This doesn't need to throw an error because the lack of user is taken to mean that this failed
          console.error(err);
        })
        .finally(() => {
          setUserLoading(false);
          setRefetchUser(false);
        });
    } else {
      setUserLoading(loading);
    }
  }, [accessToken, loading, refetchUser]);

  function setConfidentialityAgreed() {
    apiPost(
      `users/current`,
      { ...user, confidentialityAgreed: true },
      { accessToken, jsonParse: false }
    )
      .then(() => setRefetchUser(true))
      .catch((err) => {
        console.error(err);
        throw new Error('Error processing confidentiality agreement');
      });
  }

  return (
    <Provider
      value={{
        loading: userLoading,
        user,
        confidentialityAgreed: user?.confidentialityAgreed || false,
        setConfidentialityAgreed,
      }}
    >
      {children}
    </Provider>
  );
};

export { UserProvider };
export { Consumer as UserConsumer };
export default UserContext;
