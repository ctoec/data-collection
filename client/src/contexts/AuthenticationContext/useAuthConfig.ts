import { useEffect, useState } from 'react';
import {
  AuthorizationServiceConfiguration,
  FetchRequestor,
} from '@openid/appauth';

export const useAuthConfig = (openIdConnectUrl?: string) => {
  const [
    configuration,
    setConfiguration,
  ] = useState<AuthorizationServiceConfiguration>();

  // Only fetch on openIdConnectUrl change
  useEffect(() => {
    /**
     * Get service configuration from configured openId connect provider.
     * This function should only need to be called once for the lifetime of the app
     */
    async function fetchServiceConfiguration(): Promise<void> {
      if (!openIdConnectUrl || configuration) {
        return;
      }
      const _configuration = await AuthorizationServiceConfiguration.fetchFromIssuer(
        openIdConnectUrl,
        new FetchRequestor()
      );
      setConfiguration(_configuration);
    }
    fetchServiceConfiguration();
  }, [openIdConnectUrl]);

  return configuration;
};
