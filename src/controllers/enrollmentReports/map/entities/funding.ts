import { getManager } from 'typeorm';
import {
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

export const reportingPeriodIncludesDate = (
  rp: ReportingPeriod,
  date: Moment
) => rp.periodStart.isSameOrBefore(date) && rp.periodEnd.isSameOrAfter(date);

/**
 * Create a Funding object from FlattenedEnrollment source,
 * associated with a FundingSpace for given organization and ageGroup
 * (already parsed from source, stored as enrollment.ageGroup)
 * @param source
 * @param organization
 * @param ageGroup
 * @param fundingSpaces
 * @param reportingPeriods
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

  return getManager().create(Funding, {
    firstReportingPeriod,
    lastReportingPeriod,
    fundingSpace,
  });
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
