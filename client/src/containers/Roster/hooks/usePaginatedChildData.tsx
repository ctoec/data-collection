import { stringify } from 'query-string';
import { useAuthenticatedSWRInfinite } from '../../../hooks/useAuthenticatedSWR';
import { Child } from '../../../shared/models';
import {
  RosterQueryParams,
  UpdateCacheOpts,
  UpdateCacheParams,
} from '../../../contexts/RosterContext/RosterContext';
import cloneDeep from 'lodash/cloneDeep';

const PAGE_SIZE = 100;

/**
 * Does paginated fetching of children for roster in the background,
 * automatically requesting the next page of data while it exists
 * by incrementing useSWRInfinite "page size".
 */
export const usePaginatedChildData = ({
  month,
  organizationId,
  withdrawn,
}: RosterQueryParams) => {
  let fetching = true;
  // Fetch child data, filtered by organization and month
  const {
    data: childrenArrays,
    mutate,
    size,
    setSize,
    error,
    revalidate,
  } = useAuthenticatedSWRInfinite<Child[]>((index, prevData) => {
    // Base case -- no more data to fetch when prev data length = 0
    if (prevData && !prevData.length) {
      fetching = false;
      return null;
    }

    return `children${withdrawn ? '/withdrawn' : ''}?${stringify({
      organizationId,
      month,
      skip: index * PAGE_SIZE,
      take: PAGE_SIZE,
    })}`;
  });

  if (error) {
    fetching = false;
  }

  // Trigger next fetch if
  // - we've completed the first fetch (childrenArrays != undefined)
  // - we've completed our most recently triggered fetch (childrenArrays.length == size)
  // - there's more data to fetch (most recent page has records)
  // Or set fetching to false
  if (childrenArrays) {
    if (
      childrenArrays.length === size &&
      childrenArrays[childrenArrays?.length - 1]?.length
    ) {
      setSize(size + 1);
    } else {
      fetching = false;
    }
  }

  return {
    childRecords: childrenArrays ? childrenArrays.flat() : [],
    error,
    fetching,
    // Mutate the cache with updated child data
    updateChildRecords: ({ updatedChild, opts }: UpdateCacheParams) => {
      const data = cloneDeep(childrenArrays ?? []);
      if (opts === UpdateCacheOpts.Add) {
        data[data.length - 1]?.push(updatedChild);
      } else {
        for (const page of data) {
          const childIdx = page?.findIndex((c) => c.id === updatedChild.id);
          if (childIdx > -1) {
            if (opts === UpdateCacheOpts.Remove) {
              page.splice(childIdx, 1);
            } else {
              page.splice(childIdx, 1, updatedChild);
            }
          }
        }
        mutate(data);
        // okay now _really_ mutate: https://github.com/vercel/swr/issues/908
        mutate();
      }
    },
    // TODO: Apparently this will be deprecated, but the alternative is really poorly defined
    // https://github.com/vercel/swr/discussions/812#discussioncomment-203697
    revalidate,
  };
};
