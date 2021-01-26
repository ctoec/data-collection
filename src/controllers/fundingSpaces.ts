import { User, FundingSpace } from '../entity';
import { getManager, In } from 'typeorm';
import { getReadAccessibleOrgIds } from '../utils/getReadAccessibleOrgIds';
import { getCurrentFunding } from '../utils/getCurrentFunding';

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
 * Simple structs that hold minimum amount of information necessary
 * to partition the children across funding spaces in a nice formatted
 * display.
 */
type enrollmentTime = {
  timeType: string;
  filled: number;
  capacity: number;
};
type enrolledAgeGroup = {
  ageGroup: string;
  includedTimes: enrollmentTime[];
};
/**
 * Function that accumulates the distribution of how all children in
 * an organization are assigned to their various funding spaces
 * across age groups and enrollment times. Handles partitioning for
 * displaying so that the front end just has to spit this back out.
 * @param children
 */
export const getFundingSpaceMap = async () => {
  // Structure to hold accumulated display information about each funding space
  const fundingSpacesDisplay: {
    sourceName: string;
    includedAgeGroups: enrolledAgeGroup[];
  }[] = [];

  children.forEach((child) => {
    const { fundingSpace } = getCurrentFunding({ child }) || {};

    if (fundingSpace) {
      // Start with overall funding source, since it's the header
      const { source, ageGroup, time: timeType } = fundingSpace;
      let matchingSource = fundingSpacesDisplay.find(
        (fsd) => fsd.sourceName === source
      );
      if (matchingSource === undefined) {
        matchingSource = { sourceName: source, includedAgeGroups: [] };
        fundingSpacesDisplay.push(matchingSource);
      }

      // Then the age group, since a source is made up of a list of these
      let matchingGroup = matchingSource.includedAgeGroups.find(
        (ag) => ag.ageGroup === ageGroup
      );
      if (matchingGroup === undefined) {
        matchingGroup = { ageGroup, includedTimes: [] };
        matchingSource.includedAgeGroups.push(matchingGroup);
      }

      // Then go to the times within each age group, because that's the
      // last sub-list
      let matchingTime = matchingGroup.includedTimes.find(
        (t) => t.timeType === timeType
      );
      if (matchingTime === undefined) {
        matchingTime = {
          timeType,
          filled: 0,
          capacity: fundingSpace.capacity,
        };
        matchingGroup.includedTimes.push(matchingTime);
      }
      matchingTime.filled += 1;
    }
  });

  return fundingSpacesDisplay;
};
