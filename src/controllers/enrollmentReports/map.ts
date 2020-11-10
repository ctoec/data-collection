import { EntityManager } from 'typeorm';
import { Child, Site, Organization, User } from '../../entity';
import {
  createNewChild,
  getChildToUpdate,
  lookUpOrganization,
  lookUpSite,
  updateChild,
} from './mapUtils';
import { EnrollmentReportRow } from '../../template';
import { BadRequestError, ApiError } from '../../middleware/error/errors';

/**
 * Can use optional save parameter to decide whether to persist
 * the mapped results to the DB or not. If we don't persist,
 * mappnig is still performed to get the data in the right format.
 * Useful for analyzing validation errors before committing.
 */
export const mapRows = async (
  transaction: EntityManager,
  rows: EnrollmentReportRow[],
  user: User,
  opts: { save: boolean } = { save: false }
) => {
  const [organizations, sites] = await Promise.all([
    transaction.findByIds(Organization, user.organizationIds),
    transaction.findByIds(Site, user.siteIds),
  ]);

  // Need to track the unique children we've seen and parsed
  // so that we can update them if there are change rows
  const children: Child[] = [];
  for (const row of rows) {
    try {
      const childToUpdate = getChildToUpdate(row, children);
      const child = await mapRow(
        transaction,
        row,
        organizations,
        sites,
        opts.save,
        childToUpdate
      );
      if (!childToUpdate) {
        children.push(child);
      }
      console.log(childToUpdate, child, children)
    } catch (err) {
      if (err instanceof ApiError) throw err;
      console.error('Error occured while parsing row: ', err);
    }
  }
  return children;
};

/**
 * Creates Child, Family, IncomeDetermination, Enrollment, and Funding
 * from source FlattenedEnrollment.
 *
 * @param source
 */
const mapRow = async (
  transaction: EntityManager,
  source: EnrollmentReportRow,
  userOrganizations: Organization[],
  userSites: Site[],
  save: boolean,
  childToUpdate?: Child,
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
  let child = childToUpdate;
  const childAlreadyExists = child !== undefined;

  // Case where this row creates a brand new child
  if (!childAlreadyExists) {
    child = await createNewChild(
      transaction,
      source,
      organization,
      site,
      save
    );
    return child;
  }

  // If we're here, we're modifying an existing child's
  // enrollment or funding information
  return await updateChild(transaction, source, organization, site, child);
};
