import { FundingSpace, Organization } from '../entity';
import { AgeGroup, FundingSource } from '../../client/src/shared/models';
import { FUNDING_SOURCE_TIMES } from '../../client/src/shared/constants';

export const getFakeFundingSpaces = (
  organization: Organization
): FundingSpace[] => {
  let fundingSpaces = [];
  Object.values(AgeGroup).map((ageGroup) => {
    for (const source of Object.values(FundingSource)) {
      const match = FUNDING_SOURCE_TIMES.find((fst) =>
        fst.fundingSources.includes(source)
      );
      if (match) {
        fundingSpaces = fundingSpaces.concat(
          match.fundingTimes.map((fundingTime) => ({
            ageGroup,
            capacity: 10,
            source,
            time: fundingTime.value,
            organization,
          }))
        );
      }
    }
  });
  return fundingSpaces;
};
