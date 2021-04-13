import { getManager } from 'typeorm';
import {
  Enrollment,
  Funding,
  Organization,
  FundingSpace,
  ReportingPeriod,
} from '../../../../entity';
import {
  AgeGroup,
  FundingSource,
  FundingTime,
} from '../../../../../client/src/shared/models';
import { EnrollmentReportRow } from '../../../../template';
import { mapEnum, mapFundingTime } from '.';
import { Moment } from 'moment';

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
  ageGroup: AgeGroup,
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
        fs.ageGroup === ageGroup
    );
  }

  // TODO: Cache ReportingPeriods, as they'll be reused a lot
  let firstReportingPeriod: ReportingPeriod,
    lastReportingPeriod: ReportingPeriod;
  if (source.firstReportingPeriod) {
    firstReportingPeriod = getReportingPeriodFromRow(
      source.firstReportingPeriod,
      reportingPeriods,
      fundingSource
    );
  }
  if (source.lastReportingPeriod) {
    lastReportingPeriod = getReportingPeriodFromRow(
      source.lastReportingPeriod,
      reportingPeriods,
      fundingSource
    );
  }

  // If the user supplied _any_ funding-related fields, create
  // a populated funding.
  let funding: Funding;
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
    });
  } else {
    return getManager().create(Funding, {});
  }
};

/**
 * Util function that determines whether the funding object mapped
 * from a current EnrollmentReportRow contains new or different
 * information from a child's current funding.
 * @param fundingFromRow
 * @param funding
 */
export const rowHasNewFunding = (fundingFromRow: Funding, funding: Funding) => {
  if (!fundingFromRow) return false;
  if (!fundingFromRow.fundingSpace && !fundingFromRow.firstReportingPeriod)
    return false;
  return (
    (fundingFromRow.fundingSpace &&
      fundingFromRow.fundingSpace.source !== funding.fundingSpace.source) ||
    (fundingFromRow.fundingSpace &&
      fundingFromRow.fundingSpace?.time !== funding.fundingSpace.time) ||
    (fundingFromRow.firstReportingPeriod &&
      fundingFromRow.firstReportingPeriod.period.format('MM/DD/YYYY') !==
        funding.firstReportingPeriod.period.format('MM/DD/YYYY')) ||
    (fundingFromRow.lastReportingPeriod &&
      fundingFromRow.lastReportingPeriod.period.format('MM/DD/YYYY') !==
        funding.lastReportingPeriod.period.format('MM/DD.YYYY'))
  );
};

export const rowEndsCurrentFunding = (
  fundingFromRow: Funding,
  funding: Funding
) => {
  if (!fundingFromRow) return false;
  return (
    fundingFromRow.fundingSpace &&
    fundingFromRow.fundingSpace.source === funding.fundingSpace.source &&
    fundingFromRow.fundingSpace &&
    fundingFromRow.fundingSpace?.time === funding.fundingSpace.time &&
    fundingFromRow.firstReportingPeriod &&
    fundingFromRow.firstReportingPeriod.period.format('MM/DD/YYYY') ===
      funding.firstReportingPeriod.period.format('MM/DD/YYYY') &&
    fundingFromRow.lastReportingPeriod &&
    fundingFromRow.lastReportingPeriod.period.isSameOrAfter(
      funding.firstReportingPeriod.period
    )
  );
};

/**
 * Simple util to determine whether the periodStart and periodEnd properties
 * of a given reporting period are date-inclusive of a given moment.
 */
export const reportingPeriodIncludesDate = (
  rp: ReportingPeriod,
  date: Moment
) => {
  return (
    rp.periodStart.isSameOrBefore(date) && rp.periodEnd.isSameOrAfter(date)
  );
};

/**
 * Handles parsing of a source row to figure out its reporting periods.
 * The function first assumes the date is meaningful and finds an RP
 * that includes the given date. If the period month of the result
 * doesn't match the month of the given date, the function corrects
 * for this by assuming the user entered MMM/YYYY format and finding
 * the right reporting period.
 */
const getReportingPeriodFromRow = (
  sourceRP: Moment,
  reportingPeriods: ReportingPeriod[],
  fundingSource: FundingSource
) => {
  // Base case: assume the day part of the date is valuable info
  // and find a reporting period that includes the full date
  let reportingPeriod = reportingPeriods.find(
    (rp) =>
      rp.type === fundingSource && reportingPeriodIncludesDate(rp, sourceRP)
  );

  // Case for correcting moment auto-parsing: if the user entered MMM/YYYY,
  // moment auto-parsed it with '01' for the day--but, the reporting
  // periods for some months don't include the first of the month,
  // (i.e. "March 2020" goes from 3/2 to 3/29) so modify if needed
  if (
    reportingPeriod?.period.format('MM/YYYY') !== sourceRP.format('MM/YYYY') &&
    sourceRP.date() === 1
  ) {
    reportingPeriod = reportingPeriods.find(
      (rp) =>
        rp.type === fundingSource &&
        rp.period.format('MM/YYYY') === sourceRP.format('MM/YYYY')
    );
  }

  return reportingPeriod;
};
