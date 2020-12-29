import React from 'react';
import pluralize from 'pluralize';
import idx from 'idx';
import { ErrorBoundary, InlineIcon, Table } from '@ctoec/component-library';
import { AgeGroup, Child, Site } from '../../shared/models';
import { RosterSectionHeader } from './RosterSectionHeader';
import { ColumnNames, tableColumns } from './tableColumns';
import { Moment } from 'moment';
import { AccordionItemProps } from '@ctoec/component-library/dist/components/Accordion/AccordionItem';
import { getCurrentEnrollment } from '../../utils/models';
import { getLastEnrollment } from '../../utils/models/getLastEnrollment';
import { defaultErrorBoundaryProps } from '../../utils/defaultErrorBoundaryProps';
import { RosterQueryParams } from './Roster';

const MAX_LENGTH_EXPANDED = 50;
export const QUERY_STRING_MONTH_FORMAT = 'MMMM-YYYY';

export const filterChildrenByWithdrawn = (children: Child[]) => {
  return children.reduce(
    (filteredChildren, child) => {
      if (
        child.enrollments?.length &&
        child.enrollments?.every((enrollment) => !!enrollment.exit)
      ) {
        filteredChildren.withdrawn.push(child);
      } else {
        filteredChildren.active.push(child);
      }
      return filteredChildren;
    },
    { active: [] as Child[], withdrawn: [] as Child[] }
  );
};

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
export function applySiteFilter(
  allChildren: Child[] | undefined,
  site?: string,
  withdrawn?: boolean
) {
  if (!allChildren) return;

  let filteredChildren: Child[] = allChildren;
  if (site) {
    const getEnrollmentFunc = withdrawn
      ? getLastEnrollment
      : getCurrentEnrollment;
    filteredChildren = filteredChildren.filter(
      (child) => getEnrollmentFunc(child)?.site?.id.toString() === site
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
 * @param children
 * @param opts
 */
export function getAccordionItems(
  children: Child[],
  opts: {
    hideCapacity: boolean;
    hideOrgColumn: boolean;
    hideExitColumn: boolean;
  } = {
    hideCapacity: false,
    hideOrgColumn: true,
    hideExitColumn: true,
  }
): AccordionItemProps[] {
  const childrenByAgeGroup = getChildrenByAgeGroup(children);
  const excludeColumns: ColumnNames[] = [];
  if (opts.hideOrgColumn) excludeColumns.push(ColumnNames.ORGANIZATION);
  if (opts.hideExitColumn) excludeColumns.push(ColumnNames.EXIT);

  return Object.entries(childrenByAgeGroup)
    .filter(
      ([_, ageGroupChildren]) => ageGroupChildren && ageGroupChildren.length
    )
    .map(([ageGroup, ageGroupChildren = []]) => ({
      id: ageGroup.replace(' ', '-'),
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
        <ErrorBoundary alertProps={{ ...defaultErrorBoundaryProps }}>
          <Table<Child>
            className="margin-bottom-4"
            id={`roster-table-${ageGroup}`}
            rowKey={(row) => row?.id}
            data={ageGroupChildren}
            columns={tableColumns(excludeColumns)}
            defaultSortColumn={0}
            defaultSortOrder="ascending"
          />
        </ErrorBoundary>
      ),
      isExpanded: ageGroupChildren.length <= MAX_LENGTH_EXPANDED,
    }));
}

export function getRosterH2(
  childCount: number,
  sites?: Site[],
  query?: RosterQueryParams
) {
  if (!sites || sites?.length === 1) return;
  const siteText = query?.site
    ? sites.find((s) => `${s.id}` === query.site)?.siteName
    : 'All sites';
  return (
    <h2>
      {siteText}
      <span className="text-light">
        {' '}
        {pluralize('child', childCount, true)}
      </span>
    </h2>
  );
}
