import React from 'react';
import pluralize from 'pluralize';
import {
  AccordionItemProps,
  ErrorBoundary,
  InlineIcon,
  Table,
} from '@ctoec/component-library';
import { defaultErrorBoundaryProps } from '../../utils/defaultErrorBoundaryProps';
import { AgeGroup } from '../../shared/models';
import { getPreviewTableColumns } from './previewTableColumns';
import { UploadPreviewRow } from './UploadPreviewRow';

export const MAX_LENGTH_EXPANDED = 50;
export const QUERY_STRING_MONTH_FORMAT = 'MMMM-YYYY';

/**
 * Helper types for organizing children into sections by ageGroup
 */
export const NoAgeGroup = 'Incomplete enrollments';
export type RosterSections = AgeGroup | typeof NoAgeGroup;
export type RowsByAgeGroup = {
  [key in RosterSections]?: UploadPreviewRow[];
};

/**
 * Returns array of AccordionItemProps, used to render the preview
 * age group accordion sections.
 * @param children
 * @param opts
 */
export function getPreviewTableAccordionItems(
  children: UploadPreviewRow[]
): AccordionItemProps[] {
  const childrenByAgeGroup = getChildrenByAgeGroup(children);

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
      expandText: (
        <>
          Show<span className="usa-sr-only">{` ${ageGroup} roster`}</span>
        </>
      ),
      collapseText: (
        <>
          Hide<span className="usa-sr-only">{` ${ageGroup} roster`}</span>
        </>
      ),
      content: (
        <>
          <ErrorBoundary alertProps={{ ...defaultErrorBoundaryProps }}>
            <Table<UploadPreviewRow>
              className="margin-bottom-4"
              id={`preview-table-${ageGroup}`}
              rowKey={(row) => row?.name}
              data={ageGroupChildren}
              columns={getPreviewTableColumns()}
              defaultSortColumn={0}
              defaultSortOrder="ascending"
            />
          </ErrorBoundary>
        </>
      ),
      isExpanded: ageGroupChildren.length <= MAX_LENGTH_EXPANDED,
    }));
}

function getChildrenByAgeGroup(
  filteredChildren: UploadPreviewRow[]
): RowsByAgeGroup {
  const childrenByAgeGroup: RowsByAgeGroup = {};
  // Filter all children into an object, keyed by age group
  // with array of children for that agegroup as value
  filteredChildren.reduce((_byAgeGroup, _child) => {
    const ageGroup = _child.ageGroup;
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
  const sortedByAgeGroup: RowsByAgeGroup = {};
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
