import { EntityManager } from 'typeorm';
import {
  Enrollment,
  Funding,
  Organization,
  FundingSpace,
  ReportingPeriod,
} from '../../../entity';
import {
  FundingSource,
  FundingTime,
} from '../../../../client/src/shared/models';
import { EnrollmentReportRow } from '../../../template';
import { mapEnum, mapFundingTime } from '.';

/**
 * Create a Funding object from FlattenedEnrollment source,
 * associated with a FundingSpace for given organization and ageGroup
 * (already parsed from source, stored as enrollment.ageGroup)
 * @param transaction
 * @param source
 * @param organization
 * @param enrollment
 */
export const mapFunding = async (
  transaction: EntityManager,
  source: EnrollmentReportRow,
  organization: Organization,
  enrollment: Enrollment,
  save: boolean
) => {
  const fundingSource: FundingSource = mapEnum(
    FundingSource,
    source.fundingSpace,
    {
      isFundingSource: true,
    }
  );
  const fundingTime: FundingTime = mapFundingTime(source.time, fundingSource);

  let fundingSpace: FundingSpace;
  if (fundingSource && fundingTime) {
    // Get the FundingSpace with associated funding source and agegroup for the given organization
    // TODO: Cache FundingSpace, as they'll be reused a lot
    const fundingSpaces = await transaction.find(FundingSpace, {
      where: {
        source: fundingSource,
        ageGroup: enrollment.ageGroup,
        organization,
      },
    });
    fundingSpace = fundingSpaces.find((space) => space.time === fundingTime);

    // If no direct match on time and source === CDC, look for a split
    if (!fundingSpace && fundingSource === FundingSource.CDC) {
      fundingSpace = fundingSpaces.find(
        (space) => space.time === FundingTime.SplitTime
      );
    }
  }

  // TODO: Cache ReportingPeriods, as they'll be reused a lot
  let firstReportingPeriod: ReportingPeriod,
    lastReportingPeriod: ReportingPeriod;
  if (source.firstReportingPeriod) {
    firstReportingPeriod = await transaction.findOne(ReportingPeriod, {
      // TODO: this comparison doesn't work-- need fuzzier matching
      where: { type: fundingSource, period: source.firstReportingPeriod },
    });
  }
  if (source.lastReportingPeriod) {
    lastReportingPeriod = await transaction.findOne(ReportingPeriod, {
      where: { type: fundingSource, period: source.lastReportingPeriod },
    });
  }

  // If the user supplied _any_ funding-related fields, create the funding.
  if (
    source.fundingSpace ||
    source.time ||
    source.firstReportingPeriod ||
    source.lastReportingPeriod
  ) {
    let funding = {
      firstReportingPeriod,
      lastReportingPeriod,
      fundingSpace,
      enrollmentId: enrollment.id,
    } as Funding;

    funding = transaction.create(Funding, funding);
    if (save) {
      return transaction.save(funding);
    }
    return funding;
  }
};

/**
 * Finds a funding for the given enrollment that matches the
 * characteristics of an enrollment report row from an
 * uploaded sheet. Two fundings match if they are from the
 * same source, have the same time, and cover the same dates.
 * @param row
 * @param enrollment
 */
export const getExistingFundingForEnrollment = (
  row: EnrollmentReportRow,
  enrollment: Enrollment
) => {
  if (!enrollment || !enrollment.fundings) return undefined;
  return enrollment.fundings.find((f) => {
    return (
      row.firstReportingPeriod.format('MM/DD/YYYY') ===
      f.firstReportingPeriod.periodStart.format('MM/DD/YYYY') &&
      row.fundingSpace === f.fundingSpace.source &&
      row.time === f.fundingSpace.time
    );
  });
};
