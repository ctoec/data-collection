import React, { useContext, useEffect } from 'react';
import { Child } from '../../shared/models';
import { cache } from 'swr';
import cloneDeep from 'lodash/cloneDeep';

import UserContext from '../../contexts/UserContext/UserContext';
import { Moment } from 'moment';
import { stringify, parse } from 'query-string';
import { useHistory } from 'react-router-dom';
import { usePaginatedChildData } from '../../containers/Roster/hooks';
import { getQueryMonthFormat } from '../../containers/Roster/rosterUtils';

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

export type RosterContextType = {
  childRecords: Child[];
  fetching: boolean;
  query: RosterQueryParams;
  updateCurrentRosterCache: (
    updatedChild: Child,
    opts?: UpdateCacheOpts
  ) => void;
  updateActiveMonthQuery: (newMonth?: Moment) => void;
  updateWithdrawnQuery: (withdrawn: boolean) => void;
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
  updateCurrentRosterCache: () => {},
  updateActiveMonthQuery: () => {},
  updateWithdrawnQuery: () => {},
};

const RosterContext = React.createContext<RosterContextType>(defaultCtx);

const RosterProvider: React.FC = ({ children }) => {
  const { user } = useContext(UserContext);

  const history = useHistory();
  const query: RosterQueryParams = parse(history.location.search);

  // Parse and sanitize query params, update if missing (i.e. initial load) or invalid
  useEffect(() => {
    // Wait until user exists
    if (!user) return;

    const updatedQuery = { ...query };

    // Add org id if user has org-access AND:
    // - no org is active OR
    // - active org is invalid (user does not have access)
    if (
      user?.organizations &&
      (!query.organizationId ||
        !user?.organizations?.find(
          (o) => o?.id?.toString() === query.organizationId
        ))
    ) {
      updatedQuery.organizationId = user?.organizations?.[0]?.id.toString();
    }

    // Add site id if user has site access AND
    // - there is an active site AND
    // - active site is invalid (user does not have access)
    if (
      query.site &&
      !user?.sites?.find((s) => s.id.toString() === query.site)
    ) {
      delete updatedQuery.site;
    }

    if (Object.values(query) !== Object.values(updatedQuery)) {
      history.replace({
        ...history.location,
        search: stringify(updatedQuery),
      });
    }
  }, [query.organizationId, query.site, user?.organizations, user?.sites]);

  const { childRecords, fetching, error } = usePaginatedChildData(query);
  if (error) throw error;

  /**
   * useSWR provides a `mutate` callback to update cache values, but I cannot
   * get it to work for the inifite flavor of the hook. This is a workaround
   * that directly mutates the cache that underlies the SWR stuff without
   * any of the other logic baked in to the mutate func (logic around if the
   * changes should actually be applied, I guess? because they're not)
   * @param updatedChild
   */
  function updateCurrentRosterCache(
    updatedChild: Child,
    opts?: UpdateCacheOpts
  ) {
    // If user has not visited roster (there is no query stored in this context)
    // then we don't need to update a roster cache
    if (query) {
      const key = cache.keys().find(
        (key) =>
          // special marker for inifinite cache values (https://github.com/vercel/swr/blob/master/src/use-swr-infinite.ts#L124)
          key.includes('many') &&
          // key for the current filtered roster the user is viewing
          key.includes(
            `children${query.withdrawn ? '/withdrawn' : ''}?${stringify({
              organizationId: query.organizationId,
              month: query.month,
            })}`
          ) &&
          // filter out cache values we don't want (useSWR stores errors and isValidating state in cache as well)
          !key.includes('validating') &&
          !key.includes('err')
      );

      // If cache value exists, update it (immutably, with cloneDeep)
      if (key) {
        const paginatedChildren: Child[][] = cloneDeep(cache.get(key) || []);
        if (opts === UpdateCacheOpts.Add) {
          paginatedChildren[paginatedChildren.length - 1]?.push(updatedChild);
        } else {
          for (const page of paginatedChildren) {
            const childIdx = page?.findIndex((c) => c.id === updatedChild.id);
            if (childIdx > -1) {
              if (opts === UpdateCacheOpts.Remove) {
                page.splice(childIdx, 1);
              } else {
                page.splice(childIdx, 1, updatedChild);
              }
            }
          }
        }
        cache.set(key, paginatedChildren);
      }
    }
  }

  return (
    <RosterContext.Provider
      value={{
        childRecords,
        fetching,
        query,
        updateCurrentRosterCache,
        // Function to update active month, to pass down into month filter buttons
        updateActiveMonthQuery: (newMonth?: Moment) => {
          const month = getQueryMonthFormat(newMonth);
          history.push({
            search: stringify({
              ...query,
              withdrawn: defaultCtx.query.withdrawn,
              month,
            }),
          });
        },
        // Function to update whether we're only showing withdrawn enrollments
        updateWithdrawnQuery: (withdrawn: boolean) => {
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
