import { BookType } from 'xlsx';
import { ColumnMetadata } from '../../client/src/shared/models';
import { getManager } from 'typeorm';
import { Child, Site, Enrollment } from '../entity';
import { getAllColumnMetadata } from '../template/getAllColumnMetadata';
import { Response } from 'express';
import { isMoment } from 'moment';
import { propertyDateSorter } from '../utils/propertyDateSorter';
import { streamTabularData } from '../utils/streamTabularData';

// Make sure to load all nested levels of the Child objects
// we fetch
const CHILD_RELATIONS = [
  'family',
  'family.incomeDeterminations',
  'enrollments',
  'enrollments.site',
  'enrollments.site.organization',
  'enrollments.fundings',
];

/**
 * Performs sorting of nested enrollments and funding periods
 * within a Child object. This allows other functions to
 * know that nested values are already ordered, so that the
 * 0th element can be checked as the most recent.
 * @param child
 */
function childSorter(child: Child) {
  child.enrollments = child.enrollments.sort((enrollmentA, enrollmentB) => {
    if (enrollmentA.fundings) {
      // Sort fundings by last reporting period
      enrollmentA.fundings = enrollmentA.fundings.sort((fundingA, fundingB) =>
        propertyDateSorter(
          fundingA,
          fundingB,
          (f) => f.lastReportingPeriod?.period
        )
      );
    }
    return propertyDateSorter(enrollmentA, enrollmentB, (e) => e.exit);
  });
  return child;
}

/**
 * Second way of retrieving Children to export. Given an array
 * of sites a user has access to, finds all Children with enrollments
 * at that site, sorts their properties, and returns the collection
 * after filtering for unique child identifiers.
 * @param sites
 */
export async function getChildrenBySites(sites: Site[]) {
  const childrenToMap = await getManager().transaction(async (tManager) => {
    let kids: Child[] = [];
    for (let i = 0; i < sites.length; i++) {
      const enrollmentsAtSite = await tManager.find(Enrollment, {
        site: sites[i],
      });

      // Keep only one copy of each child, since there could be
      // overlap in the enrollments
      const childIds = [
        ...new Set(enrollmentsAtSite.map((enrollment) => enrollment.childId)),
      ];
      const childrenHavingEnrollments = await Promise.all(
        childIds.map(async (id) => {
          const child = await tManager.findOne(
            Child,
            { id: id },
            { relations: CHILD_RELATIONS }
          );
          return childSorter(child);
        })
      );
      kids = kids.concat(childrenHavingEnrollments);
    }
    return kids;
  });
  return childrenToMap;
}

/**
 * Function to send the created workbook of information back
 * to the router for handing to the client as a buffered
 * stream of information.
 * @param response
 * @param childrenToMap
 */
export async function streamUploadedChildren(
  response: Response,
  childrenToMap: Child[],
  format: BookType = 'csv'
) {
  const columnMetadatas: ColumnMetadata[] = getAllColumnMetadata();
  const childStrings = childrenToMap.map((c) =>
    flattenChild(c, columnMetadatas)
  );
  streamTabularData(response, format, childStrings);
}

/**
 * Helper function that transforms the various non-String data
 * of various Child fields into appropriate formats to display
 * in cells of the CSV to export.
 * @param value
 */
function formatStringPush(value: any) {
  if (typeof value == 'boolean') {
    return value ? 'Yes' : 'No';
  }
  if (isMoment(value)) {
    return value.format('MM/DD/YYYY');
  }
  if (typeof value == 'string') {
    return value || '';
  }
  if (typeof value == 'number') {
    return value.toString();
  }
}

/**
 * Workhorse function that turns a Child object into an array of string
 * descriptors of specific fields of its data. The strings are
 * arranged according to the column format specified by the data
 * templates on the site.
 *
 * @param child
 * @param columns
 */
function flattenChild(child: Child, columns: ColumnMetadata[]) {
  const { family, enrollments } = child;
  // Can just use 0th element of each array as the 'active'/'current'
  // value because controller.getChildById does presorting for us
  const currentDetermination = family?.incomeDeterminations?.[0];
  const activeEnrollment = enrollments?.find((e) => !e.exit) || enrollments?.[0];
  const activeFunding = activeEnrollment?.fundings?.[0];

  // We need to do this for each enrollment instead
  const childString: string[] = [];
  const objectsToCheck = [child, family, currentDetermination, activeEnrollment, activeEnrollment?.site, activeEnrollment?.site?.organization, activeFunding?.fundingSpace];
  columns.forEach(column => {
    const { propertyName } = column;
    objectsToCheck.some(o => {
      if (o && o.hasOwnProperty(propertyName)) {
        childString.push(formatStringPush(o[propertyName]))
        return true;
      } else if (propertyName.toLowerCase().includes('fundingperiod')) {
        if (!!activeFunding && propertyName.toLowerCase().startsWith('first')) {
          childString.push(
            formatStringPush(activeFunding.firstReportingPeriod.period)
          );
          return true;
        } else {
          if (!!activeFunding?.lastReportingPeriod) {
            childString.push(
              formatStringPush(activeFunding.lastReportingPeriod.period)
            );
            return true;
          }
        }
      }
      childString.push('')
      return true;
    })
  })

  return childString;
}
