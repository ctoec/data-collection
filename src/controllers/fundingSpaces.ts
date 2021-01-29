import { User, FundingSpace, Child } from '../entity';
import { getManager, In } from 'typeorm';
import { groupBy } from 'underscore';
import { getReadAccessibleOrgIds } from '../utils/getReadAccessibleOrgIds';
import { getCurrentFunding } from '../utils/getCurrentFunding';
import { NestedFundingSpaces } from '../../client/src/shared/payloads/NestedFundingSpaces';

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
  if (!organizationIds || !organizationIds.length)
    organizationIds = await getReadAccessibleOrgIds(user);

  return getManager().find(FundingSpace, {
    where: {
      organization: { id: In(organizationIds) },
    },
    relations: ['organization'],
  });
};

/**
 * Function that accumulates the distribution of how all children in
 * an organization are assigned to their various funding spaces
 * across age groups and enrollment times. Handles partitioning for
 * displaying so that the front end just has to spit this back out.
 * @param fundingSpaces
 * @param children
 */
export const getFundingSpaceMap = async (
  fundingSpaces: FundingSpace[],
  children: Child[]
): Promise<NestedFundingSpaces> => {
  const fundingSpacesDisplay = {} as NestedFundingSpaces;

  const fundingSpacesWithChildCount = fundingSpaces.map((fs) => {
    const filledSeats = children.filter((child) => {
      const currentFunding = getCurrentFunding({ child: child });
      return currentFunding?.fundingSpace?.id === fs.id;
    }).length;
    return { ...fs, filled: filledSeats };
  });

  const spacesBySource = groupBy(
    fundingSpacesWithChildCount,
    (fs: FundingSpace) => fs.source
  );

  for (const source in spacesBySource) {
    fundingSpacesDisplay[source] = groupBy(
      spacesBySource[source],
      (fs: FundingSpace) => fs.ageGroup
    );
  }

  return fundingSpacesDisplay;
};
