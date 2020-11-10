import { useHistory } from 'react-router-dom';
import { useEffect, useContext } from 'react';
import UserContext from '../../../contexts/UserContext/UserContext';
import { parse, stringify } from 'querystring';
import { RosterQueryParams } from '../Roster';

export const useUpdateRosterParams = () => {
  const { user } = useContext(UserContext);
  const organizations = user?.organizations || [];
  const sites = user?.sites || [];
  const isMultiOrgUser = user?.organizations || [];

  const history = useHistory();
  const query = parse(history.location.search.slice(1)) as RosterQueryParams

  useEffect(() => {
    // Wait until user exists
    if (!user) return;

    let updatedQuery = { ...query };
    // Add org id if user has org-access AND:
    // - no org is active OR
    // - active org is invalid (user does not have access)
    if (isMultiOrgUser) {
      if (
        !query.organization ||
        !organizations.find((o) => o.id.toString() === query.organization)
      ) {
        updatedQuery.organization = organizations[0].id.toString();
      }
    }
    // Add site id if user has site access AND
    // - there is an active site AND
    // - active site is invalid (user does not have access)
    if (query.site && !sites.find((s) => s.id.toString() === query.site)) {
      delete updatedQuery.site;
    }

    if (Object.values(query) !== Object.values(updatedQuery)) {
      history.replace({ search: stringify(updatedQuery) });
    }
  }, [query.organization, query.site, organizations, sites]);
};
