import { getManager } from 'typeorm';
import { Funding, Organization, FundingSpace } from '../../../../entity';
import {
  AgeGroup,
  FundingSource,
  FundingTime,
} from '../../../../../client/src/shared/models';
import { EnrollmentReportRow } from '../../../../template';
import { mapEnum, addFundingTime } from '.';

/**
 * Create a Funding object from FlattenedEnrollment source,
 * associated with a FundingSpace for given organization and ageGroup
 * (already parsed from source, stored as enrollment.ageGroup)
 * @param source
 * @param organization
 * @param ageGroup
 * @param fundingSpaces
 */
export const addFunding = (
  source: EnrollmentReportRow,
  organization: Organization,
  ageGroup: AgeGroup,
  fundingSpaces: FundingSpace[]
) => {
  const fundingSource: FundingSource = mapEnum(
    FundingSource,
    source.fundingSpace,
    {
      isFundingSource: true,
    }
  );
  const fundingTime: FundingTime = addFundingTime(source.time, fundingSource);

  let fundingSpace: FundingSpace;
  if (fundingSource && fundingTime) {
    fundingSpace = fundingSpaces.find(
      (fs) =>
        fs.organizationId === organization.id &&
        fs.source === fundingSource &&
        fs.time === fundingTime &&
        fs.ageGroup === ageGroup
    );
  }

  return getManager().create(Funding, {
    ...source,
    fundingSpace,
  });
};
