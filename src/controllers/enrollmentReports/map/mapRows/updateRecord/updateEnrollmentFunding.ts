import { ChangeTag } from '../../../../../../client/src/shared/models';
import { Child, Enrollment, Funding } from '../../../../../entity';
import { EnrollmentReportRow } from '../../../../../template';
import { MapThingHolder } from '../../setUpMapThingHolder';
import { mapEnrollment, mapFunding } from '../utils';
import { lookUpSite } from '../lookUpSite';

export const updateEnrollmentFunding = (
  row: EnrollmentReportRow,
  match: Child,
  thingHolder: MapThingHolder
) => {
  if (!row.site && !row.entry && !row.ageGroup) {
    return;
  }

  const site = lookUpSite(row, match.organization.id, thingHolder.sites);
  const newEnrollment =
    row.site && row.entry && row.ageGroup
      ? mapEnrollment(row, site, match)
      : undefined;
  const matchingEnrollment = getEnrollmentMatch(
    newEnrollment,
    match.enrollments
  );

  const newFunding =
    row.fundingSpace && row.firstReportingPeriod
      ? mapFunding(
          row,
          match.organization,
          newEnrollment.ageGroup,
          thingHolder.fundingSpaces,
          thingHolder.reportingPeriods
        )
      : undefined;
  const matchingFunding = getFundingMatch(
    newFunding,
    matchingEnrollment?.fundings
  );

  if (rowHasExitForCurrentEnrollment(newEnrollment, matchingEnrollment)) {
    matchingEnrollment.exit = newEnrollment.exit;
    matchingEnrollment.exitReason = newEnrollment.exitReason;
    matchingFunding.lastReportingPeriod = newFunding.lastReportingPeriod;
    match.tags.push(ChangeTag.WithdrawnRecord);
  } else if (rowHasNewEnrollment(newEnrollment, matchingEnrollment)) {
    newEnrollment.fundings = [newFunding];
    if (match.enrollments) match.enrollments.push(newEnrollment);
    else match.enrollments = [newEnrollment];
    match.tags.push(ChangeTag.ChangedEnrollment);
  } else if (rowEndsCurrentFunding(newFunding, matchingFunding)) {
    matchingFunding.lastReportingPeriod = newFunding.lastReportingPeriod;
    match.tags.push(ChangeTag.ChangedFunding);
  } else if (rowHasNewFunding(newFunding, matchingFunding)) {
    matchingEnrollment.fundings.push(newFunding);
    match.tags.push(ChangeTag.ChangedFunding);
  }
};

const getEnrollmentMatch = (
  enrollmentFromRow: Enrollment,
  enrollments: Enrollment[] | undefined
) =>
  enrollments?.find(
    (e) =>
      // Sites match
      e.site &&
      enrollmentFromRow.site?.id === e.site?.id &&
      // Age groups match
      e.ageGroup &&
      enrollmentFromRow.ageGroup === e.ageGroup &&
      // Entry dates match
      e.entry &&
      enrollmentFromRow.entry.isSame(e.entry, 'day') &&
      // If existing enrollment has exit date, then exit dates match
      (e.exit ? enrollmentFromRow.exit.isSame(e.exit, 'day') : true)
  );

const rowHasExitForCurrentEnrollment = (
  newEnrollment: Enrollment | undefined,
  matchingEnrollment: Enrollment | undefined
) =>
  // Matching enrollment exists, and does not have exit date
  !!matchingEnrollment &&
  !matchingEnrollment.exit &&
  // and new enrollment exists and does have exit date
  !!newEnrollment?.exit;

const rowHasNewEnrollment = (
  newEnrollment: Enrollment | undefined,
  matchingEnrollment: Enrollment | undefined
) =>
  // Matching enrollment does not exist
  !matchingEnrollment &&
  // and new enrollment does exist
  !!newEnrollment;

const getFundingMatch = (
  fundingFromRow: Funding,
  fundings: Funding[] | undefined
) =>
  fundings?.find(
    (f) =>
      // Funding spaces match
      f.fundingSpace &&
      fundingFromRow.fundingSpace?.id === f.fundingSpace.id &&
      // First reporting periods match
      f.firstReportingPeriod &&
      fundingFromRow.firstReportingPeriod?.id === f.firstReportingPeriod.id &&
      // If existing funding has last reporting period, then last reporting periods match
      (f.lastReportingPeriod
        ? fundingFromRow.lastReportingPeriod?.id === f.lastReportingPeriod.id
        : true)
  );

export const rowEndsCurrentFunding = (
  newFunding: Funding | undefined,
  matchingFunding: Funding | undefined
) =>
  // Matching funding exists, and does not have last reporting period
  !!matchingFunding &&
  !matchingFunding.lastReportingPeriod &&
  // and new funding exists and does have last reporting period
  !!newFunding?.lastReportingPeriod;

export const rowHasNewFunding = (
  newFunding: Funding | undefined,
  matchingFunding: Funding | undefined
) =>
  // Matching funding does not exist
  !matchingFunding &&
  // and new funding does exist
  !!newFunding;
