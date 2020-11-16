import { EntityManager } from 'typeorm';
import {
  Child,
  Family,
  Site,
  Enrollment,
  Funding,
  Organization,
  User,
} from '../../../entity';
import {
  Gender,
  BirthCertificateType,
  UniqueIdType,
} from '../../../../client/src/shared/models';
import { EnrollmentReportRow } from '../../../template';
import {
  getExistingFundingForEnrollment,
  mapEnrollment,
  mapEnum,
  mapFamily,
  mapFunding,
  mapIncomeDetermination,
} from '.';

export const createNewChild = async (
  transaction: EntityManager,
  source: EnrollmentReportRow,
  organization: Organization,
  site: Site,
  user: User,
  save: boolean
) => {
  const family = await mapFamily(transaction, source, organization, user, save);
  const child = await mapChild(
    transaction,
    source,
    organization,
    family,
    user,
    save
  );
  const incomeDetermination = await mapIncomeDetermination(
    transaction,
    source,
    family,
    user,
    save
  );
  const enrollment = await mapEnrollment(
    transaction,
    source,
    site,
    child,
    user,
    save
  );
  const funding = await mapFunding(
    transaction,
    source,
    organization,
    enrollment,
    user,
    save
  );
  family.incomeDeterminations = [incomeDetermination];
  child.family = family;
  enrollment.fundings = [funding];
  child.enrollments = [enrollment];

  return child;
};

export const updateChild = async (
  transaction: EntityManager,
  source: EnrollmentReportRow,
  organization: Organization,
  site: Site,
  child: Child,
  user: User
) => {
  let enrollment = getExistingEnrollmentOnChild(source, child);
  const modifyingExistingEnrollment = enrollment !== undefined;
  const enrollmentUpdate = await mapEnrollment(
    transaction,
    source,
    site,
    child,
    user,
    enrollment === undefined
  );

  // Apply any needed enrollment info updates before going to funding
  // TODO: this pattern is unnecessary because save updates an entity if it existed before-- we should refactor to just save
  if (modifyingExistingEnrollment) {
    await transaction.update(Enrollment, enrollment.id, enrollmentUpdate);
  }

  let funding = getExistingFundingForEnrollment(source, enrollment);
  const modifyingExistingFunding = funding !== undefined;
  const fundingUpdate = await mapFunding(
    transaction,
    source,
    organization,
    enrollmentUpdate,
    user,
    funding === undefined
  );

  if (modifyingExistingEnrollment) {
    // Either modifying existing funding or attaching brand new funding
    if (modifyingExistingFunding) {
      await transaction.update(Funding, funding.id, fundingUpdate);
    } else {
      enrollment.fundings.push(fundingUpdate);
    }
  } else {
    // Create new enrollment altogether
    enrollmentUpdate.fundings = [fundingUpdate];
    if (child.enrollments) child.enrollments.push(enrollmentUpdate);
    else child.enrollments = [enrollmentUpdate];
  }
  return child;
};

/**
 * Create Child object from FlattenedEnrollment source.
 * TODO: How do we handle blocking data errors in a single row?
 * @param source
 */
export const mapChild = (
  transaction: EntityManager,
  source: EnrollmentReportRow,
  organization: Organization,
  family: Family,
  user: User,
  save: boolean
) => {
  // Gender
  const gender: Gender = mapEnum(Gender, source.gender) || Gender.NotSpecified;

  //Birth certificate type
  const birthCertificateType: BirthCertificateType = mapEnum(
    BirthCertificateType,
    source.birthCertificateType
  );

  // TODO: Could do city/state verification here for birth cert location
  // TODO: Could do birthdate verification (post-20??)

  let child = {
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
    hispanicOrLatinxEthnicity: source.hispanicOrLatinxEthnicity,
    gender,
    dualLanguageLearner: source.dualLanguageLearner,
    foster: source.foster,
    receivesDisabilityServices: source.receivesDisabilityServices,
    organization,
    family: family,
  } as Child;

  if (save) {
    child = transaction.create(Child, {
      ...child,
      updateMetaData: { author: user },
    });
    return transaction.save(child);
  }

  return child;
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
 * Determine whether a child with the given identifying
 * information has already been seen, out of all children
 * that have thus far been parsed.
 * @param row
 * @param processedChildren
 */
export const getChildToUpdate = (
  row: EnrollmentReportRow,
  processedChildren: Child[]
) => {
  return processedChildren.find((c) => isIdentifierMatch(c, row));
};

/**
 * Finds an enrollment on the given child object that matches
 * the characteristics of an enrollment report row from an
 * uploaded sheet. Two enrollments match if they have the same
 * dates at the same site.
 * @param row
 * @param child
 */
export const getExistingEnrollmentOnChild = (
  row: EnrollmentReportRow,
  child: Child
) => {
  if (!child.enrollments) return undefined;
  return child.enrollments.find((e) => {
    return (
      e.site?.siteName === row.site &&
      e.entry.format('MM/DD/YYYY') === row.entry.format('MM/DD/YYYY')
    );
  });
};

/**
 * Determine whether a given enrollment report row from an
 * uploaded sheet has demographic/identifier information matching
 * a given child.
 * @param child
 * @param other
 */
export const isIdentifierMatch = (
  child: Child | EnrollmentReportRow,
  other: EnrollmentReportRow
) => {
  let match =
    child.firstName === other.firstName &&
    child.lastName === other.lastName &&
    child.birthdate &&
    child.birthdate?.format('MM/DD/YYYY') ===
      other.birthdate?.format('MM/DD/YYYY');

  if (child instanceof Child) {
    match =
      match &&
      (child.sasid === other.sasidUniqueId ||
        child.uniqueId === other.sasidUniqueId);
  } else {
    match = match && child.sasidUniqueId === other.sasidUniqueId;
  }

  return match;
};
