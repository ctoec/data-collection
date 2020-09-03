import { useEffect, useState, useContext } from 'react';
import { Site } from '../shared/models';
import { apiGet } from '../utils/api';
import AuthenticationContext from '../contexts/AuthenticationContext/AuthenticationContext';

export function useSites() {
  // Get site options for new enrollments
  const { accessToken } = useContext(AuthenticationContext);
  const [sites, setSites] = useState<Site[]>([]);

  useEffect(() => {
    apiGet('sites', { accessToken }).then((_sites) => setSites(_sites));
  }, [accessToken]);

  return { sites };
}
