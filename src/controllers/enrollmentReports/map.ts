import { getManager, EntityManager } from 'typeorm';
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
  SpecialEducationServicesType,
  FundingSourceTime,
  FundingTimeInput,
  CareModel,
} from '../../../client/src/shared/models';
import { FUNDING_SOURCE_TIMES } from '../../../client/src/shared/constants';
import { EnrollmentReportRow } from '../../template';
import { BadRequestError } from '../../middleware/error/errors';

export const mapAndSaveRows = async (
  rows: EnrollmentReportRow[],
  user: User
) => {
  const [organizations, sites] = await Promise.all([
    getManager().findByIds(Organization, user.organizationIds),
    getManager().findByIds(Site, user.siteIds),
  ]);

  return getManager().transaction(
    async (tManager) =>
      await Promise.all(
        rows.map((row) => mapAndSaveRow(tManager, row, organizations, sites))
      )
  );
};
/**
 * Creates Child, Family, IncomeDetermination, Enrollment, and Funding
 * from source FlattenedEnrollment.
 *
 * @param source
 */
const mapAndSaveRow = async (
  transaction: EntityManager,
  source: EnrollmentReportRow,
  userOrganizations: Organization[],
  userSites: Site[]
) => {
  try {
    const organization = lookUpOrganization(source, userOrganizations);
    if (!organization) {
      throw new BadRequestError('Invalid provider name');
    }

    const site = lookUpSite(source, organization.id, userSites);
    const family = await mapFamily(transaction, source, organization);
    const child = await mapChild(transaction, source, organization, family);
    const incomeDetermination = await mapIncomeDetermination(
      transaction,
      source,
      family
    );
    const enrollment = await mapEnrollment(transaction, source, site, child);
    const funding = await mapFunding(
      transaction,
      source,
      organization,
      enrollment
    );

    family.incomeDeterminations = [incomeDetermination];
    child.family = family;
    enrollment.fundings = [funding];
    child.enrollments = [enrollment];

    return child;
  } catch (err) {
    console.error('Unable to map row: ', err);
    return;
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
const lookUpOrganization = (
  source: EnrollmentReportRow,
  organizations: Organization[]
) => {
  if (organizations.length === 1) return organizations[0];

  if (!source.providerName)
    throw new BadRequestError('Provider name is required');

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
const lookUpSite = (
  source: EnrollmentReportRow,
  organizationId: number,
  sites: Site[]
) => {
  if (!source.siteName) return;

  return sites.find(
    (site) =>
      site.siteName.toLowerCase() === source.siteName.toLowerCase() &&
      site.organizationId === organizationId
  );
};

/**
 * Determine if an enrollment report row has no indication of the
 * respective child's race (in which case, assume not disclosed).
 * @param source
 */
const raceIndicated = (source: EnrollmentReportRow) => {
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
  family: Family
) => {
  // Gender
  const gender: Gender =
    mapEnum(Gender, source.gender, true) || Gender.NotSpecified;

  // TODO: Could do city/state verification here for birth cert location
  // TODO: Could do birthdate verification (post-20??)

  const child = transaction.create(Child, {
    sasid: source.sasid,
    firstName: source.firstName,
    middleName: source.middleName,
    lastName: source.lastName,
    suffix: source.suffix,
    birthdate: source.birthdate,
    birthTown: source.birthTown,
    birthState: source.birthState,
    birthCertificateId: source.birthCertificateId,
    americanIndianOrAlaskaNative: source.americanIndianOrAlaskaNative,
    asian: source.asian,
    blackOrAfricanAmerican: source.blackOrAfricanAmerican,
    nativeHawaiianOrPacificIslander: source.nativeHawaiianOrPacificIslander,
    white: source.white,
    raceNotDisclosed: !raceIndicated(source),
    hispanicOrLatinxEthnicity: source.hispanicOrLatinxEthnicity,
    gender,
    dualLanguageLearner: source.dualLanguageLearner,
    foster: source.foster,
    receivesDisabilityServices: source.receivesDisabilityServices,
    organization,
    family: family,
  });

  return transaction.save(child);
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
  organization: Organization
) => {
  const family = transaction.create(Family, {
    streetAddress: source.streetAddress,
    town: source.town,
    state: source.state,
    zipCode: source.zipCode,
    homelessness: source.homelessness,
    organization,
  });

  return transaction.save(family);
};

/**
 * Create IncomeDetermination object from FlattenedEnrollment source.
 * @param source
 */
const mapIncomeDetermination = (
  transaction: EntityManager,
  source: EnrollmentReportRow,
  family: Family
) => {
  const incomeDetermination = transaction.create(IncomeDetermination, {
    numberOfPeople: source.numberOfPeople,
    income: source.income,
    determinationDate: source.determinationDate,
    familyId: family.id,
  });

  return transaction.save(incomeDetermination);
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
  child: Child
) => {
  const ageGroup: AgeGroup = mapEnum(AgeGroup, source.ageGroup);
  const model: CareModel = mapEnum(CareModel, source.model);

  const enrollment = transaction.create(Enrollment, {
    site,
    childId: child.id,
    model,
    ageGroup,
    entry: source.entry,
    exit: source.exit,
    exitReason: source.exitReason,
  });

  return transaction.save(enrollment);
};

/**
 * Create a Funding object from FlattenedEnrollment source,
 * associated with a FundingSpace for given organization and ageGroup
 * (already parsed from source).
 * @param source
 * @param organization
 * @param ageGroup
 */
const mapFunding = async (
  transaction: EntityManager,
  source: EnrollmentReportRow,
  organization: Organization,
  enrollment: Enrollment
) => {
  const fundingSource: FundingSource = mapEnum(FundingSource, source.source);
  let fundingTime: FundingTime = mapEnum(FundingTime, source.time);

  //  If we haven't found a matching FundingTime, check to see if one of the non-standard formats
  //  was supplied instead and look up the corresponding FundingTime
  if (!fundingTime && fundingSource) {
    const matchingSourceTime: FundingSourceTime = FUNDING_SOURCE_TIMES.find(
      (fst) => fst.fundingSources.includes(fundingSource)
    );

    if (matchingSourceTime) {
      const matchingTime: FundingTimeInput = matchingSourceTime.fundingTimes.find(
        (fundingTime) => {
          return fundingTime.formats.includes(source.time.toString());
        }
      );

      if (matchingTime) {
        fundingTime = matchingTime.value;
      }
    }
  }

  // Cannot create funding without FundingSpace, and cannot find FundingSpace
  // without fundingSource AND fundingTime, so if you don't have them
  // MOVE ALONG
  if (fundingSource && fundingTime) {
    // Get the FundingSpace with associated funding source and agegroup for the given organization
    // TODO: Cache FundingSpace, as they'll be reused a lot
    let fundingSpace: FundingSpace;
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

    // Cannot create funding without FundingSpace, so if you don't have one
    // MOVE ALONG
    if (fundingSpace) {
      // TODO: Cache ReportingPeriods, as they'll be reused a lot
      let firstReportingPeriod: ReportingPeriod,
        lastReportingPeriod: ReportingPeriod;
      if (source.firstFundingPeriod) {
        firstReportingPeriod = await transaction.findOne(ReportingPeriod, {
          where: { type: fundingSource, period: source.firstFundingPeriod },
        });
      }
      if (source.lastFundingPeriod) {
        lastReportingPeriod = await transaction.findOne(ReportingPeriod, {
          where: { type: fundingSource, period: source.lastFundingPeriod },
        });
      }
      const funding = transaction.create(Funding, {
        firstReportingPeriod,
        lastReportingPeriod,
        fundingSpace,
        enrollmentId: enrollment.id,
      });

      return transaction.save(funding);
    }
  }

  // If we could not find a fundingSpace, we cannot create a funding
  // so NOTHING is returned.
  if (
    source.source ||
    source.time ||
    source.firstFundingPeriod ||
    source.lastFundingPeriod
  ) {
    // TODO: If the user supplied fundingType or spaceType, capture that
    // there was an error ingesting the funding info for this row so UI can
    // prompt user to fix it
    console.log(
      "User tried to enter funding information but we couldn't figure it out"
    );
  }
};

const mapEnum = <T>(
  referenceEnum:
    | typeof Gender
    | typeof CareModel
    | typeof AgeGroup
    | typeof FundingSource
    | typeof FundingTime
    | typeof SpecialEducationServicesType,
  value: string | undefined,
  firstLetterComparison: boolean = false,
  isFundingSource: boolean = false
) => {
  if (!value) return;

  const stripRegex = /[-\/\s]+/;
  const normalizedValue = value
    .toString()
    .trim()
    .replace(stripRegex, '')
    .toLowerCase();

  let ret: T;

  Object.values(referenceEnum).forEach((ref) => {
    let normalizedRef: string;

    // Leverage the hyphen in Funding Source descriptors
    if (isFundingSource) {
      normalizedRef = ref.split(' - ')[0].trim().toLowerCase();
    } else {
      normalizedRef = ref.replace(stripRegex, '').toLowerCase();
    }

    if (firstLetterComparison) {
      if (normalizedRef[0] === normalizedValue[0]) {
        ret = ref;
      }
    } else if (
      normalizedValue.startsWith(normalizedRef) ||
      normalizedRef.startsWith(normalizedValue)
    ) {
      ret = ref;
    }
  });

  return ret;
};
