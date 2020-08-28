import { User, FundingSpace, Site, Organization } from '../entity';
import { getManager, In } from 'typeorm';

/**
 * Get all funding spaces a given user has access to,
 * including those for organizations the user has
 * permissions for, and those for organizations that
 * own the sites the user has permissions for
 * @param user
 */
export const getFundingSpaces = async (user: User) => {
  // get org ids for the sites the user can access
  const siteOrgIds = (
    await getManager().find(Site, {
      where: { organization: In(user.siteIds || []) },
    })
  ).map((site) => site.organizationId);

  // create list of distinct organizations the user
  // can access funding spaces for
  const orgIds = Array.from(new Set([...siteOrgIds, ...user.organizationIds]));

  return getManager().find(FundingSpace, {
    where: { organization: { id: In(orgIds) } },
    relations: ['organization'],
  });
};
