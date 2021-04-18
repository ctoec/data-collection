import { Child, Site, Enrollment } from '../../../../../entity';
import {
  AgeGroup,
  CareModel,
} from '../../../../../../client/src/shared/models';
import { EnrollmentReportRow } from '../../../../../template';
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
