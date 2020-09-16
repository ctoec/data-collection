import { write, WorkBook, utils } from 'xlsx';
import { ColumnMetadata } from '../../client/src/shared/models';
import { EntityMetadata, getConnection, getManager } from 'typeorm';
import {
  FlattenedEnrollment,
  Child,
  EnrollmentReport,
  Site,
  Enrollment,
} from '../entity';
import { getColumnMetadata } from '../entity/decorators/columnMetadata';
import { Response } from 'express';
import { isMoment, Moment } from 'moment';

const CHILD_RELATIONS = [
  'family',
  'family.incomeDeterminations',
  'enrollments',
  'enrollments.site',
  'enrollments.site.organization',
  'enrollments.fundings',
];

const propertyDateSorter = <T>(
  a: T,
  b: T,
  accessor: (_: T) => Moment | null | undefined
) => {
  const aDate = accessor(a);
  const bDate = accessor(b);

  if (!aDate) return 1;
  if (!bDate) return -1;
  if (aDate < bDate) return 1;
  if (bDate < aDate) return -1;
  return 0;
};

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

export async function getChildrenByReport(report: EnrollmentReport) {
  const childrenToMap = await getManager().transaction(async (tManager) => {
    let kids = [];
    for (let i = 0; i < report.enrollments.length; i++) {
      let enrollment = report.enrollments[i];
      var child = await tManager.findOne(
        Child,
        {
          name: enrollment.name,
          birthdate: enrollment.birthdate,
          birthCertificateId: enrollment.birthCertificateId,
        },
        {
          relations: CHILD_RELATIONS,
        }
      );

      // Sort enrollments by exit date
      if (child) {
        child = childSorter(child);
      }
      kids.push(child);
    }
    return kids;
  });
  return childrenToMap;
}

export async function getChildrenBySites(sites: Site[]) {
  const childrenToMap = await getManager().transaction(async (tManager) => {
    let kids: Child[] = [];
    sites.forEach(async (site) => {
      const enrollmentsAtSite = await tManager.find(Enrollment, { site: site });
      // Keep only one copy of each child
      const childrenHavingEnrollments = [
        ...new Set(enrollmentsAtSite.map((enrollment) => enrollment.child)),
      ];
      kids = kids.concat(childrenHavingEnrollments);
    });
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
  childrenToMap: Child[]
) {
  const csvToExport: WorkBook = generateCSV(childrenToMap);
  const csvStream = write(csvToExport, {
    bookType: 'csv',
    type: 'buffer',
  });
  response.contentType('application/octet-stream');
  response.send(csvStream);
}

/**
 * Retrieve ColumnMetadata information for all columns on the
 * FlattenedEnrollment model.
 */
export function getAllEnrollmentColumns(): ColumnMetadata[] {
  const metadata: EntityMetadata = getConnection().getMetadata(
    FlattenedEnrollment
  );
  return metadata.columns
    .map((column) =>
      getColumnMetadata(new FlattenedEnrollment(), column.propertyName)
    )
    .filter((templateMeta) => !!templateMeta);
}

function formatStringPush(value: any) {
  if (typeof value == 'boolean') {
    return value ? 'Yes' : 'No';
  }
  if (isMoment(value)) {
    return value.toDate().toLocaleDateString();
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
 * TODO: Several fields in the data template are not currently captured
 * by the data model or the child object. We eventually need to
 * reconcile these properties to live somewhere. They include:
 *  - dual language learner
 *  - model (of an enrollment/site)
 * @param child
 * @param cols
 */
function flattenChild(child: Child, cols: ColumnMetadata[]) {
  // Can just use 0th element of each array as the 'active'/'current'
  // value because controller.getChildById does presorting for us
  const determinations = child.family.incomeDeterminations || [];
  const currentDetermination =
    determinations.length > 0 ? determinations[0] : null;
  const workingEnrollment = (child.enrollments || []).find((e) => !e.exit);
  const activeEnrollment =
    workingEnrollment == undefined
      ? child.enrollments == undefined
        ? undefined
        : child.enrollments[0]
      : workingEnrollment;
  const fundings =
    activeEnrollment == undefined ? undefined : activeEnrollment.fundings || [];

  const activeFunding = fundings.length > 0 ? fundings[0] : undefined;

  // Note: There is still some nested depth checking because we store
  // records as nested data structures within a Child object
  // (e.g. to get to a determination: Child -> Family -> Det.)
  var childString: string[] = [];
  for (let i = 0; i < cols.length; i++) {
    const c = cols[i];
    if (child.hasOwnProperty(c.propertyName)) {
      childString.push(formatStringPush(child[c.propertyName]));
    } else if (child.family.hasOwnProperty(c.propertyName)) {
      childString.push(formatStringPush(child.family[c.propertyName]));
    } else if (
      !!currentDetermination &&
      currentDetermination.hasOwnProperty(c.propertyName)
    ) {
      childString.push(formatStringPush(currentDetermination[c.propertyName]));
    } else if (
      !!activeEnrollment &&
      activeEnrollment.hasOwnProperty(c.propertyName)
    ) {
      childString.push(formatStringPush(activeEnrollment[c.propertyName]));
    } else if (
      !!activeEnrollment.site &&
      activeEnrollment.site.hasOwnProperty(c.propertyName)
    ) {
      childString.push(formatStringPush(activeEnrollment.site[c.propertyName]));
    } else if (
      !!activeEnrollment.site.organization &&
      activeEnrollment.site.organization.hasOwnProperty(c.propertyName)
    ) {
      childString.push(
        formatStringPush(activeEnrollment.site.organization[c.propertyName])
      );
    } else if (
      !!activeFunding &&
      activeFunding.fundingSpace.hasOwnProperty(c.propertyName)
    ) {
      childString.push(
        formatStringPush(activeFunding.fundingSpace[c.propertyName])
      );
    } else if (c.propertyName.toLowerCase().includes('fundingperiod')) {
      if (c.propertyName.toLowerCase().startsWith('first')) {
        childString.push(
          formatStringPush(activeFunding.firstReportingPeriod.period)
        );
      } else {
        if (!!activeFunding.lastReportingPeriod) {
          childString.push(
            formatStringPush(activeFunding.lastReportingPeriod.period)
          );
        } else {
          childString.push(' ');
        }
      }
    } else {
      childString.push('Unrecognized property name: ' + c.propertyName);
    }
  }

  return childString;
}

/**
 * Process an array of retrieved child objects and turn them into
 * string representations to cascade into a CSV with column headers.
 * @param childArray
 */
export function generateCSV(childArray: Child[]) {
  const columnMetadatas: ColumnMetadata[] = getAllEnrollmentColumns();
  const formattedColumnNames: string[] = columnMetadatas.map(
    (c) => c.formattedName
  );
  const childStrings = childArray.map((c) => flattenChild(c, columnMetadatas));
  const sheet = utils.aoa_to_sheet([formattedColumnNames]);

  // Adding to the origin at the end appends the data instead of
  // replacing it
  utils.sheet_add_aoa(sheet, childStrings, { origin: -1 });
  const workbook = utils.book_new();
  utils.book_append_sheet(workbook, sheet);
  return workbook;
}
