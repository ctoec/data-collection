import { EntityManager, In } from 'typeorm';
import {
  Child,
  Site,
  Organization,
  User,
  Enrollment,
  Funding,
  FundingSpace,
  ReportingPeriod,
  Family,
  IncomeDetermination,
} from '../../../entity';
import {
  lookUpOrganization,
  lookUpSite,
  isIdentifierMatch,
  mapFamily,
  mapIncomeDetermination,
  mapChild,
  mapEnrollment,
  mapFunding,
  updateBirthCertificateInfo,
  updateFamilyAddress,
  handleIncomeDeterminationUpdate,
  handleEnrollmentUpdate,
  handleFundingUpdate,
} from './mapUtils';
import { EnrollmentReportRow } from '../../../template';
import { BadRequestError, ApiError } from '../../../middleware/error/errors';
import { getReadAccessibleOrgIds } from '../../../utils/getReadAccessibleOrgIds';
import { ChangeTag } from '../../../../client/src/shared/models';
import { EnrollmentReportUpdate } from './uploadTypes';
import {
  batchCreateNewChildren,
  batchSaveUpdatedEntities,
} from './mapUtils/batchSave';

// We'll store entities we need to update here so that we can
// appropriately batch save them after all processing
let childrenToUpdate: Child[];
let familiesToUpdate: Family[];
let determinationsToUpdate: IncomeDetermination[];
let enrollmentsToUpdate: Enrollment[];
let fundingsToUpdate: Funding[];

/**
 * Can use optional save parameter to decide whether to persist
 * the mapped results to the DB or not. If we don't persist,
 * mappnig is still performed to get the data in the right format.
 * Useful for analyzing validation errors before committing.
 */
export async function mapRows(
  transaction: EntityManager,
  rows: EnrollmentReportRow[],
  user: User,
  opts: { save: boolean } = { save: false }
): Promise<EnrollmentReportUpdate> {
  const readAccessibleOrgIds = await getReadAccessibleOrgIds(user);
  const [
    organizations,
    sites,
    fundingSpaces,
    reportingPeriods,
  ] = await Promise.all([
    transaction.findByIds(Organization, readAccessibleOrgIds),
    transaction.findByIds(Site, user.siteIds),
    transaction.find(FundingSpace, {
      where: { organizationId: In(readAccessibleOrgIds) },
    }),
    transaction.find(ReportingPeriod),
  ]);

  const mapResult: EnrollmentReportUpdate = {
    changeTagsForChildren: [],
    children: [],
  };

  // Initialize the accumulator arrays
  const children: Child[] = [];
  childrenToUpdate = [];
  familiesToUpdate = [];
  determinationsToUpdate = [];
  enrollmentsToUpdate = [];
  fundingsToUpdate = [];

  for (const row of rows) {
    try {
      const match = await doesChildMatchExist(row, transaction);
      if (match)
        await updateRecord(
          organizations,
          sites,
          match,
          row,
          fundingSpaces,
          reportingPeriods,
          mapResult
        );
      else {
        await mapRow(
          row,
          organizations,
          sites,
          fundingSpaces,
          reportingPeriods,
          children
        );
      }
    } catch (err) {
      if (err instanceof ApiError) throw err;
      console.error('Error occured while parsing row: ', err);
    }
  }

  // If not save, then just clean up circular references and return
  if (!opts.save) {
    children.forEach((child) => {
      child.enrollments?.forEach((e) => {
        e.child = undefined;
        e.fundings?.forEach((f) => (f.enrollment = undefined));
      });
      child.family?.incomeDeterminations?.forEach(
        (det) => (det.family = undefined)
      );
    });
    if (mapResult.children.length > 0) mapResult.children.push(...children);
    else mapResult.children = children;
    return mapResult;
  }

  // Otherwise, update the entities that already exist, and create
  // new records that don't yet
  await batchSaveUpdatedEntities(
    user,
    transaction,
    familiesToUpdate,
    determinationsToUpdate,
    childrenToUpdate,
    enrollmentsToUpdate,
    fundingsToUpdate,
    mapResult
  );
  await batchCreateNewChildren(user, transaction, children, mapResult);
  return mapResult;
}

/**
 * Determines whether the child represented in the given
 * spreadsheet row is already contained in the database.
 * Returns the child if it is, otherwise returns undefined.
 * @param row
 * @param transaction
 */
const doesChildMatchExist = async (
  row: EnrollmentReportRow,
  transaction: EntityManager
) => {
  const findOpts = {
    firstName: row.firstName,
    lastName: row.lastName,
  };
  const potentialMatches = await transaction.find(Child, {
    where: findOpts,
    relations: [
      'family',
      'family.incomeDeterminations',
      'enrollments',
      'enrollments.fundings',
      'enrollments.site',
    ],
  });
  const match = potentialMatches.find(
    (c) =>
      c.birthdate.format('MM/DD/YYYY') === row.birthdate.format('MM/DD/YYYY') &&
      ((c.sasid && c.sasid === row.sasidUniqueId) ||
        (c.uniqueId && c.uniqueId === row.sasidUniqueId) ||
        (!c.sasid && !row.sasidUniqueId))
  );
  return match;
};

/**
 * Function that updates entities associated with a child record
 * that already exists in the DB.
 */
const updateRecord = async (
  userOrganizations: Organization[],
  userSites: Site[],
  child: Child,
  source: EnrollmentReportRow,
  userFundingSpaces: FundingSpace[],
  userReportingPeriods: ReportingPeriod[],
  mapResult: EnrollmentReportUpdate
) => {
  const organization = lookUpOrganization(source, userOrganizations);
  if (!organization) {
    const orgNames = userOrganizations.map((org) => `"${org.providerName}"`);
    const orgNamesForError = `${orgNames
      .slice(0, -1)
      .join(', ')}, or ${orgNames.slice(-1)}`;
    throw new BadRequestError(
      `You entered invalid provider names\nCheck that your spreadsheet provider column only contains ${orgNamesForError} before uploading again.`
    );
  }
  const site = lookUpSite(source, organization.id, userSites);

  let matchingIdx = mapResult.children.findIndex((c) => c.id === child.id);
  if (matchingIdx === -1) {
    matchingIdx = mapResult.children.length;
    mapResult.children.push(child);
    mapResult.changeTagsForChildren.push([]);
  }

  // Support birth cert updates and family address updates
  const changedBirthCert = updateBirthCertificateInfo(
    child,
    source,
    childrenToUpdate
  );
  const changedAddress = updateFamilyAddress(
    child.family,
    source,
    familiesToUpdate
  );
  if (changedBirthCert || changedAddress) {
    mapResult.changeTagsForChildren[matchingIdx].push(ChangeTag.Edited);
  }

  // Everything else involves making new entities
  handleIncomeDeterminationUpdate(
    child,
    source,
    matchingIdx,
    determinationsToUpdate,
    mapResult
  );
  const {
    enrollment,
    currentEnrollment,
    isNewEnrollment,
  } = handleEnrollmentUpdate(
    source,
    site,
    child,
    enrollmentsToUpdate,
    mapResult,
    matchingIdx
  );
  handleFundingUpdate(
    currentEnrollment,
    enrollment,
    isNewEnrollment,
    source,
    organization,
    userFundingSpaces,
    userReportingPeriods,
    fundingsToUpdate,
    mapResult,
    matchingIdx
  );
};

/**
 * Creates Child, Family, IncomeDetermination, Enrollment, and Funding
 * from source FlattenedEnrollment.
 *
 * @param source
 */
const mapRow = async (
  source: EnrollmentReportRow,
  userOrganizations: Organization[],
  userSites: Site[],
  userFundingSpaces: FundingSpace[],
  userReportingPeriods: ReportingPeriod[],
  children: Child[]
) => {
  const organization = lookUpOrganization(source, userOrganizations);
  if (!organization) {
    const orgNames = userOrganizations.map((org) => `"${org.providerName}"`);
    const orgNamesForError = `${orgNames
      .slice(0, -1)
      .join(', ')}, or ${orgNames.slice(-1)}`;
    throw new BadRequestError(
      `You entered invalid provider names\nCheck that your spreadsheet provider column only contains ${orgNamesForError} before uploading again.`
    );
  }

  const site = lookUpSite(source, organization.id, userSites);

  // See if we've already processed a row for this child
  let child = children.find((c) => isIdentifierMatch(c, source));

  // Create family, income det, and child if first encounter
  if (!child) {
    const family = mapFamily(source, organization);
    const incomeDetermination = mapIncomeDetermination(source, family);
    family.incomeDeterminations = [incomeDetermination];

    child = mapChild(source, organization, family);
    child.family = family;
    children.push(child);
  }

  // Users can update enrollments by changing their funding, so there could
  // be multiple rows with the same enrollment
  let enrollment = child?.enrollments?.find(
    (e) =>
      e.site.siteName === source.site &&
      e.entry?.format('MM/DD/YYYY') === source.entry?.format('MM/DD/YYYY')
  );

  // Create enrollment if it does not already exist
  if (!enrollment) {
    enrollment = mapEnrollment(source, site, child);

    // And add to child
    if (child.enrollments) {
      child.enrollments.push(enrollment);
    } else {
      child.enrollments = [enrollment];
    }
  }

  // Create funding
  const funding = mapFunding(
    source,
    organization,
    enrollment,
    userFundingSpaces,
    userReportingPeriods
  );
  // And add to enrollment
  if (funding) {
    if (enrollment.fundings) {
      enrollment.fundings.push(funding);
    } else {
      enrollment.fundings = [funding];
    }
  }

  return child;
};
