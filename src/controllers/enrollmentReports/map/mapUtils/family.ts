import { UndefinableBoolean } from '../../../../../client/src/shared/models';
import { Organization, Family, Child } from '../../../../entity';

import { EnrollmentReportRow } from '../../../../template';
import { mapEnum } from './enum';
import { getManager } from 'typeorm';

/**
 * Create Family object (with IncomeDetermination) from FlattenedEnrollment
 * source.
 * TODO: Lookup existing families before creating new one
 * @param source
 */
export const mapFamily = (
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

/**
 * Util function that identifies whether the address information
 * contained in a given EnrollmentReportRow provides new or
 * updated information to the address fields of a particular
 * family.
 * @param source
 * @param family
 */
export const rowHasNewAddress = (
  source: EnrollmentReportRow,
  family: Family
) => {
  return (
    (!!source.streetAddress && source.streetAddress !== family.streetAddress) ||
    (!!source.town && source.town !== family.town) ||
    (!!source.state && source.state !== family.state) ||
    (!!source.zipCode && source.zipCode !== family.zipCode)
  );
};
