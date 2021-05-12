import { UndefinableBoolean } from '../../../../../client/src/shared/models';
import { Organization, Family } from '../../../../entity';

import { EnrollmentReportRow } from '../../../../template';
import { mapEnum } from './enum';
import { getManager } from 'typeorm';

/**
 * Create Family object (with IncomeDetermination) from FlattenedEnrollment
 * source.
 * TODO: Lookup existing families before creating new one
 * @param source
 */
export const addFamily = (
  source: EnrollmentReportRow,
  organization: Organization
) => {
  const homelessness: UndefinableBoolean = mapEnum(
    UndefinableBoolean,
    source.homelessness,
    { isUndefineableBoolean: true }
  );

  return getManager().create(Family, {
    streetAddress: source.streetAddress,
    town: source.town,
    state: source.state,
    zipCode: source.zipCode,
    homelessness,
    organization,
  });
};
