import { propertyDateSorter } from '../../../../../utils/propertyDateSorter';
import {
  ChangeTag,
  ExitReason,
} from '../../../../../../client/src/shared/models';
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
  const site = lookUpSite(row, match.organization.id, thingHolder.sites);
  const mostRecentEnrollment = match.enrollments
    ?.sort((a, b) => propertyDateSorter(a, b, (e) => e.exit))
    .slice(-1)[0];
  const currentFunding = mostRecentEnrollment?.fundings?.find(
    (f) => !f.lastReportingPeriod
  );

  const newEnrollment = mapEnrollment(row, site, match);
  const newFunding = mapFunding(
    row,
    match.organization,
    newEnrollment.ageGroup,
    thingHolder.fundingSpaces,
    thingHolder.reportingPeriods
  );

  if (rowHasExitForCurrentEnrollment(newEnrollment, mostRecentEnrollment)) {
    mostRecentEnrollment.exit = newEnrollment.exit;
    mostRecentEnrollment.exitReason = newEnrollment.exitReason;
    currentFunding.lastReportingPeriod = newFunding.lastReportingPeriod;
    match.tags.push(ChangeTag.WithdrawnRecord);
    return;
  }

  if (rowHasNewEnrollment(row, newEnrollment, mostRecentEnrollment)) {
    newEnrollment.fundings = [newFunding];
    if (match.enrollments) match.enrollments.push(newEnrollment);
    else match.enrollments = [newEnrollment];

    match.tags.push(
      mostRecentEnrollment?.exitReason === ExitReason.AgedOut
        ? ChangeTag.AgedUp
        : ChangeTag.ChangedEnrollment
    );
    return;
  }

  if (rowEndsCurrentFunding(newFunding, currentFunding)) {
    currentFunding.lastReportingPeriod = newFunding.lastReportingPeriod;
    match.tags.push(ChangeTag.ChangedFunding);
  }

  if (rowHasNewFunding(newFunding, currentFunding)) {
    mostRecentEnrollment.fundings.push(newFunding);
    match.tags.push(ChangeTag.ChangedFunding);
  }
};

const rowHasExitForCurrentEnrollment = (
  enrollmentFromRow: Enrollment,
  enrollment: Enrollment
) => {
  return (
    enrollmentFromRow.site &&
    enrollmentFromRow.site.siteName === enrollment.site.siteName &&
    enrollmentFromRow.model === enrollment.model &&
    enrollmentFromRow.ageGroup &&
    enrollmentFromRow.ageGroup === enrollment.ageGroup &&
    enrollmentFromRow.entry &&
    enrollmentFromRow.entry.format('MM/DD/YYYY') ===
      enrollment.entry.format('MM/DD/YYYY') &&
    enrollmentFromRow.exit !== undefined &&
    enrollment.entry.isSameOrBefore(enrollmentFromRow.exit)
  );
};

const rowHasNewEnrollment = (
  source: EnrollmentReportRow,
  enrollmentFromRow: Enrollment,
  enrollment: Enrollment
) => {
  if (!enrollmentFromRow) return false;
  if (!enrollment) return true;
  return (
    (enrollmentFromRow.site &&
      enrollmentFromRow.site.siteName !== enrollment.site.siteName) ||
    (source.model && enrollmentFromRow.model !== enrollment.model) ||
    (enrollmentFromRow.ageGroup &&
      enrollmentFromRow.ageGroup !== enrollment.ageGroup) ||
    (enrollmentFromRow.entry &&
      enrollmentFromRow.entry.format('MM/DD/YYYY') !==
        enrollment.entry.format('MM/DD/YYYY'))
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
