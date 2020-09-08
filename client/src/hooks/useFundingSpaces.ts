import { useEffect, useState, useContext } from 'react';
import { FundingSpace } from '../shared/models';
import { apiGet } from '../utils/api';
import AuthenticationContext from '../contexts/AuthenticationContext/AuthenticationContext';

export function useFundingSpaces() {
  // Get site options for new enrollments
  const { accessToken } = useContext(AuthenticationContext);
  const [fundingSpaces, setFundingSpaces] = useState<FundingSpace[]>([]);
  useEffect(() => {
    apiGet('funding-spaces', { accessToken }).then((_fundingSpaces) =>
      setFundingSpaces(_fundingSpaces)
    );
  }, [accessToken]);

  return { fundingSpaces };
}
