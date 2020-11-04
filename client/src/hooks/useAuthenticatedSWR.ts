import { useContext } from 'react';
import AuthenticationContext from '../contexts/AuthenticationContext/AuthenticationContext';
import useSWR, {
  responseInterface,
  useSWRInfinite,
  SWRInfiniteResponseInterface,
} from 'swr';

/**
 * Wrapper around useSWR hook that handles retrieving access token,
 * and providing it as part of the swr key param, along with the
 * provided `path`.
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

/**
 * Wrapper around useSWRInfinite hook that handles retrieving access token,
 * and using it in the swr infinite getKey function, along with the path from
 * provided `getPath`.
 * Additionally, enables typing casting of the response data from useSWRInfinite.
 * @param path
 */
export function useAuthenticatedSWRInfinite<T>(
  getPath: (index: number, prevData: T | null) => string | null
) {
  const { accessToken } = useContext(AuthenticationContext);

  const getKey = (index: number, prevData: T | null) => {
    const path = getPath(index, prevData);
    const key = !path ? null : [path, accessToken];
    return key;
  };
  return useSWRInfinite(getKey) as SWRInfiniteResponseInterface<T, string>;
}
