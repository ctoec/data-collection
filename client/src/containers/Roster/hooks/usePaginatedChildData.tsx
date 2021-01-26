import { stringify } from 'query-string';
import { useAuthenticatedSWRInfinite } from '../../../hooks/useAuthenticatedSWR';
import { cache } from 'swr';
import { RosterQueryParams } from '../Roster';
import { ListChildReponse } from '../../../shared/payloads';
import { Child } from '../../../shared/models';

const PAGE_SIZE = 100;

/**
 * Does paginated fetching of children for roster in the background,
 * automatically requesting the next page of data while it exists
 * by incrementing useSWRInfinite "page size".
 */
export const usePaginatedChildData = (query: RosterQueryParams) => {
  let stillFetching = true;

  // Fetch child data, filtered by organization and month
  const {
    data: listChildResponses,
    mutate,
    size,
    setSize,
    error,
  } = useAuthenticatedSWRInfinite<ListChildReponse>(getCacheKeyForChildQuery);

  // Trigger next fetch if
  // - we've completed the first fetch (childrenArrays != undefined)
  // - we've completed our most recently triggered fetch (childrenArrays.length == size)
  // - there's more data to fetch (most recent page has records)
  // Or set fetching to false
  if (listChildResponses) {
    if (listChildResponses.length === size &&
      listChildResponses[listChildResponses?.length - 1].children.length
    ) {
      setSize(size + 1);
    } else {
      stillFetching = false;
    }
  }

  return {
    children: listChildResponses ? listChildResponses.flatMap(r => r.children) : [],
    totalCount: listChildResponses ? listChildResponses[size].totalCount : 0,
    mutate,
    stillFetching,
    error,
  };

  /////////////////////////////////////////////////////////////////

  function getCacheKeyForChildQuery(index: number, prevData: ListChildReponse | null) {
    // Base case -- no more data to fetch when prev data length = 0
    if (prevData && !prevData.children.length) {
      stillFetching = false;
      return null;
    }

    // Paginated api query (but only once we have organizationId param)
    return query.organization
      ? `children?${stringify({
          organizationId: query.organization,
          skip: index * PAGE_SIZE,
          take: PAGE_SIZE,
          month: query.month,
        })}`
      : null;
  }
};

/**
 * Clear caches for `children` queries. If organizationId is supplied,
 * then only clear caches for queries made with that id as a query param,
 * otherwise clear all child caches
 *
 * @param organizationId
 */
export const clearChildrenCaches = (organizationId?: string) =>
  cache
    .keys()
    .filter(
      (key) =>
        key.includes('children') &&
        (organizationId
          ? key.includes(`organizationId=${organizationId}`)
          : true)
    )
    .forEach((childrenCacheKey) => cache.delete(childrenCacheKey));
