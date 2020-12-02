import { useEffect } from "react";
import { TokenResponse } from "@openid/appauth";
import moment from "moment";
import { useHistory } from "react-router-dom";

const localStorageKey = 'oec-data-collection-timeout'
export const useTimedLogout = ({ tokenResponse, logoutEndpoint }: { tokenResponse?: TokenResponse, logoutEndpoint: string }) => {
  const history = useHistory();
  let logoutTimeout: NodeJS.Timeout;
  const setLogoutTimeout = (_millisecondsUntilTokenExpiration: number) => {
    console.log('setting timeout', _millisecondsUntilTokenExpiration)
    logoutTimeout = setTimeout(() => {
      history.push(logoutEndpoint);
    }, 30 * 1000);
  }

  useEffect(() => {
    // Whenever a token response is received, set a "when the token expires" var in local storage
    // Set a timeout for the difference between then and when this is loaded
    // Reset that timeout every time a new token response is received
    const localStorageSecondsUntilTimeout = localStorage.getItem(localStorageKey);
    let millisecondsUntilTokenExpiration = localStorageSecondsUntilTimeout ? moment.utc(+localStorageSecondsUntilTimeout * 1000).diff(moment.utc(), 'seconds') : undefined;
    if (tokenResponse) {
      if (tokenResponse.expiresIn) {
        millisecondsUntilTokenExpiration = tokenResponse.issuedAt + tokenResponse.expiresIn
        localStorage.setItem(localStorageKey, `${millisecondsUntilTokenExpiration}`);
      } else {
        // Otherwise make it expire after 24 hrs
        millisecondsUntilTokenExpiration = tokenResponse.issuedAt + 24 * 60 * 60 * 1000;
      }
      localStorage.setItem(localStorageKey, `${millisecondsUntilTokenExpiration}`);
    }
    if (logoutTimeout) {
      clearTimeout(logoutTimeout)
    }
    if (millisecondsUntilTokenExpiration) {
      setLogoutTimeout(millisecondsUntilTokenExpiration);
    }
  }, [tokenResponse])

  return function removeTimeoutFromLocalStorage() {
    localStorage.removeItem(localStorageKey);
  }
}