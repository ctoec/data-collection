import React from 'react';
import pluralize from 'pluralize';
import idx from 'idx';
import { InlineIcon, Table } from '@ctoec/component-library';
import { AgeGroup, Child } from '../../shared/models';
import { RosterSectionHeader } from './RosterSectionHeader';
import { tableColumns } from './tableColumns';
import { Moment } from 'moment';
import { AccordionItemProps } from '@ctoec/component-library/dist/components/Accordion/AccordionItem';
import {
  getCurrentEnrollment,
  childHasEnrollmentsActiveInMonth,
} from '../../utils/models';

const MAX_LENGTH_EXPANDED = 50;
export const QUERY_STRING_MONTH_FORMAT = 'MMMM-YYYY';

/**
 * Get month param in query string month format
 * @param month
 */
export const getQueryMonthFormat = (month?: Moment) => {
  if (!month || !month.isValid()) return undefined;
  return month.format(QUERY_STRING_MONTH_FORMAT);
};

/**
 * Does client-side data filtering, by site and/or month
 * @param allChildren
 * @param site
 * @param month
 */
export function applyClientSideFilters(
  allChildren: Child[],
  site?: string,
  month?: Moment,
  showOnlyWithdrawnEnrollments?: boolean
): Child[] {
  let filteredChildren: Child[] = allChildren;
  if (month) {
    filteredChildren = filteredChildren.filter((child) => {
      return childHasEnrollmentsActiveInMonth(child, month);
    });
  }
  if (site) {
    filteredChildren = filteredChildren.filter(
      (child) => getCurrentEnrollment(child)?.site?.id.toString() === site
    );
  }
  if (showOnlyWithdrawnEnrollments) {
    filteredChildren = filteredChildren.filter(
      (c) => c.enrollments?.findIndex((e) => !e.exit) === -1
    );
  }
  return filteredChildren;
}

/**
 * Helper types for organizing children into sections by ageGroup
 */
const NoAgeGroup = 'Incomplete enrollments';
type RosterSections = AgeGroup | typeof NoAgeGroup;
type ChildrenByAgeGroup = {
  [key in RosterSections]?: Child[];
};

/**
 * Returns a dict of filtered children, with age groups as keys.
 * @param filteredChildren
 */
export function getChildrenByAgeGroup(
  filteredChildren: Child[]
): ChildrenByAgeGroup {
  const childrenByAgeGroup: ChildrenByAgeGroup = {};
  // Filter all children into an object, keyed by age group
  // with array of children for that agegroup as value
  filteredChildren.reduce((_byAgeGroup, _child) => {
    const ageGroup = idx(_child, (_) => _.enrollments[0].ageGroup) || undefined;
    if (ageGroup) {
      if (!!!_byAgeGroup[ageGroup]) {
        _byAgeGroup[ageGroup] = [_child];
      } else {
        // _byAgeGroup[ageGroup] is not _actually_ possibly undefined; checked in above if
        _byAgeGroup[ageGroup]?.push(_child);
      }
    } else {
      if (!_byAgeGroup[NoAgeGroup]) {
        _byAgeGroup[NoAgeGroup] = [_child];
      } else {
        _byAgeGroup[NoAgeGroup]?.push(_child);
      }
    }
    return _byAgeGroup;
  }, childrenByAgeGroup);

  // Sort object to have consistent section ordering, where NoAgeGroup will always
  // be first if it exists, followed by AgeGroups as they are defined in the enum
  const sortedByAgeGroup: ChildrenByAgeGroup = {};
  if (
    childrenByAgeGroup[NoAgeGroup] &&
    childrenByAgeGroup[NoAgeGroup]?.length
  ) {
    sortedByAgeGroup[NoAgeGroup] = childrenByAgeGroup[NoAgeGroup];
  }
  Object.values(AgeGroup).forEach((ageGroup) => {
    if (childrenByAgeGroup[ageGroup] && childrenByAgeGroup[ageGroup]?.length) {
      sortedByAgeGroup[ageGroup] = childrenByAgeGroup[ageGroup];
    }
  });
  return sortedByAgeGroup;
}

/**
 * Returns array of AccordionItemProps, used to render the roster
 * age group accordion sections.
 * @param childrenByAgeGroup
 * @param opts
 */
export function getAccordionItems(
  childrenByAgeGroup: ChildrenByAgeGroup,
  opts: { hideCapacity: boolean; showOrgInTables: boolean } = {
    hideCapacity: false,
    showOrgInTables: false,
  }
): AccordionItemProps[] {
  return Object.entries(childrenByAgeGroup)
    .filter(
      ([_, ageGroupChildren]) => ageGroupChildren && ageGroupChildren.length
    )
    .map(([ageGroup, ageGroupChildren = []]) => ({
      id: ageGroup,
      title: (
        <>
          {ageGroup === NoAgeGroup && <InlineIcon icon="attentionNeeded" />}
          {ageGroup}{' '}
          <span className="text-normal">
            {pluralize('children', ageGroupChildren.length, true)}{' '}
          </span>
          {ageGroup === NoAgeGroup && (
            <>
              <br />
              <p className="usa-error-message margin-y-0 font-body-md">
                All records must have an assigned age group
              </p>
            </>
          )}
        </>
      ),
      headerContent: (
        <RosterSectionHeader
          children={ageGroupChildren}
          hideCapacity={opts.hideCapacity}
        />
      ),
      expandText: `Show ${ageGroup} roster`,
      collapseText: `Hide ${ageGroup} roster`,
      content: (
        <Table<Child>
          className="margin-bottom-4"
          id={`roster-table-${ageGroup}`}
          rowKey={(row) => row.id}
          data={ageGroupChildren}
          columns={tableColumns(opts.showOrgInTables)}
          defaultSortColumn={0}
          defaultSortOrder="ascending"
        />
      ),
      isExpanded: ageGroupChildren.length <= MAX_LENGTH_EXPANDED,
    }));
}
