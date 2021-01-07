import React, { useState } from 'react';
import { Child } from '../../shared/models';
import { cache } from 'swr';
import { stringify } from 'query-string';
import cloneDeep from 'lodash/cloneDeep';

export type RosterQueryParams = {
  organization?: string;
  site?: string;
  month?: string;
  withdrawn?: boolean;
};

export type RosterContextType = {
  updateCurrentRosterCache: (updatedChild: Child) => void;
  setRosterQuery: (_: RosterQueryParams) => void;
};

const RosterContext = React.createContext<RosterContextType>({
  updateCurrentRosterCache: () => {},
  setRosterQuery: () => {},
});

const { Provider } = RosterContext;

const RosterProvider: React.FC = ({ children }) => {
  const [rosterQuery, setRosterQuery] = useState<RosterQueryParams>();

  /**
   * useSWR provides a `mutate` callback to update cache values, but I cannot
   * get it to work for the inifite flavor of the hook. This is a workaround
   * that directly mutates the cache that underlies the SWR stuff without
   * any of the other logic baked in to the mutate func (logic around if the
   * changes should actually be applied, I guess? because they're not)
   * @param updatedChild
   */
  function updateCurrentRosterCache(updatedChild: Child) {
    // If user has not visited roster (there is no query stored in this context)
    // then we don't need to update a roster cache
    if (rosterQuery) {
      const key = cache.keys().find(
        (key) =>
          // special marker for inifinite cache values (https://github.com/vercel/swr/blob/master/src/use-swr-infinite.ts#L124)
          key.includes('many') &&
          // key for the current filtered roster the user is viewing
          key.includes(
            `children?${stringify({
              organizationId: rosterQuery.organization,
              month: rosterQuery.month,
            })}`
          ) &&
          // filter out cache values we don't want (useSWR stores errors and isValidating state in cache as well)
          !key.includes('validating') &&
          !key.includes('err')
      );

      // If cache value exists, update it (immutably, with cloneDeep)
      if (key) {
        const paginatedChildren: Child[][] = cloneDeep(cache.get(key) || []);
        for (const page of paginatedChildren) {
          const childIdx = page.findIndex((c) => c.id === updatedChild.id);
          if (childIdx > -1) {
            page.splice(childIdx, 1, updatedChild);
            break;
          }
        }

        cache.set(key, paginatedChildren);
      }
    }
  }

  return (
    <Provider
      value={{
        updateCurrentRosterCache,
        setRosterQuery,
      }}
    >
      {children}
    </Provider>
  );
};

export { RosterProvider };
export default RosterContext;
