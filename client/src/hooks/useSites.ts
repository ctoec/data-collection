import { useEffect, useState, useContext } from 'react';
import { Site } from '../shared/models';
import { apiGet } from '../utils/api';
import AuthenticationContext from '../contexts/AuthenticationContext/AuthenticationContext';

export function useSites(organizationId?: number) {
  const { accessToken } = useContext(AuthenticationContext);
  const [sites, setSites] = useState<Site[]>([]);

  useEffect(() => {
    let path: string = 'sites';

    if (!!organizationId) {
      path += `?organizationId=${organizationId}`;
    }

    apiGet(path, accessToken).then((_sites) => setSites(_sites));
  }, [accessToken]);

  return { sites };
}
