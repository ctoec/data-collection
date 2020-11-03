import { useContext } from 'react';
import AuthenticationContext from '../contexts/AuthenticationContext/AuthenticationContext';
import useSWR, { responseInterface } from 'swr';

/**
 * Wrapper around useSWR hook that handles retrieving access token,
 * and providing it as part of the swr key param, along with the `path`.
 * Additionally, enables typing casting of the response data from useSWR.
 * @param path
 */
export function useAuthenticatedSWR<T>(path: string | null) {
  const { accessToken } = useContext(AuthenticationContext);
  return useSWR(!path ? null : [path, accessToken]) as responseInterface<
    T,
    string
  >;
}
