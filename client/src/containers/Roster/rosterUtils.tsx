import React from 'react';
import {
  AlertProps,
  InlineIcon,
  TabItem,
  Table,
} from '@ctoec/component-library';
import { AgeGroup, Child, Organization, Site } from '../../shared/models';
import pluralize from 'pluralize';
import { RosterSectionHeader } from './RosterSectionHeader';
import { tableColumns } from './tableColumns';
import idx from 'idx';
import { Link } from 'react-router-dom';

export const ALL = {
  SITES: 'all-sites',
  ORGS: 'all-organizations',
};

const MAX_LENGTH_EXPANDED = 50;

export function getChildrenWithErrorsAlertProps(
  numberOfChildrenWithErrors: number
): AlertProps {
  return {
    text: (
      <span>
        You'll need to add required info for{' '}
        {pluralize('record', numberOfChildrenWithErrors, true)} before
        submitting your data to OEC. Update with{' '}
        <Link className="usa-button usa-button--unstyled" to="/batch-edit">
          batch editing.
        </Link>
      </span>
    ),
    heading: 'Update roster before submitting',
    type: 'warning',
  };
}

export function getFilteredChildren(
  children: Child[],
  activeOrgId?: any,
  activeSiteId?: any
) {
  if (activeSiteId) {
    return filterChildrenBySite(activeSiteId, children);
  } else if (activeOrgId) {
    return filterChildrenByOrg(activeOrgId, children);
  }
  return children;
}

/**
 * Returns children at given org
 */
export function filterChildrenByOrg(
  orgId: number | string,
  children?: Child[]
): Child[] {
  if (!children) return [];
  if (!orgId || orgId === ALL.ORGS) return children;

  // Coerce siteId to an integer
  const _orgId = +orgId;
  return children.filter((c) => c.organization.id === _orgId);
}

/**
 * Returns children currently enrolled at a given site
 */
export function filterChildrenBySite(
  siteId: number | string,
  children?: Child[]
): Child[] {
  if (!children) return [];
  if (!siteId || siteId === ALL.SITES) return children;

  // Coerce siteId to an integer
  const _siteId = +siteId;
  return children.filter(
    (c) => c.enrollments?.find((e) => !e.exit)?.site?.id === _siteId
  );
}

export function formatRosterTabText(text: string) {
  if (text.length > 20) {
    return `${text.slice(0, 19)}...`;
  }
  return text;
}

export function getSiteItems(sites: Site[]): TabItem[] {
  const siteItems: TabItem[] = sites.map(({ id, siteName }) => ({
    id: `${id}`,
    tabText: siteName,
    tabTextFormatter: formatRosterTabText,
  }));
  siteItems.splice(0, 0, {
    id: ALL.SITES,
    tabText: 'All sites',
    firstItem: true,
  });
  return siteItems;
}

export function getOrganizationItems(
  organizations: Organization[],
  sites: Site[]
): TabItem[] {
  const items: TabItem[] = organizations.map(({ id, providerName }) => ({
    id: `${id}`,
    tabText: providerName,
    tabTextFormatter: formatRosterTabText,
    nestedItemType: 'site',
    nestedTabs: getSiteItems(sites.filter((s) => s.organizationId === id)),
  }));
  items.splice(0, 0, {
    id: ALL.ORGS,
    tabText: 'All organizations',
    firstItem: true,
    nestedItemType: 'site',
    nestedTabs: getSiteItems(sites),
  });
  return items;
}

const NoAgeGroup = 'No age group';
type RosterSections = AgeGroup | typeof NoAgeGroup;
type ChildrenByAgeGroup = {
  [key in RosterSections]?: Child[];
};

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

export function getAccordionItems(
  childrenByAgeGroup: ChildrenByAgeGroup,
  opts: { hideCapacity: boolean; showOrgInTables: boolean } = {
    hideCapacity: false,
    showOrgInTables: false,
  }
) {
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
