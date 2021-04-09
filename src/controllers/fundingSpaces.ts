import { User, FundingSpace } from '../entity';
import { getManager, In } from 'typeorm';
import { getReadAccessibleOrgIds } from '../utils/getReadAccessibleOrgIds';

/**
 * Get all funding spaces a given user has access to,
 * including those for organizations the user has
 * permissions for, and those for organizations that
 * own the sites the user has permissions for
 * @param user
 */
export const getFundingSpaces = async (
  user: User,
  organizationIds?: string[]
): Promise<FundingSpace[]> => {
  if (!organizationIds?.length)
    organizationIds = await getReadAccessibleOrgIds(user);

  return getManager().find(FundingSpace, {
    where: {
      organization: { id: In(organizationIds) },
    },
    relations: ['organization'],
  });
};
