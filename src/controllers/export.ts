import { write, WorkBook, utils } from 'xlsx';
import { ColumnMetadata } from '../../client/src/shared/models';
import { getManager, In } from 'typeorm';
import {
  Child,
  EnrollmentReport,
  Site,
  Enrollment,
  User,
  Organization,
} from '../entity';
import { getAllEnrollmentColumns } from '../controllers/columnMetadata';
import { Response } from 'express';
import { isMoment } from 'moment';
import { propertyDateSorter } from '../utils/propertyDateSorter';

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
 * One of two ways to export a CSV of Children objects. Uses a
 * transaction manager to find all Children who were uploaded
 * in a particular enrollment report, sorts their properties,
 * and returns the result.
 * @param report
 */
export async function getChildrenByReport(report: EnrollmentReport) {
  const childrenToMap = await getManager().transaction(async (tManager) => {
    let kids = [];
    for (let i = 0; i < report.enrollments.length; i++) {
      let enrollment = report.enrollments[i];
      var child = await tManager.findOne(
        Child,
        {
          firstName: enrollment.firstName,
          lastName: enrollment.lastName,
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
 * Determines all relevant sites a user with the provided User ID
 * has access to. Everything is handled in one transaction to minimize
 * calls to the DB.
 * @param userId
 */
export async function getUserWithSites(userId: number) {
  const user = await getManager().transaction(async (tManager) => {
    const user = await tManager.findOne(
      User,
      { id: userId },
      {
        relations: [
          'orgPermissions',
          'sitePermissions',
          'communityPermissions',
        ],
      }
    );

    // Get all orgs associated with communities user has permissions for
    const orgsFromCommunities = (user.communityPermissions || []).length
      ? await tManager.find(Organization, {
          where: {
            communityId: In(
              user.communityPermissions.map((perm) => perm.communityId)
            ),
          },
        })
      : [];

    // Create list of distinct organization ids the user can access
    const allOrgIds = Array.from(
      new Set([
        ...(user.orgPermissions || []).map((perm) => perm.organizationId),
        ...orgsFromCommunities.map((org) => org.id),
      ])
    );

    // Get all sites associated with all organizations user has permissions for
    const sitesFromAllOrgs = await tManager.find(Site, {
      where: { organizationId: In(allOrgIds) },
    });

    // Create list of distinct site ids the user can access
    const allSiteIds = Array.from(
      new Set([
        ...(user.sitePermissions || []).map((perm) => perm.siteId),
        ...sitesFromAllOrgs.map((site) => site.id),
      ])
    );

    // Add values to the user object
    user.organizationIds = allOrgIds;
    user.siteIds = allSiteIds;
    return user;
  });
  return user;
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
