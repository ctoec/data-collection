import React, { useContext } from 'react';
import { Child } from '../../shared/models';

import { Moment } from 'moment';
import { stringify, parse } from 'query-string';
import { useHistory } from 'react-router-dom';
import UserContext from '../../contexts/UserContext/UserContext';
import { User } from '../../shared/models';
import { usePaginatedChildData } from '../../containers/Roster/hooks';
import { getQueryMonthFormat } from '../../containers/Roster/rosterUtils';

export const ALL_SITES = 'all-sites';

export type RosterQueryParams = {
  organizationId?: string;
  site?: string;
  month?: string;
  withdrawn?: boolean;
};

export enum UpdateCacheOpts {
  Remove,
  Add,
}

export type UpdateCacheParams = {
  updatedChild: Child;
  opts?: UpdateCacheOpts;
};

export type RosterContextType = {
  childRecords: Child[];
  fetching: boolean;
  query: RosterQueryParams;
  revalidate: () => Promise<boolean>;
  rosterUser: {
    activeOrgId?: string;
    isMultiOrgUser: boolean;
    isSiteLevelUser: boolean;
    user?: User | null;
  };
  updateChildRecords: (params: UpdateCacheParams) => void;
  updateQueryMonth: (newMonth?: Moment) => void;
  updateQueryOrgId: (newId: string) => void;
  updateQuerySite: (newId: string) => void;
  updateQueryWithdrawn: (withdrawn?: boolean) => void;
};

const defaultCtx = {
  childRecords: [],
  fetching: false,
  query: {
    organizationId: undefined,
    site: undefined,
    month: undefined,
    withdrawn: undefined,
  },
  revalidate: async () => await false,
  rosterUser: {
    isMultiOrgUser: false,
    isSiteLevelUser: false,
  },
  updateChildRecords: () => {},
  updateQueryMonth: () => {},
  updateQueryOrgId: () => {},
  updateQuerySite: () => {},
  updateQueryWithdrawn: () => {},
};

const RosterContext = React.createContext<RosterContextType>(defaultCtx);

const RosterProvider: React.FC = ({ children }) => {
  const { user } = useContext(UserContext);

  if (user?.isAdmin) {
    return <></>;
  }

  const history = useHistory();
  const query: RosterQueryParams = parse(history.location.search);

  // Multi-org users have the active org in the query, else arbitrarily pick first
  const activeOrgId =
    query.organizationId ?? user?.organizations?.[0]?.id.toString();
  const isMultiOrgUser = (user?.organizations ?? []).length > 1;
  if (isMultiOrgUser) query.organizationId = activeOrgId;

  const { error, ...childData } = usePaginatedChildData(query);
  if (error) console.error(error);

  return (
    <RosterContext.Provider
      value={{
        ...childData,
        query,
        rosterUser: {
          activeOrgId,
          isMultiOrgUser,
          isSiteLevelUser: user?.accessType === 'site',
          user,
        },
        updateQueryMonth: (newMonth?: Moment) => {
          const month = getQueryMonthFormat(newMonth);
          history.push({
            search: stringify({
              ...query,
              withdrawn: defaultCtx.query.withdrawn,
              month,
            }),
          });
        },
        updateQueryOrgId: (newId: string) => {
          // Remove site param if newId !== current orgId
          if (newId !== query.organizationId) delete query.site;
          history.push({
            search: stringify({
              ...query,
              organizationId: newId,
            }),
          });
        },
        updateQuerySite: (newId: string) => {
          // Push a specific site id if specific site selected
          if (newId !== ALL_SITES) {
            history.push({
              search: stringify({ ...query, site: newId }),
            });
          }
          // Or remove site param from search if 'All sites' selected
          else {
            delete query.site;
            history.push({ search: stringify(query) });
          }
        },
        updateQueryWithdrawn: (withdrawn?: boolean) => {
          history.push({
            search: stringify({
              ...query,
              month: defaultCtx.query.month,
              withdrawn,
            }),
          });
        },
      }}
    >
      {children}
    </RosterContext.Provider>
  );
};

export { RosterProvider };
export default RosterContext;
