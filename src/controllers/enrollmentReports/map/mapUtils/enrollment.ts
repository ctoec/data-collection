import { Child, Site, Enrollment } from '../../../../entity';
import {
  AgeGroup,
  CareModel,
  ChangeTag,
  ExitReason,
} from '../../../../../client/src/shared/models';
import { EnrollmentReportRow } from '../../../../template';
import { mapEnum } from '.';
import { getManager } from 'typeorm';
import { MapResult } from '../uploadTypes';

/**
 * Create Enrollment object from FlattenedEnrollment source,
 * for given site (already parsed from source).
 * @param source
 * @param site
 */
export const mapEnrollment = (
  source: EnrollmentReportRow,
  site: Site,
  child: Child
) => {
  const ageGroup: AgeGroup = mapEnum(AgeGroup, source.ageGroup);
  const model: CareModel = !source.model
    ? CareModel.Unknown
    : mapEnum(CareModel, source.model);

  return getManager().create(Enrollment, {
    site,
    child,
    model,
    ageGroup,
    entry: source.entry,
    exit: source.exit,
    exitReason: source.exitReason,
  });
};

/**
 * Util function that determines whether an enrollment mapped from
 * a current EnrollmentReportRow has new or different information
 * from a child's current enrollment.
 * @param enrollmentFromRow
 * @param enrollment
 */
export const rowHasNewEnrollment = (
  source: EnrollmentReportRow,
  enrollmentFromRow: Enrollment,
  enrollment: Enrollment
) => {
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

export const rowHasExitForCurrentEnrollment = (
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

/**
 * Simple util function that determines the most likely exit reason
 * for a previous enrollment when updating to a new enrollment.
 * NOTE: The logic in here is super simple right now, and as we
 * identify / support more kinds of updates to enrollments, we can
 * broaden it.
 * @param prevEnrollment
 * @param newEnrollment
 */
export const getExitReason = (
  prevEnrollment: Enrollment,
  newEnrollment: Enrollment
) => {
  if (prevEnrollment.ageGroup !== newEnrollment.ageGroup)
    return ExitReason.AgedOut;
  if (
    prevEnrollment.model !== newEnrollment.model ||
    prevEnrollment.site.id !== newEnrollment.site.id
  )
    return ExitReason.MovedWithinProgram;
  return ExitReason.Unknown;
};

/**
 * Perform creation or update of a new enrollment for a child,
 * if one is contained in the given spreadsheet row.
 */
export const handleEnrollmentUpdate = (
  source: EnrollmentReportRow,
  site: Site,
  child: Child,
  enrollmentsToUpdate: Enrollment[],
  mapResult: MapResult,
  matchingIdx: number
) => {
  const currentEnrollment: Enrollment | undefined = child.enrollments.find(
    (e) => !e.exit
  );

  let enrollment = mapEnrollment(source, site, child);
  const isNewEnrollment = rowHasNewEnrollment(
    source,
    enrollment,
    currentEnrollment
  );

  if (isNewEnrollment) {
    enrollment.fundings = [];
    enrollmentsToUpdate.push(enrollment);
    child.enrollments.push(enrollment);
    // DESIGN NOTE: We'll guess that the previous enrollment and funding
    // ended "one unit" (day/reporting period) before the new ones
    currentEnrollment.exit = enrollment.entry.clone().add(-1, 'day');
    currentEnrollment.exitReason = getExitReason(currentEnrollment, enrollment);
    if (currentEnrollment.exitReason === ExitReason.AgedOut) {
      mapResult.changeTagsForChildren[matchingIdx].push(ChangeTag.AgedUp);
    } else {
      mapResult.changeTagsForChildren[matchingIdx].push(
        ChangeTag.ChangedEnrollment
      );
    }
    enrollmentsToUpdate.push(currentEnrollment);
  }

  // Row might still be a withdrawl for the current enrollment
  else if (rowHasExitForCurrentEnrollment(enrollment, currentEnrollment)) {
    currentEnrollment.exit = enrollment.exit.clone();
    currentEnrollment.exitReason = enrollment.exitReason;
    enrollmentsToUpdate.push(currentEnrollment);
    mapResult.changeTagsForChildren[matchingIdx].push(
      ChangeTag.WithdrawnRecord
    );

    // No need to fund an enrollment that we withdrew
    enrollment = undefined;
  }

  // If no new enrollment provided, new funding might apply
  // to most current valid enrollment, so set that here so
  // we don't have to think about it in map
  else {
    enrollment = currentEnrollment;
  }

  return {
    enrollment,
    currentEnrollment,
    isNewEnrollment,
  };
};
