import { useEffect, useState } from 'react';
import { getConfig } from '../../config/getConfig';

export const useOpenIdConnectUrl = (
  defaultOpenIdConnectUrl?: string | null
) => {
  // Setup open id connect url on initial mount
  const [openIdConnectUrl, setOpenIdConnectUrl] = useState<string>();
  useEffect(() => {
    (async () => {
      if (!!defaultOpenIdConnectUrl) {
        setOpenIdConnectUrl(defaultOpenIdConnectUrl);
      } else if (!openIdConnectUrl) {
        const wingedKeysUri = await getConfig('WingedKeysUri');
        if (!wingedKeysUri) {
          throw new Error('No winged keys uri found');
        }
        setOpenIdConnectUrl(wingedKeysUri);
      }
    })();
  }, [defaultOpenIdConnectUrl, openIdConnectUrl]);
  return openIdConnectUrl;
};
