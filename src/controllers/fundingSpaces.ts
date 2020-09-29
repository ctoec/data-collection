import { User, FundingSpace, Site, Provider } from '../entity';
import { getManager, In } from 'typeorm';
import { getReadAccessibileOrgIds } from '../utils/getReadAccessibleOrgIds';

/**
 * Get all funding spaces a given user has access to,
 * including those for organizations the user has
 * permissions for, and those for organizations that
 * own the sites the user has permissions for
 * @param user
 */
export const getFundingSpaces = async (user: User) => {
  const readOrgIds = await getReadAccessibileOrgIds(user);

  return getManager().find(FundingSpace, {
    where: { provider: { id: In(readOrgIds) } },
    relations: ['organization'],
  });
};
