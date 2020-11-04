import { stringify } from 'query-string';
import { useAuthenticatedSWRInfinite } from '../../../hooks/useAuthenticatedSWR';
import { Child } from '../../../shared/models';

const PAGE_SIZE = 100;

/**
 * Does paginated fetching of children for roster in the background,
 * automatically requesting the next page of data while it exists
 * by incrementing useSWRInfinite "page size".
 */
export const usePaginatedChildData = (organization: string | undefined) => {
  let stillFetching = true;
  // Fetch child data, filtered by organization and month
  const { data: childrenArrays, size, setSize } = useAuthenticatedSWRInfinite<
    Child[]
  >((index, prevData) => {
    // Base case -- no more data to fetch when prev data length = 0
    if (prevData && !prevData.length) {
      stillFetching = false;
      return null;
    }

    // Paginated api query (but only once we have organizationId param)
    return organization
      ? `/children?${stringify({
          organizationId: organization,
          skip: index * PAGE_SIZE,
          take: PAGE_SIZE,
        })}`
      : null;
  });

  // Trigger next fetch if
  // - we've completed the first fetch (childrenArrays != undefined)
  // - we've completed our most recently triggered fetch (childrenArrays.length == size)
  // - there's more data to fetch (most recent page has records)
  if (
    childrenArrays &&
    childrenArrays.length === size &&
    childrenArrays[childrenArrays.length - 1].length
  ) {
    setSize(size + 1);
  }

  return {
    children: childrenArrays ? childrenArrays.flat() : childrenArrays,
    stillFetching,
  };
};
