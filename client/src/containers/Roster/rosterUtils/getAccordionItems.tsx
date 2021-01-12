import React from 'react';
import pluralize from 'pluralize';
import { ErrorBoundary, InlineIcon, Table } from '@ctoec/component-library';
import { Child } from '../../../shared/models';
import { RosterSectionHeader } from '../RosterSectionHeader';
import { ColumnNames, tableColumns } from '../tableColumns';
import { AccordionItemProps } from '@ctoec/component-library/dist/components/Accordion/AccordionItem';
import { defaultErrorBoundaryProps } from '../../../utils/defaultErrorBoundaryProps';
import { getChildrenByAgeGroup } from './getChildrenByAgeGroup';
import { MAX_LENGTH_EXPANDED, NoAgeGroup } from './constants';

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
