import { random } from 'faker';
import { FundingSpace, Organization } from '../../entity';
import { AgeGroup, FundingSource } from '../../../client/src/shared/models';
import { FUNDING_SOURCE_TIMES } from '../../../client/src/shared/constants';
import { FUNDING_SOURCES_WITH_ACRONYMS } from '../../template/constants';

export const getFakeFundingSpaces = (
  organization: Organization
): FundingSpace[] => {
  let fundingSpaces = [];
  Object.entries(FundingSource).forEach(([sourceKey, source]) => {
    FUNDING_SOURCE_TIMES.filter((fst) =>
      fst.fundingSources.includes(source)
    ).forEach((match) => {
      match.fundingTimes.forEach((fundingTime) => {
        const ageGroups = match.ageGroupLimitations || Object.values(AgeGroup);
        ageGroups.forEach((ageGroup) => {
          fundingSpaces.push({
            id: fundingSpaces.length + 1,
            capacity: source === FundingSource.SHS ? -1 : random.number(50),
            organization,
            // Funding sources in example upload files should include acronyms
            source: FUNDING_SOURCES_WITH_ACRONYMS[sourceKey],
            ageGroup,
            time: fundingTime.value,
            organizationId: organization.id,
          });
        });
      });
    });
  });
  return fundingSpaces;
};
