import { User, FundingSpace, Site, Organization } from '../entity';
import { getManager, In } from 'typeorm';
import { getReadAccessibileOrgIds } from '../utils/getReadAccessibleOrgIds';

/**
 * Get all funding spaces a given user has access to,
 * including those for organizations the user has
 * permissions for, and those for organizations that
 * own the sites the user has permissions for
 * @param user
 */
export const getFundingSpaces = async (
  user: User,
  organizationId?: number
): Promise<FundingSpace[]> => {
  const readOrgIds: number[] = await getReadAccessibileOrgIds(user);

  if (!!organizationId && !readOrgIds.includes(organizationId)) {
    return null;
  }

  return getManager().find(FundingSpace, {
    where: {
      organization: { id: organizationId },
    },
    relations: ['organization'],
  });
};
