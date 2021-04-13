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
