import { EntityManager } from 'typeorm';
import { Child, Site, Enrollment } from '../../../entity';
import { AgeGroup, CareModel } from '../../../../client/src/shared/models';
import { EnrollmentReportRow } from '../../../template';
import { mapEnum } from '.';

/**
 * Create Enrollment object from FlattenedEnrollment source,
 * for given site (already parsed from source).
 * @param source
 * @param site
 */
export const mapEnrollment = (
  transaction: EntityManager,
  source: EnrollmentReportRow,
  site: Site,
  child: Child,
  save: boolean
) => {
  const ageGroup: AgeGroup = mapEnum(AgeGroup, source.ageGroup);
  const model: CareModel = mapEnum(CareModel, source.model);

  let enrollment = {
    site,
    childId: child.id,
    model,
    ageGroup,
    entry: source.entry,
    exit: source.exit,
    exitReason: source.exitReason,
  } as Enrollment;

  if (save) {
    enrollment = transaction.create(Enrollment, enrollment);
    return transaction.save(enrollment);
  }

  return enrollment;
};
