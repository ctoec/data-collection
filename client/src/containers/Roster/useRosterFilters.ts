import { useEffect, useState } from 'react';
import { Moment } from 'moment';
import { Child } from '../../shared/models';
import { getFilteredChildren, QUERY_STRING_MONTH_FORMAT } from './rosterUtils';

export type RosterFilterParams = {
  allChildren: Child[];
  activeOrgId?: string | number;
  activeSiteId?: string | number;
  activeMonth?: Moment;
};

export const useRosterFilters = ({
  allChildren,
  activeOrgId,
  activeSiteId,
  activeMonth,
}: RosterFilterParams) => {
  // Children filtered by month and
  const [childrenFilteredByMonth, setChildrenFilteredByMonth] = useState<
    Child[]
  >(allChildren);
  useEffect(() => {
    setChildrenFilteredByMonth(
      getFilteredChildren(allChildren, { activeMonth })
    );
  }, [allChildren, activeMonth?.format(QUERY_STRING_MONTH_FORMAT)]);

  const [childrenFilteredByLocation, setChildrenFilteredByLocation] = useState<
    Child[]
  >(allChildren);
  useEffect(() => {
    setChildrenFilteredByLocation(
      getFilteredChildren(allChildren, {
        activeOrgId,
        activeSiteId,
      })
    );
  }, [allChildren, activeOrgId, activeSiteId]);

  // There's gotta be a better name for this variable
  const [completelyFilteredChildren, setCompletelyFilteredChildren] = useState<
    Child[]
  >(allChildren);
  useEffect(() => {
    setCompletelyFilteredChildren(
      getFilteredChildren(allChildren, {
        activeOrgId,
        activeSiteId,
        activeMonth,
      })
    );
  }, [
    allChildren,
    activeOrgId,
    activeSiteId,
    activeMonth?.format(QUERY_STRING_MONTH_FORMAT),
  ]);

  const childrenWithErrors = allChildren?.filter(
    (c) => c.validationErrors && c.validationErrors.length > 0
  );

  return {
    childrenFilteredByMonth,
    childrenFilteredByLocation,
    completelyFilteredChildren,
    childrenWithErrors,
  };
};
