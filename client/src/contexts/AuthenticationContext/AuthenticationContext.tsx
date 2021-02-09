import React, { useEffect, useMemo, useState, useRef } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import {
  AuthorizationRequest,
  TokenResponse,
  TokenRequest,
  StringMap,
  GRANT_TYPE_REFRESH_TOKEN,
  BasicQueryStringUtils,
} from '@openid/appauth';
import { getCurrentHost } from '../../utils/getCurrentHost';
import { usePath } from './usePath';
import { useAuthConfig } from './useAuthConfig';
import { useOpenIdConnectUrl } from './useOpenIdConnectUrl';
import { useHandlers } from './useHandlers';
import { useTimedLogout } from './useTimedLogout';

export type AuthenticationContextType = {
  accessToken: string | null;
  loading: boolean;
};

export type AuthenticationProviderPropsType = {
  clientId: string;
  scope: string;
  localStorageRefreshTokenKey: string;
  localStorageIdTokenKey: string;
  loginEndpoint?: string;
  defaultOpenIdConnectUrl?: string | null;
  redirectEndpoint?: string;
  logoutEndpoint?: string;
  responseType?: string;
  state?: any;
  extras?: any;
};

const AuthenticationContext = React.createContext<AuthenticationContextType>({
  accessToken: null,
  loading: true,
});

const { Provider, Consumer } = AuthenticationContext;

/**
 * Context Provider for OpenID Connect Login
 *
 * @param props The props for configuring authentication.
 */
const defaultProps = {
  loginEndpoint: '/login',
  redirectEndpoint: '/login/callback',
  logoutEndpoint: '/logout',
  responseType: AuthorizationRequest.RESPONSE_TYPE_CODE,
  state: undefined,
  extras: {},
};
const AuthenticationProvider: React.FC<AuthenticationProviderPropsType> = (
  inputProps
) => {
  // Making this a state variable prevents react from making a new object every time and rerending all the things forever
  const props = useMemo(() => ({ ...defaultProps, ...inputProps }), [
    inputProps,
  ]);
  const {
    clientId,
    redirectEndpoint,
    scope,
    localStorageRefreshTokenKey,
    localStorageIdTokenKey,
    responseType,
    state,
    extras,
    children,
    defaultOpenIdConnectUrl,
    logoutEndpoint,
  } = props;

  // Get the URL for winged keys-- in local development, localhost:5050
  const openIdConnectUrl = useOpenIdConnectUrl(defaultOpenIdConnectUrl);
  // Get the configuration, which has the endpoints that we need to use
  const configuration = useAuthConfig(openIdConnectUrl);

  const history = useHistory();
  const redirectUrl = `${getCurrentHost()}${redirectEndpoint}`;
  const [loading, setLoading] = useState(true);

  // Token response is set on initial auth and when a refresh token is requested
  const [tokenResponse, setTokenResponse] = useState<TokenResponse>();
  const { idToken } = tokenResponse || {};
  // Access token is set in memory on initial auth and when refresh token is requested
  // Access token is set in local storage whenever it changes
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null | undefined>(
    null
  );

  let inFlightAccessTokenRequest: any = useRef(false);

  const onInitialTokenRequestSuccess = (resp: TokenResponse) => {
    console.log('HEY LOOK AT US LOGGING IN AND SHIT');
    // After user successfully logs in
    setTokenResponse(resp);
    localStorage.setItem(localStorageIdTokenKey, resp.idToken || '');
    setAccessToken(resp.accessToken);

    localStorage.setItem(localStorageRefreshTokenKey, resp.refreshToken || '');
    setRefreshToken(resp.refreshToken);
    setLoading(false);
    history.push('/');
  };

  const { authorizationHandler, tokenHandler } = useHandlers({
    clientId,
    configuration,
    redirectUrl,
    onTokenRequestSuccess: onInitialTokenRequestSuccess,
  });

  // Get refresh token from localstorage on initial mount
  useEffect(() => {
    const localStorageRefreshToken = localStorage.getItem(
      localStorageRefreshTokenKey
    );

    if (!!localStorageRefreshToken) {
      setLoading(false);
      setRefreshToken(localStorageRefreshToken);
    }
  }, [localStorageRefreshTokenKey]);

  // Update localstorage when refresh token changes
  useEffect(() => {
    const localStorageRefreshToken = localStorage.getItem(
      localStorageRefreshTokenKey
    );

    if (refreshToken && refreshToken !== localStorageRefreshToken) {
      localStorage.setItem(localStorageRefreshTokenKey, refreshToken);
    }
  }, [refreshToken, localStorageRefreshTokenKey]);

  // Make an authorization request whenever:
  // 1) the authorizationHandler is set,
  // 2) the configuration is set or changes, and
  // 3) it is the login screen (isLogin or isCallback)
  const { isLogin, isCallback, isLogout } = usePath(props);
  useEffect(() => {
    if (configuration && authorizationHandler) {
      if (isLogin) {
        handleLogin();
      } else if (isCallback) {
        /*
         * Completes authorization request if possible, executing the callback
         * defined in setAuthorizationListener(). Here, this includes making the
         * initial code-based token request.
         */
        authorizationHandler.completeAuthorizationRequestIfPossible();
      } else if (isLogout) {
        handleLogout();
      } else {
        setLoading(false);
      }
    }
  }, [
    idToken,
    clientId,
    scope,
    localStorageRefreshTokenKey,
    localStorageIdTokenKey,
    configuration,
    authorizationHandler,
    responseType,
    state,
    extras,
    history,
    isLogin,
    isLogout,
    isCallback,
    redirectUrl,
  ]);

  const removeTimeoutFromLocalStorage = useTimedLogout({
    tokenResponse,
    logoutEndpoint,
  });

  /**
   * Create and perform token refresh request.
   * Requires that initial code-based token request has already been performed.
   */
  async function makeRefreshTokenRequest() {
    console.log('Refresh token request triggered');

    if (!configuration) {
      console.log('No config - exiting makeRefreshTokenRequest early...');
      return;
    }

    //  Hopefully this never happens - if there's no refresh token present, there's no way to
    //  generate a new access token, so the user will inevitably get logged out, regardless of activity
    if (!refreshToken) {
      console.log('No refresh token, sooooo exiting early?');
      return;
    }

    const authExpirationBuffer: number = 15 * 60 * -1; // 15 minute expiration buffer

    //  Don't generate new access token if current token doesn't expire within 15 mins
    if (tokenResponse?.isValid(authExpirationBuffer)) {
      console.log('Token response is still valid.  Exiting early...');
      return;
    }

    console.log('CHECKING inFlightAccessTokenRequest', inFlightAccessTokenRequest.current);
    if (inFlightAccessTokenRequest.current) {
      console.log('Access token request already outstanding!  Exiting early...');
      return;
    }

    //  Only make a new access token request if one isn't currently in-flight
    //  in order to prevent rapid, successive requests from inadvertently causing a logout
      console.log('Making refresh token request');

      let req = new TokenRequest({
        client_id: clientId,
        redirect_uri: redirectUrl,
        grant_type: GRANT_TYPE_REFRESH_TOKEN,
        code: undefined,
        refresh_token: refreshToken,
      });

      console.log('Invoking performTokenRequest API call');
      try {
        inFlightAccessTokenRequest.current = true;
        console.log('REQUEST UPDATED - SETTING inFlightAccessTokenRequest TO TRUE', inFlightAccessTokenRequest.current);

        const resp = await tokenHandler.performTokenRequest(
          configuration,
          req
        );

        setTokenResponse(resp);
        setAccessToken(resp.accessToken);
        setRefreshToken(resp.refreshToken);
        console.log('Refresh token api call completed successfully');
      } catch (e) {
        console.error('Could not get refresh token: ', e);
      } finally {
        inFlightAccessTokenRequest.current = false;
        console.log('WE ARE DONE, LETS SET IT TO FALSE', inFlightAccessTokenRequest.current);
      }
  }

  const location = useLocation();
  useEffect(() => {
    console.log('LOCATION CHANGE TRIGGERING REFRESH TOKEN');
    // Ensure token is always fresh by making refresh request whenever browser location changes
    // (function exits early if token is still valid)
    makeRefreshTokenRequest();
  }, [location]);

  const handleLogin = () => {
    /*
     * Create and perform the initial authorization request,
     * including IdentityServer permission acquisition.
     */
    if (!configuration) throw new Error('Cannot log in without configuration');
    let request = new AuthorizationRequest({
      client_id: clientId,
      redirect_uri: redirectUrl,
      scope,
      response_type: responseType,
      state,
      extras,
    });
    authorizationHandler.performAuthorizationRequest(configuration, request);
  };

  const handleLogout = () => {
    /*
     * Remove the refresh token, clear react state, and navigate to main page.
     */
    localStorage.removeItem(localStorageRefreshTokenKey);
    removeTimeoutFromLocalStorage();
    setAccessToken(null);
    setRefreshToken(null);
    setLoading(false);
    if (!configuration?.endSessionEndpoint) {
      throw new Error('End session endpoint not found');
    }
    const savedIdToken = localStorage.getItem(localStorageIdTokenKey);
    const endSessionQueryParams = {
      id_token_hint: idToken || savedIdToken,
      post_logout_redirect_uri: getCurrentHost(),
    } as StringMap;
    const logoutUrl = `${
      configuration.endSessionEndpoint
    }?${new BasicQueryStringUtils().stringify(endSessionQueryParams)}`;
    // Can't use history.push because react router thinks it should give a 404
    window.location.href = logoutUrl;
  };

  /**
   * The wrapped AuthenticationContext provider with instantiated values
   */
  return (
    <Provider
      value={{
        accessToken: accessToken,
        loading: loading,
      }}
    >
      {children}
    </Provider>
  );
};

export { AuthenticationProvider };
export { Consumer as LoginConsumer };
export default AuthenticationContext;
