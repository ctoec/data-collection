import { useState } from 'react';
import {
  AuthorizationNotifier,
  AuthorizationRequestHandler,
  RedirectRequestHandler,
  BasicQueryStringUtils,
  QueryStringUtils,
  LocationLike,
  StringMap,
  TokenRequestHandler,
  BaseTokenRequestHandler,
  FetchRequestor,
  GRANT_TYPE_AUTHORIZATION_CODE,
  TokenRequest,
  AuthorizationServiceConfiguration,
  TokenResponse,
} from '@openid/appauth';

export type UseHandlersProps = {
  clientId: string;
  redirectUrl: string;
  onTokenRequestSuccess: (resp: TokenResponse) => any;
  configuration?: AuthorizationServiceConfiguration;
};

export const useHandlers = ({
  clientId,
  configuration,
  redirectUrl,
  onTokenRequestSuccess,
}: UseHandlersProps) => {
  const [notifier] = useState<AuthorizationNotifier>(
    new AuthorizationNotifier()
  );
  const [tokenHandler] = useState<TokenRequestHandler>(
    new BaseTokenRequestHandler(new FetchRequestor())
  );

  notifier.setAuthorizationListener((req, resp, _) => {
    console.log('Authorization listener triggered');
    if (resp) {
      let verifier: string | undefined;
      if (req && req.internal) verifier = req.internal.code_verifier;
      makeAuthorizationCodeTokenRequest(resp.code, verifier);
    }
  });

  const [authorizationHandler] = useState<AuthorizationRequestHandler>(
    new RedirectRequestHandler(
      // Use the default storage backend (i.e. local storage)
      undefined,
      // Identity Server is returning the authorization_code in the query string not URL hash. AppAuth hardcodes the use of hash in other logic.
      // However, it does expose the ability to use query strings with the default BasicQueryStringUtils. By overriding the parse method, we can always require query string parsing irrespective of the supplied argument.
      new (class extends BasicQueryStringUtils implements QueryStringUtils {
        parse(input: LocationLike, _?: boolean): StringMap {
          return super.parse(input, false);
        }
      })()
    )
  );
  authorizationHandler.setAuthorizationNotifier(notifier);

  /**
   * Create and perform authorization code-based token request.
   * This type of token request is only executed after the initial auth request,
   * and is invoked as the authorization listener callback.
   * Once a token is retrieved, the refresh token can be used to request subsquent
   * tokens (until the refresh token expires)
   */
  async function makeAuthorizationCodeTokenRequest(
    code: string,
    verifier: string | undefined
  ) {
    console.log('Auth code token request being made...');
    if (!configuration) {
      console.log(
        'No config, exiting makeAuthorizationCodeTokenRequest early...'
      );
      return;
    }

    let extras: StringMap | undefined = undefined;
    if (verifier) {
      extras = { code_verifier: verifier };
    }

    let req = new TokenRequest({
      client_id: clientId,
      redirect_uri: redirectUrl,
      grant_type: GRANT_TYPE_AUTHORIZATION_CODE,
      code,
      refresh_token: undefined,
      extras: extras,
    });

    console.log('Sending auth code token request!');
    tokenHandler
      .performTokenRequest(configuration, req)
      .then(onTokenRequestSuccess)
      .catch((e) => {
        console.error('Error making authorization code token request: ', e);
      });
  }

  return {
    authorizationHandler,
    tokenHandler,
  };
};
