import { useEffect } from 'react';
import { TokenResponse } from '@openid/appauth';
import moment from 'moment';
import { useHistory } from 'react-router-dom';

const localStorageKey = 'oec-data-collection-timeout';
export const useTimedLogout = ({
  tokenResponse,
  logoutEndpoint,
}: {
  tokenResponse?: TokenResponse;
  logoutEndpoint: string;
}) => {
  const history = useHistory();
  let logoutTimeout: NodeJS.Timeout;
  const setLogoutTimeout = (_millisecondsUntilExpiration: number) => {
    logoutTimeout = setTimeout(() => {
      history.push(logoutEndpoint);
    }, _millisecondsUntilExpiration);
  };

  useEffect(() => {
    // Whenever a token response is received, set a "when the token expires" var in local storage
    // Set a timeout for the difference between then and when this is loaded
    // Reset that timeout every time a new token response is received
    const storedExpirationTime = localStorage.getItem(localStorageKey);
    let expirationTimeInMilliseconds = storedExpirationTime
      ? +storedExpirationTime
      : undefined;

    if (tokenResponse) {
      if (tokenResponse.expiresIn) {
        expirationTimeInMilliseconds =
          (tokenResponse.issuedAt + tokenResponse.expiresIn) * 1000;
        localStorage.setItem(
          localStorageKey,
          `${expirationTimeInMilliseconds}`
        );
      } else {
        // Otherwise make it expire after 24 hrs
        expirationTimeInMilliseconds =
          tokenResponse.issuedAt + 24 * 60 * 60 * 1000;
      }
      localStorage.setItem(localStorageKey, `${expirationTimeInMilliseconds}`);
    }

    if (logoutTimeout) {
      // Clear old timeout if one exists
      clearTimeout(logoutTimeout);
    }

    if (expirationTimeInMilliseconds) {
      // If there is an expiration time, set a timeout
      const momentExpirationTime = moment.utc(
        expirationTimeInMilliseconds,
        'x'
      );
      let millisecondsUntilExpiration = momentExpirationTime.diff(
        moment.utc(),
        'milliseconds'
      );
      if (momentExpirationTime.isBefore(moment.utc())) {
        millisecondsUntilExpiration = 0;
      }
      setLogoutTimeout(millisecondsUntilExpiration);
    }
  }, [tokenResponse]);

  return function removeTimeoutFromLocalStorage() {
    localStorage.removeItem(localStorageKey);
  };
};
