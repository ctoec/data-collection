import { getManager } from 'typeorm';
import {
  Enrollment,
  Funding,
  Organization,
  FundingSpace,
  ReportingPeriod,
} from '../../../../entity';
import {
  ChangeTag,
  FundingSource,
  FundingTime,
} from '../../../../../client/src/shared/models';
import { EnrollmentReportRow } from '../../../../template';
import { mapEnum, mapFundingTime } from '.';
import { MapResult } from '../uploadTypes';

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

  // If the user supplied _any_ funding-related fields, create the funding.
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
 * Create a new funding, if one is present in the given spreadsheet
 * row. This funding can be associated with either a current enrollment
 * (if the row had no new enrollment info) or can be paired with a
 * new enrollment mapped from the given row.
 */
export const handleFundingUpdate = (
  currentEnrollment: Enrollment,
  enrollment: Enrollment | undefined,
  isNewEnrollment: boolean,
  source: EnrollmentReportRow,
  organization: Organization,
  userFundingSpaces: FundingSpace[],
  userReportingPeriods: ReportingPeriod[],
  fundingsToUpdate: Funding[],
  mapResult: MapResult,
  matchingIdx: number
) => {
  const currentFunding: Funding | undefined = currentEnrollment?.fundings.find(
    (f) => !f.lastReportingPeriod
  );
  if (enrollment) {
    const funding = mapFunding(
      source,
      organization,
      enrollment,
      userFundingSpaces,
      userReportingPeriods
    );
    if (rowHasNewFunding(funding, currentFunding)) {
      enrollment.fundings.push(funding);
      fundingsToUpdate.push(funding);

      // Only tag row as having new funding if we didn't switch
      // enrollments, since having an enrollment kind of assumes
      // it's funded
      if (!isNewEnrollment) {
        mapResult.changeTagsForChildren[matchingIdx].push(
          ChangeTag.ChangedFunding
        );
      }
      // Same as before, we'll assume the old funding ended right
      // before the new one started
      const newFundingPeriodIdx = userReportingPeriods.findIndex(
        (rp) => rp.id === funding.firstReportingPeriod.id
      );
      const oldFundingPeriodIdx = userReportingPeriods.findIndex(
        (rp) => rp.id === currentFunding?.firstReportingPeriod.id
      );
      currentFunding.lastReportingPeriod =
        userReportingPeriods[
          newFundingPeriodIdx - 1 < oldFundingPeriodIdx
            ? oldFundingPeriodIdx
            : newFundingPeriodIdx - 1
        ];
      fundingsToUpdate.push(currentFunding);
    }

    // Row might still have info that ends the current funding
    else if (rowEndsCurrentFunding(funding, currentFunding)) {
      currentFunding.lastReportingPeriod = funding.lastReportingPeriod;
      fundingsToUpdate.push(currentFunding);
      mapResult.changeTagsForChildren[matchingIdx].push(
        ChangeTag.ChangedFunding
      );
    }
  }

  // Only way to get here is by providing a row that gives an
  // exit to the current enrollment without providing a new
  // enrollment
  else if (currentEnrollment) {
    let exitPeriod: ReportingPeriod;
    if (source.lastReportingPeriod) {
      exitPeriod = userReportingPeriods.find(
        (rp) =>
          rp.type === currentFunding.fundingSpace.source &&
          rp.period.format('MM-YYYY') ===
            source.lastReportingPeriod.format('MM-YYYY')
      );
    }

    // Guess the most likely ending for the funding, if the user
    // didn't explicitlys upply it
    else {
      exitPeriod = userReportingPeriods.find(
        (rp) =>
          rp.periodStart.isSameOrBefore(currentEnrollment.exit) &&
          rp.periodEnd.isSameOrAfter(currentEnrollment.exit)
      );
    }
    currentFunding.lastReportingPeriod = exitPeriod;
    fundingsToUpdate.push(currentFunding);
  }
};
