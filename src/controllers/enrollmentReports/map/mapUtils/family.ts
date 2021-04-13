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
 * Updates a family's address if any of the address fields
 * in an EnrollmentReportRow for the family provide new
 * or different information.
 * @param family
 * @param source
 * @param familiesToUpdate
 */
export const updateFamilyAddress = (
  family: Family,
  source: EnrollmentReportRow,
  familiesToUpdate: Family[]
) => {
  let madeAChange = false;
  if (source.homelessness) {
    const homelessness: UndefinableBoolean = mapEnum(
      UndefinableBoolean,
      source.homelessness,
      { isUndefineableBoolean: true }
    );
    if (family.homelessness !== homelessness) {
      family.homelessness = homelessness;
      madeAChange = true;
    }
  }
  if (rowHasNewAddress(source, family)) {
    family.streetAddress = source.streetAddress;
    family.town = source.town;
    family.state = source.state;
    family.zipCode = source.zipCode;
    madeAChange = true;
  }
  if (madeAChange) familiesToUpdate.push(family);
  return madeAChange;
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
