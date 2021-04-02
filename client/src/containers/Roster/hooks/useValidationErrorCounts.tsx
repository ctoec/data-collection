import { stringify } from 'query-string';
import { useContext, useState, useEffect } from 'react';
import AuthenticationContext from '../../../contexts/AuthenticationContext/AuthenticationContext';
import RosterContext from '../../../contexts/RosterContext/RosterContext';
import { apiGet } from '../../../utils/api';

// Get other alert counts for ALL child records with errors for the active org
// split by `active` and `withdrawn`
export const useValidationErrorCounts = () => {
  const { accessToken } = useContext(AuthenticationContext);
  const {
    rosterUser: { activeOrgId },
  } = useContext(RosterContext);

  const [validationErrors, setValidationErrors] = useState<{
    numActiveErrors: number;
    numWithdrawnErrors: number;
  }>({
    numActiveErrors: 0,
    numWithdrawnErrors: 0,
  });

  useEffect(() => {
    apiGet(
      `children/validation-errors?${stringify({
        organizationId: activeOrgId,
      })}`,
      accessToken
    ).then((res) => setValidationErrors(res));
  }, [activeOrgId, accessToken]);

  return [validationErrors];
};
