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
import { getReadAccessibleOrgIds } from '../../utils/getReadAccessibleOrgIds';

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
  const readAccessibleOrgIds = await getReadAccessibleOrgIds(user);
  const [organizations, sites] = await Promise.all([
    transaction.findByIds(Organization, readAccessibleOrgIds),
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
        user,
        opts.save,
        childToUpdate
      );
      if (!childToUpdate) {
        children.push(child);
      }
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
  user: User,
  save: boolean,
  childToUpdate?: Child
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

  // Case where this row creates a brand new child
  if (!childToUpdate) {
    return await createNewChild(
      transaction,
      source,
      organization,
      site,
      user,
      save
    );
  }

  // If we're here, we're modifying an existing child's
  // enrollment or funding information
  return await updateChild(
    transaction,
    source,
    organization,
    site,
    childToUpdate,
    user
  );
};
