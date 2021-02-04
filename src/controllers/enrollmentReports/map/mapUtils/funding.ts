import { getManager } from 'typeorm';
import {
  Enrollment,
  Funding,
  Organization,
  FundingSpace,
  ReportingPeriod,
} from '../../../../entity';
import {
  FundingSource,
  FundingTime,
} from '../../../../../client/src/shared/models';
import { EnrollmentReportRow } from '../../../../template';
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
export const mapFunding = (
  source: EnrollmentReportRow,
  organization: Organization,
  enrollment: Enrollment,
  fundingSpaces: FundingSpace[],
  reportingPeriods: ReportingPeriod[]
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
    fundingSpace = fundingSpaces.find(
      (fs) =>
        fs.organizationId === organization.id &&
        fs.source === fundingSource &&
        fs.time === fundingTime &&
        fs.ageGroup === enrollment.ageGroup
    );
  }

  // TODO: Cache ReportingPeriods, as they'll be reused a lot
  let firstReportingPeriod: ReportingPeriod,
    lastReportingPeriod: ReportingPeriod;
  if (source.firstReportingPeriod) {
    firstReportingPeriod = reportingPeriods.find(
      (rp) =>
        rp.type === fundingSource &&
        rp.period.format('MM-YYYY') ===
          source.firstReportingPeriod.format('MM-YYYY')
    );
  }
  if (source.lastReportingPeriod) {
    lastReportingPeriod = reportingPeriods.find(
      (rp) =>
        rp.type === fundingSource &&
        rp.period.format('MM-YYYY') ===
          source.lastReportingPeriod.format('MM-YYYY')
    );
  }

  // If the user supplied _any_ funding-related fields, create
  // a propagated funding.
  if (
    source.fundingSpace ||
    source.time ||
    source.firstReportingPeriod ||
    source.lastReportingPeriod
  ) {
    return getManager().create(Funding, {
      firstReportingPeriod,
      lastReportingPeriod,
      fundingSpace,
      enrollment,
    });
  } else {
    return getManager().create(Funding, {
      enrollment,
    });
  }
};
