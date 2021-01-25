import { getManager } from 'typeorm';
import { Child, Family, Organization } from '../../../../entity';
import {
  Gender,
  BirthCertificateType,
  UniqueIdType,
  UndefinableBoolean,
} from '../../../../../client/src/shared/models';
import { EnrollmentReportRow } from '../../../../template';
import { mapEnum } from '.';

/**
 * Create Child object from FlattenedEnrollment source.
 * TODO: How do we handle blocking data errors in a single row?
 * @param source
 */
export const mapChild = (
  source: EnrollmentReportRow,
  organization: Organization,
  family: Family
) => {
  // Gender
  const gender: Gender = mapEnum(Gender, source.gender) || Gender.NotSpecified;

  // Birth certificate type
  const birthCertificateType: BirthCertificateType = mapEnum(
    BirthCertificateType,
    source.birthCertificateType,
    { isBirthCertificateType: true }
  );

  // Ethnicity
  const hispanicOrLatinxEthnicity: UndefinableBoolean = mapEnum(
    UndefinableBoolean,
    source.hispanicOrLatinxEthnicity,
    { isUndefineableBoolean: true }
  );

  // Dual Language Learner
  const dualLanguageLearner: UndefinableBoolean = mapEnum(
    UndefinableBoolean,
    source.dualLanguageLearner,
    { isUndefineableBoolean: true }
  );

  // Foster
  const foster: UndefinableBoolean = mapEnum(
    UndefinableBoolean,
    source.foster,
    { isUndefineableBoolean: true }
  );

  // Receives Disability Services
  const receivesDisabilityServices: UndefinableBoolean = mapEnum(
    UndefinableBoolean,
    source.receivesDisabilityServices,
    { isUndefineableBoolean: true }
  );

  // TODO: Could do city/state verification here for birth cert location
  // TODO: Could do birthdate verification (post-20??)
  return getManager().create(Child, {
    sasid:
      organization.uniqueIdType === UniqueIdType.SASID
        ? source.sasidUniqueId
        : undefined,
    uniqueId:
      organization.uniqueIdType === UniqueIdType.Other
        ? source.sasidUniqueId
        : undefined,
    firstName: source.firstName,
    middleName: source.middleName,
    lastName: source.lastName,
    suffix: source.suffix,
    birthdate: source.birthdate,
    birthCertificateType: birthCertificateType,
    birthTown: source.birthTown,
    birthState: source.birthState,
    birthCertificateId: source.birthCertificateId,
    americanIndianOrAlaskaNative: source.americanIndianOrAlaskaNative,
    asian: source.asian,
    blackOrAfricanAmerican: source.blackOrAfricanAmerican,
    nativeHawaiianOrPacificIslander: source.nativeHawaiianOrPacificIslander,
    white: source.white,
    raceNotDisclosed: !getRaceIndicated(source),
    hispanicOrLatinxEthnicity,
    gender,
    dualLanguageLearner,
    foster,
    receivesDisabilityServices,
    organization,
    family,
  });
};

/**
 * Determine if an enrollment report row has no indication of the
 * respective child's race (in which case, assume not disclosed).
 * @param source
 */
export const getRaceIndicated = (source: EnrollmentReportRow) => {
  return (
    !!source.americanIndianOrAlaskaNative ||
    !!source.asian ||
    !!source.blackOrAfricanAmerican ||
    !!source.nativeHawaiianOrPacificIslander ||
    !!source.white
  );
};

/**
 * Determine whether a given enrollment report row from an
 * uploaded sheet has demographic/identifier information matching
 * a given child.
 * @param child
 * @param other
 */
export const isIdentifierMatch = (child: Child, other: EnrollmentReportRow) =>
  child.firstName === other.firstName &&
  child.lastName === other.lastName &&
  child.birthdate &&
  child.birthdate?.format('MM/DD/YYYY') ===
    other.birthdate?.format('MM/DD/YYYY') &&
  ((child.sasid && child.sasid === other.sasidUniqueId) ||
    (child.uniqueId && child.uniqueId === other.sasidUniqueId) ||
    (!child.sasid && !child.uniqueId));
