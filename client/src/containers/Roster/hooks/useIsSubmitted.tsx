import { useContext, useState, useEffect } from 'react';
import AuthenticationContext from '../../../contexts/AuthenticationContext/AuthenticationContext';
import RosterContext from '../../../contexts/RosterContext/RosterContext';
import { apiGet } from '../../../utils/api';

// Determine if we need to show the successful submit alert when loading
// page (the alert is persistent and should appear at the top of the roster
// any time after submitting until the end of the collection period)
export const useIsSubmitted = () => {
  const { accessToken } = useContext(AuthenticationContext);
  const {
    query: { organizationId },
  } = useContext(RosterContext);

  const [isSubmitted, setIsSubmitted] = useState(false);
  useEffect(() => {
    if (!organizationId) return;

    apiGet(`oec-report/${organizationId}`, accessToken).then((res) => {
      setIsSubmitted(!!res?.submitted);
    });
  }, [organizationId, accessToken]);

  return [isSubmitted, setIsSubmitted] as const;
};
