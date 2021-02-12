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
import { UpdateMetaData } from '../../../entity/embeddedColumns/UpdateMetaData';
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
} from './mapUtils';
import { EnrollmentReportRow } from '../../../template';
import { BadRequestError, ApiError } from '../../../middleware/error/errors';
import { getReadAccessibleOrgIds } from '../../../utils/getReadAccessibleOrgIds';
import { CareModel } from '../../../../client/src/shared/models';

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
): Promise<Child[]> {
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

  const children: Child[] = [];
  const childrenToUpdate: Child[] = [];
  const familiesToUpdate: Family[] = [];
  const determinationsToUpdate: IncomeDetermination[] = [];
  const enrollmentsToUpdate: Enrollment[] = [];
  const fundingsToUpdate: Funding[] = [];
  for (const row of rows) {
    try {
      // Check if this row is for a child already in the system
      const findOpts = {
        firstName: row.firstName,
        lastName: row.lastName,
      };
      const potentialMatches = await transaction.find(Child, {
        where: findOpts,
        relations: ['family'],
      });
      const match = potentialMatches.find(
        (c) =>
          c.birthdate.format('MM/DD/YYYY') ===
            row.birthdate.format('MM/DD/YYYY') &&
          ((c.sasid && c.sasid === row.sasidUniqueId) ||
            (c.uniqueId && c.uniqueId === row.sasidUniqueId) ||
            (!c.sasid && !row.sasidUniqueId))
      );

      // Go directly to updating the child, do not pass go or
      // create a new child object
      if (match)
        await updateRecord(
          organizations,
          sites,
          match,
          row,
          childrenToUpdate,
          familiesToUpdate,
          determinationsToUpdate,
          enrollmentsToUpdate,
          fundingsToUpdate
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
    return children;
  }

  // Otherwise, create entities in DB
  // Batch update all the entities we modified fields for
  // console.log("Families to update: ", familiesToUpdate);
  // console.log("Children to update: ", childrenToUpdate);
  const updatedFamilies = await doBatchedInsert<Family>(
    transaction,
    familiesToUpdate.map((family) => {
      family.updateMetaData = { author: user } as UpdateMetaData;
      return family;
    })
  );
  const updatedChildren = await doBatchedInsert<Child>(
    transaction,
    childrenToUpdate
  );

  // Create families
  const createdFamilies = await doBatchedInsert<Family>(
    transaction,
    children.map((child) => {
      child.family.updateMetaData = { author: user } as UpdateMetaData;
      return child.family;
    })
  );

  // Create dets with updated family references
  await doBatchedInsert<IncomeDetermination>(
    transaction,
    children.map((child, idx) => {
      const det = child.family.incomeDeterminations[0];
      det.family = undefined;
      det.familyId = createdFamilies[idx].id;
      det.updateMetaData = { author: user } as UpdateMetaData;
      return det;
    })
  );

  // Create children with updated family references
  const createdChildren = await doBatchedInsert<Child>(
    transaction,
    children.map((child, idx) => {
      child.family = createdFamilies[idx];
      child.updateMetaData = { author: user } as UpdateMetaData;
      return child;
    })
  );

  // Create enrollments and fundings with updated child references
  // Cascade create does not work for entities with auto-incrementing pks,
  // so we have to create all enrollments, then create all fundings for the enrollments
  const fundings: Funding[][] = [];
  const enrollments = children.reduce((flatEnrollments, child, childIdx) => {
    child.enrollments.forEach((enrollment) => {
      // Add child id and remove child reference
      enrollment.child = undefined;
      enrollment.childId = createdChildren[childIdx].id;

      // Grab fundings to save later, and remove reference
      fundings.push(enrollment.fundings);
      enrollment.fundings = undefined;

      // Add processed enrollment to array
      enrollment.updateMetaData = { author: user } as UpdateMetaData;
      flatEnrollments.push(enrollment);
    });
    return flatEnrollments;
  }, []) as Enrollment[];

  const createdEnrollments = await doBatchedInsert(transaction, enrollments);

  const createdFundings = await doBatchedInsert(
    transaction,
    fundings.reduce((flatFundings, fundings, enrollmentIdx) => {
      fundings?.forEach((funding) => {
        funding.enrollment = undefined;
        funding.enrollmentId = createdEnrollments[enrollmentIdx].id;

        funding.updateMetaData = { author: user } as UpdateMetaData;
        flatFundings.push(funding);
      });
      return flatFundings;
    }, [])
  );

  // Compose entities from created in DB and return
  createdChildren.forEach((child, idx) => {
    child.family = createdFamilies[idx];
    child.enrollments = createdEnrollments.filter((enrollment) => {
      const match = enrollment.childId === child.id;
      if (match) {
        enrollment.fundings = createdFundings.filter(
          (funding) => funding.enrollmentId === enrollment.id
        );
      }
      return match;
    });
  });
  return createdChildren;
}

const updateRecord = async (
  userOrganizations: Organization[],
  userSites: Site[],
  child: Child,
  source: EnrollmentReportRow,
  childrenToUpdate: Child[],
  familiesToUpdate: Family[],
  determinationsToUpdate: IncomeDetermination[],
  enrollmentsToUpdate: Enrollment[],
  fundingsToUpdate: Funding[]
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

  // Support birth cert updates and family address updates
  updateBirthCertificateInfo(child, source, childrenToUpdate);
  updateFamilyAddress(child.family, source, familiesToUpdate);

  // Everything else involves making new entities
  if (
    source.income ||
    source.numberOfPeople ||
    source.determinationDate ||
    source.incomeNotDisclosed
  ) {
    const determination = mapIncomeDetermination(source, child.family);
    determinationsToUpdate.push(determination);
    child.family.incomeDeterminations.push(determination);
    // Mark the family as updated if we haven't already
    if (!familiesToUpdate.find((f) => f.id === child.family.id))
      familiesToUpdate.push(child.family);
  }
  const enrollment = mapEnrollment(source, site, child);
  if (
    enrollment.site ||
    enrollment.model !== CareModel.Unknown ||
    enrollment.ageGroup ||
    enrollment.entry
  ) {
    enrollmentsToUpdate.push(enrollment);
    child.enrollments.push(enrollment);
  }
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

/**
 * SQL Server driver has an upper limit of 2100 parameters per query.
 * Using object keys in the entity has proxy for number of parameters
 * that'll end up in the query (couldn't find any better way to do this
 * from typeORM), chunk the inserts into batches that will have <2000
 * parameters per batch.
 * @param transaction
 * @param entities
 */
async function doBatchedInsert<T>(transaction: EntityManager, entities: T[]) {
  if (entities.length === 0) return [];

  const parametersPerEntity = Object.keys(entities[0]).length;
  const batchSize = Math.floor(2000 / parametersPerEntity);
  const createdData: any[] = [];
  for (let b = 0; b < entities.length; b += batchSize) {
    const batch = entities.slice(b, b + batchSize);
    const batchEntities = await transaction.save<T>(batch);
    createdData.push(...batchEntities);
  }

  return createdData;
}
