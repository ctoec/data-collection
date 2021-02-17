import { CareModel, Enrollment } from '../shared/models';

/**
 * Quick verification of whether an enrollment has meaningful info.
 */
export const enrollmentHasNoInformation = (enrollment: Enrollment) => {
  return (
    enrollment.site === null &&
    (enrollment.model === CareModel.Unknown ||
      enrollment.model === undefined) &&
    enrollment.ageGroup === undefined &&
    enrollment.entry === undefined
  );
};
