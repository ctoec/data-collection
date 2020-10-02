import { useEffect, useState, useContext } from 'react';
import { FundingSpace } from '../shared/models';
import { apiGet } from '../utils/api';
import AuthenticationContext from '../contexts/AuthenticationContext/AuthenticationContext';

export function useFundingSpaces(organizationId?: number) {
  const { accessToken } = useContext(AuthenticationContext);
  const [fundingSpaces, setFundingSpaces] = useState<FundingSpace[]>([]);

  useEffect(() => {
    let path: string = 'funding-spaces';

    if (!!organizationId) {
      path += `?organizationId=${organizationId}`;
    }

    apiGet(path, { accessToken }).then((_fundingSpaces) =>
      setFundingSpaces(_fundingSpaces)
    );
  }, [accessToken]);

  return { fundingSpaces };
}
