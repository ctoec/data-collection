import { EntityManager } from 'typeorm';
import {
  Child,
  Family,
  Site,
  Enrollment,
  IncomeDetermination,
  Funding,
  Organization,
  FundingSpace,
  ReportingPeriod,
  User,
} from '../../entity';
import {
  Gender,
  AgeGroup,
  FundingSource,
  FundingTime,
  CareModel,
  BirthCertificateType,
} from '../../../client/src/shared/models';
import {
  getChildToUpdate,
  getExistingEnrollmentOnChild,
  getExistingFundingForEnrollment,
} from './mapUtils';
import { FUNDING_SOURCE_TIMES } from '../../../client/src/shared/constants';
import { EnrollmentReportRow } from '../../template';
import { BadRequestError, ApiError } from '../../middleware/error/errors';

export const MISSING_PROVIDER_ERROR =
  'You uploaded a file with missing information.\nProvider name is required for every record in your upload. Make sure this column is not empty.';

/**
 * Can use optional save parameter to decide whether to persist
 * the mapped results to the DB or not. If we don't persist,
 * mappnig is still performed to get the data in the right format.
 * Useful for analyzing validation errors before committing.
 */
export const mapRows = async (
  transaction: EntityManager,
  rows: EnrollmentReportRow[],
  user: User,
  opts: { save: boolean } = { save: false }
) => {
  const [organizations, sites] = await Promise.all([
    transaction.findByIds(Organization, user.organizationIds),
    transaction.findByIds(Site, user.siteIds),
  ]);

  // Need to track the unique children we've seen and parsed
  // so that we can update them if there are change rows
  const processedChildren: Child[] = [];
  const children: Child[] = [];
  for (let i = 0; i < rows.length; i++) {
    try {
      const child = await mapRow(
        transaction,
        rows[i],
        organizations,
        sites,
        processedChildren,
        opts.save
      );
      if (child) children.push(child);
    } catch (err) {
      if (err instanceof ApiError) throw err;
      console.error('Error occured while parsing row: ', err);
    }
  }

  return children;
};

/**
 * Creates Child, Family, IncomeDetermination, Enrollment, and Funding
 * from source FlattenedEnrollment.
 *
 * @param source
 */
const mapRow = async (
  transaction: EntityManager,
  source: EnrollmentReportRow,
  userOrganizations: Organization[],
  userSites: Site[],
  processedChildren: Child[],
  save: boolean
) => {
  const organization = lookUpOrganization(source, userOrganizations);
  if (!organization) {
    const orgNames = userOrganizations.map((org) => `"${org.providerName}"`);
    const orgNamesForError = `${orgNames
      .slice(0, -1)
      .join(', ')}, or ${orgNames.slice(-1)}`;
    throw new BadRequestError(
      `You entered invalid provider names\nCheck that your spreadsheet provider column only contains ${orgNamesForError} before uploading again.`
    );
  }

  const site = lookUpSite(source, organization.id, userSites);
  let child = getChildToUpdate(source, processedChildren);
  const childAlreadyExists = child !== undefined;

  console.log({ childAlreadyExists })

  // Case where this row creates a brand new child
  if (!childAlreadyExists) {
    child = await createNewChild(
      transaction,
      source,
      organization,
      site,
      processedChildren,
      save
    );
    return child;
  }

  // If we're here, we're modifying an existing child's
  // enrollment or funding information
  await updateChild(transaction, source, organization, site, child);
  // Don't return if we just modified an existing, since we'd
  // get duplicates in the children array in mapRows
  return null;
};

export const createNewChild = async (
  transaction: EntityManager,
  source: EnrollmentReportRow,
  organization: Organization,
  site: Site,
  processedChildren: Child[],
  save: boolean
) => {
  const family = await mapFamily(transaction, source, organization, save);
  const child = await mapChild(transaction, source, organization, family, save);
  const incomeDetermination = await mapIncomeDetermination(
    transaction,
    source,
    family,
    save
  );
  const enrollment = await mapEnrollment(
    transaction,
    source,
    site,
    child,
    save
  );
  const funding = await mapFunding(
    transaction,
    source,
    organization,
    enrollment,
    save
  );
  family.incomeDeterminations = [incomeDetermination];
  child.family = family;
  enrollment.fundings = [funding];
  child.enrollments = [enrollment];

  // Make sure to log that we've seen this child in our visited set
  processedChildren.push(child);
  return child;
};

export const updateChild = async (
  transaction: EntityManager,
  source: EnrollmentReportRow,
  organization: Organization,
  site: Site,
  child: Child
) => {
  let enrollment = getExistingEnrollmentOnChild(source, child);
  const modifyingExistingEnrollment = enrollment !== undefined;
  const enrollmentUpdate = await mapEnrollment(
    transaction,
    source,
    site,
    child,
    enrollment === undefined
  );

  // Apply any needed enrollment info updates before going to funding
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
};

/**
 * Look up organization from user's organizations that matches
 * source provider name.
 * If the source provider name does not exist, throw an error
 * as this is required for upload to succeed
 * TODO: How do we want to implement fuzzy matching here?
 * @param source
 */
export const lookUpOrganization = (
  source: EnrollmentReportRow,
  organizations: Organization[]
) => {
  if (organizations.length === 1) return organizations[0];

  if (!source.providerName) throw new BadRequestError(MISSING_PROVIDER_ERROR);

  return organizations.find(
    (organization) =>
      organization.providerName.toLowerCase() ===
      source.providerName.toLowerCase()
  );
};

/**
 * Look up site from user's sites that matches source site name,
 * and belongs to the organization indiated in the source row.
 *
 * @param source
 */
export const lookUpSite = (
  source: EnrollmentReportRow,
  organizationId: number,
  sites: Site[]
) => {
  if (!source.site) return;

  return sites.find(
    (site) =>
      site.siteName.toLowerCase() === source.site.toLowerCase() &&
      site.organizationId === organizationId
  );
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
 * Create Child object from FlattenedEnrollment source.
 * TODO: How do we handle blocking data errors in a single row?
 * @param source
 */
const mapChild = (
  transaction: EntityManager,
  source: EnrollmentReportRow,
  organization: Organization,
  family: Family,
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
    sasid: source.sasid,
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
    child = transaction.create(Child, child);
    return transaction.save(child);
  }

  return child;
};

/**
 * Create Family object (with IncomeDetermination) from FlattenedEnrollment
 * source.
 * TODO: Lookup existing families before creating new one
 * @param source
 */
const mapFamily = (
  transaction: EntityManager,
  source: EnrollmentReportRow,
  organization: Organization,
  save: boolean
) => {
  let family = {
    streetAddress: source.streetAddress,
    town: source.town,
    state: source.state,
    zipCode: source.zipCode,
    homelessness: source.homelessness,
    organization,
  } as Family;

  if (save) {
    family = transaction.create(Family, family);
    return transaction.save(family);
  }

  return family;
};

/**
 * Create IncomeDetermination object from FlattenedEnrollment source.
 * @param source
 */
const mapIncomeDetermination = (
  transaction: EntityManager,
  source: EnrollmentReportRow,
  family: Family,
  save: boolean
) => {
  // Only attempt to create an income determination if the user supplied any
  // of the necessary data points
  if (source.numberOfPeople || source.income || source.determinationDate) {
    let incomeDetermination = {
      // Cast empty strings to undefined to avoid DB write failures
      numberOfPeople: source.numberOfPeople || undefined,
      // Need to accept 0 as valid income, so use forcible number conversion
      // to check if the result is a valid number
      income: isNaN(source.income) ? undefined : source.income,
      determinationDate: source.determinationDate,
      familyId: family.id,
    } as IncomeDetermination;

    if (save) {
      incomeDetermination = transaction.create(
        IncomeDetermination,
        incomeDetermination
      );
      return transaction.save(incomeDetermination);
    }

    return incomeDetermination;
  }
};

/**
 * Create Enrollment object from FlattenedEnrollment source,
 * for given site (already parsed from source).
 * @param source
 * @param site
 */
const mapEnrollment = (
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

  enrollment = transaction.create(Enrollment, enrollment);
  if (save) {
    return transaction.save(enrollment);
  }

  return enrollment;
};

/**
 * Create a Funding object from FlattenedEnrollment source,
 * associated with a FundingSpace for given organization and ageGroup
 * (already parsed from source, stored as enrollment.ageGroup)
 * @param transaction
 * @param source
 * @param organization
 * @param enrollment
 */
export const mapFunding = async (
  // TODO: FIX
  transaction: EntityManager,
  source: EnrollmentReportRow,
  organization: Organization,
  enrollment: Enrollment,
  save: boolean
) => {
  // if (!(source.fundingSpace ||
  //   source.time ||
  //   source.firstReportingPeriod ||
  //   source.lastReportingPeriod)) {
  //   return;
  // }
  const fundingSource: FundingSource = mapEnum(
    FundingSource,
    source.fundingSpace,
    {
      isFundingSource: true,
    }
  );
  const fundingTime: FundingTime = mapFundingTime(source.time, fundingSource);

  let fundingSpace: FundingSpace;
  if (fundingSource && fundingTime) {
    // Get the FundingSpace with associated funding source and agegroup for the given organization
    // TODO: Cache FundingSpace, as they'll be reused a lot
    const fundingSpaces = await transaction.find(FundingSpace, {
      where: {
        source: fundingSource,
        ageGroup: enrollment.ageGroup,
        organization,
      },
    });
    fundingSpace = fundingSpaces.find((space) => space.time === fundingTime);

    // If no direct match on time and source === CDC, look for a split
    if (!fundingSpace && fundingSource === FundingSource.CDC) {
      fundingSpace = fundingSpaces.find(
        (space) => space.time === FundingTime.SplitTime
      );
    }
  }

  // TODO: Cache ReportingPeriods, as they'll be reused a lot
  let firstReportingPeriod: ReportingPeriod,
    lastReportingPeriod: ReportingPeriod;
  if (source.firstReportingPeriod) {
    firstReportingPeriod = await transaction.findOne(ReportingPeriod, {
      where: { type: fundingSource, period: p => p.format('MM/YYYY') === source.firstReportingPeriod.format('MM/YYYY') },
    });
  }
  if (source.lastReportingPeriod) {
    lastReportingPeriod = await transaction.findOne(ReportingPeriod, {
      where: { type: fundingSource, period: p => p.format('MM/YYYY') === source.lastReportingPeriod.format('MM/YYYY') },
    });
  }

  // If the user supplied _any_ funding-related fields, create the funding.
  if (
    source.fundingSpace ||
    source.time ||
    source.firstReportingPeriod ||
    source.lastReportingPeriod
  ) {
    let funding = {
      firstReportingPeriod,
      lastReportingPeriod,
      fundingSpace,
      enrollmentId: enrollment.id,
    } as Funding;

    funding = transaction.create(Funding, funding);
    if (save) {
      return transaction.save(funding);
    }
    return funding;
  }
};

/**
 * Leverage funding source -> time -> format mappings from FUNDING_SOURCE_TIMES
 * to determine the valid funding time entered by the user.
 */
export const mapFundingTime = (
  value: number | string | undefined,
  fundingSource: FundingSource | undefined
) => {
  if (!value) return;

  // Cannot determine a funding time without a funding space, as they are space-specific
  if (!fundingSource) return;

  const sourceTimes = FUNDING_SOURCE_TIMES.find((fst) =>
    fst.fundingSources.includes(fundingSource)
  );
  return sourceTimes.fundingTimes.find((time) =>
    time.formats.some(
      (format) => format.toLowerCase() === value.toString().trim().toLowerCase()
    )
  )?.value;
};

/**
 * Helper function to lookup enum values from source string values.
 *
 * Can optionally do first letter comparison, indicated by the
 * `firstLetterComparison` flag, which limits comparison to only
 * the first letter of the input value and enum values.
 *
 * Also, does special case handling for FundingSource lookup,
 * indicated by the `isFundingSource` flag.
 * @param referenceEnum
 * @param value
 * @param firstLetterComparison
 * @param isFundingSource
 */
export const mapEnum = <T>(
  referenceEnum:
    | typeof BirthCertificateType
    | typeof Gender
    | typeof CareModel
    | typeof AgeGroup
    | typeof FundingSource,
  value: string | undefined,
  opts: {
    isFundingSource?: boolean;
  } = {}
) => {
  if (!value) return;

  const stripRegex = /[-\/\s]+/;
  const normalizedInput = value
    .toString()
    .trim()
    .replace(stripRegex, '')
    .toLowerCase();
  let ret: T;

  // Iterate through all enum values and check if any match
  Object.values(referenceEnum).forEach((ref: T) => {
    const refString = (ref as unknown) as string;

    // Base case for all other enums -- compare the normalized enum values
    // to the normalized input value
    const normalizedReference = refString
      .trim()
      .replace(stripRegex, '')
      .toLowerCase();
    if (
      normalizedReference.startsWith(normalizedInput) ||
      normalizedInput.startsWith(normalizedReference)
    ) {
      ret = ref;
    }
    // Special case for mapping FundingSource, to check for
    // the acronym (i.e. CDC), full name (i.e. Child day care)
    // or full combined (i.e. CDC - Child day care) version
    if (!ret && opts.isFundingSource) {
      const normalizedReferences = refString
        .split('-')
        .map((r) => r.trim().replace(stripRegex, '').toLowerCase());
      normalizedReferences.forEach((normalizedReference) => {
        if (normalizedInput.startsWith(normalizedReference)) {
          ret = ref;
        }
      });
    }
  });

  return ret;
};
