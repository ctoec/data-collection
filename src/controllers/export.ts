import { BookType } from 'xlsx';
import { ColumnMetadata } from '../../client/src/shared/models';
import { Child, Enrollment } from '../entity';
import { Response } from 'express';
import { isMoment } from 'moment';
import { streamTabularData } from '../utils/streamTabularData';
import { getAllColumnMetadata } from '../template';
import { TEMPLATE_SECTIONS } from '../../client/src/shared/constants';
import { reportingPeriodToString } from './reportingPeriods';

/**
 * Function to send the created workbook of information back
 * to the router for handing to the client as a buffered
 * stream of information.
 * @param response
 * @param children
 */
export async function streamUploadedChildren(
  response: Response,
  children: Child[],
  format: BookType = 'csv'
) {
  const columnMetadatas: ColumnMetadata[] = getAllColumnMetadata();
  const childStrings = [];
  children.forEach((child) => {
    if (!child.enrollments) {
      childStrings.push(flattenChild(columnMetadatas, child));
    } else {
      child.enrollments?.forEach((enrollment, i) =>
        // Can just use 0th element of each array as the 'active'/'current'
        // value because controller.getChildById does presorting for us
        childStrings.push(
          flattenChild(columnMetadatas, child, {
            enrollment,
            skipInfoForPastEnrollments: i !== 0,
          })
        )
      );
    }
  });
  streamTabularData(response, format, childStrings);
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
function flattenChild(
  columns: ColumnMetadata[],
  child: Child,
  opts?: {
    enrollment?: Enrollment;
    skipInfoForPastEnrollments?: boolean;
  }
) {
  const { family } = child;
  const { enrollment, skipInfoForPastEnrollments } = opts || {};
  const { fundings, site } = enrollment || {};
  const activeFunding = fundings?.[0];
  const { fundingSpace } = activeFunding || {};
  const { organization } = site || {};
  // Can just use 0th element of each array as the 'active'/'current'
  // value because controller.getChildById does presorting for us

  const { incomeDeterminations } = family || {};
  const currentDetermination = incomeDeterminations?.[0];

  const childString: string[] = [];
  const objectsToCheck = [
    child,
    family,
    currentDetermination,
    enrollment,
    site,
    organization,
    fundingSpace,
    activeFunding,
  ];
  columns.forEach((column) => {
    const { propertyName, section } = column;
    if (
      skipInfoForPastEnrollments &&
      section !== TEMPLATE_SECTIONS.CHILD_IDENT &&
      section !== TEMPLATE_SECTIONS.ENROLLMENT_FUNDING
    ) {
      childString.push('');
      return;
    } else {
      const valueFound = objectsToCheck.some((o) => {
        if (o && o.hasOwnProperty(propertyName)) {
          childString.push(formatProperty(o[propertyName], propertyName));
          return true;
        }
        return false;
      });
      if (!valueFound) {
        childString.push('');
      }
    }
  });
  return childString;
}

/**
 * Helper function that transforms the various non-String data
 * of various Child fields into appropriate formats to display
 * in cells of the CSV to export.
 * @param value
 */
function formatProperty(value: any, propertyName: string) {
  // Check for absent values before invoking type check
  if (value === null || value === undefined) return '';
  // Check for specific property names
  if (propertyName === 'fundingSpace') {
    return value.source;
  }
  if (propertyName === 'site') {
    return value.siteName;
  }
  if (
    propertyName === 'firstReportingPeriod' ||
    propertyName === 'lastReportingPeriod'
  ) {
    return reportingPeriodToString(value);
  }
  if (typeof value === 'boolean') {
    return value ? 'Yes' : 'No';
  }
  if (typeof value === 'string') {
    return value || '';
  }
  if (typeof value === 'number') {
    return value.toString();
  }
  if (isMoment(value)) {
    return value.format('MM/DD/YYYY');
  }
}
