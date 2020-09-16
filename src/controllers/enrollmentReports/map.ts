import { getManager } from 'typeorm';
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
} from '../../entity';
import {
  Gender,
  AgeGroup,
  FundingSource,
  FundingTime,
  FundingTimeInput,
  SpecialEducationServicesType,
  FundingSourceTime,
} from '../../../client/src/shared/models';
import { FUNDING_SOURCE_TIMES } from '../../../client/src/shared/constants';
import { EnrollmentReportRow } from '../../template';

/**
 * Creates Child, Family, IncomeDetermination, Enrollment, and Funding
 * from source FlattenedEnrollment.
 * Also looks up existing Organization and Site by name.
 *
 *
 * TODO: Implement some Org/Site access authorization layer.
 * When/where/how do we layer in internal app authorization?
 * TODO: Cache Org/Site, since they are definitely reused a lot in an enrollment report
 * @param source
 */
export const mapRow = async (source: EnrollmentReportRow) => {
  try {
    const organization = await mapOrganization(source);
    const site = await mapSite(source);
    const family = await mapFamily(source, organization);
    const child = await mapChild(source, organization, family);
    const incomeDetermination = await mapIncomeDetermination(source, family);
    const enrollment = await mapEnrollment(source, site, child);
    const funding = await mapFunding(source, organization, enrollment);

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
 * Get organization from our system that matches FlattenedEnrollment
 * source provider name.
 * TODO: How do we want to implement fuzzy matching here?
 * TODO: What do we want to do if the organization does not exist?
 * @param source
 */
const mapOrganization = (source: EnrollmentReportRow) => {
  return getManager().findOneOrFail(Organization, {
    where: { providerName: source.providerName },
  });
};

/**
 * Get Site from our system that matches FlattenedEnrollment source
 * site name.
 * TODO: Confirm that site belongs to org from same row
 * TODO: How do we want to implement fuzzy matching here?
 * TODO: What do we want to do if the organization does not exist?
 * @param source
 */
const mapSite = (source: EnrollmentReportRow) => {
  return getManager().findOneOrFail(Site, { where: { name: source.siteName } });
};

/**
 * Create Child object from FlattenedEnrollment source.
 * TODO: How do we handle blocking data errors in a single row?
 * @param source
 */
const mapChild = (
  source: EnrollmentReportRow,
  organization: Organization,
  family: Family
) => {
  // Gender
  const gender: Gender =
    mapEnum(Gender, source.gender, true) || Gender.NotSpecified;

  // Special education services type
  const specialEducationServicesType: SpecialEducationServicesType = mapEnum(
    SpecialEducationServicesType,
    source.specialEducationServicesType
  );

  // TODO: Could do city/state verification here for birth cert location
  // TODO: Could do birthdate verification (post-20??)

  const child = getManager().create(Child, {
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
    hispanicOrLatinxEthnicity: source.hispanicOrLatinxEthnicity,
    gender,
    foster: source.foster || false,
    receivesC4K: source.receivesC4K || false,
    receivesSpecialEducationServices:
      source.receivesSpecialEducationServices || false,
    specialEducationServicesType,
    organization,
    family: family,
  });

  return getManager().save(child);
};

/**
 * Create Family object (with IncomeDetermination) from FlattenedEnrollment
 * source.
 * TODO: Lookup existing families before creating new one
 * @param source
 */
const mapFamily = (source: EnrollmentReportRow, organization: Organization) => {
  const family = getManager().create(Family, {
    streetAddress: source.streetAddress,
    town: source.town,
    state: source.state,
    zipcode: source.zipcode,
    homelessness: source.homelessness,
    organization,
  });

  return getManager().save(family);
};

/**
 * Create IncomeDetermination object from FlattenedEnrollment source.
 * @param source
 */
const mapIncomeDetermination = (
  source: EnrollmentReportRow,
  family: Family
) => {
  const incomeDetermination = getManager().create(IncomeDetermination, {
    numberOfPeople: source.numberOfPeople,
    income: source.income,
    determinationDate: source.determinationDate,
    familyId: family.id,
  });

  return getManager().save(incomeDetermination);
};

/**
 * Create Enrollment object from FlattenedEnrollment source,
 * for given site (already parsed from source).
 * @param source
 * @param site
 */
const mapEnrollment = (
  source: EnrollmentReportRow,
  site: Site,
  child: Child
) => {
  const ageGroup: AgeGroup = mapEnum(AgeGroup, source.ageGroup);

  const enrollment = getManager().create(Enrollment, {
    site,
    childId: child.id,
    ageGroup,
    entry: source.entry,
    exit: source.exit,
    exitReason: source.exitReason,
  });

  return getManager().save(enrollment);
};

/**
 * Create Funding object from FlattenedEnrollment source,
 * associated with a FundingSpace for given organization and ageGroup
 * (already parsed from source).
 * @param source
 * @param organization
 * @param ageGroup
 */
const mapFunding = async (
  source: EnrollmentReportRow,
  organization: Organization,
  enrollment: Enrollment
) => {
  const fundingSource: FundingSource = mapEnum(
    FundingSource,
    source.source
  );

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
    const fundingSpaces = await getManager().find(FundingSpace, {
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
        firstReportingPeriod = await getManager().findOne(ReportingPeriod, {
          where: { type: fundingSource, period: source.firstFundingPeriod },
        });
      }
      if (source.lastFundingPeriod) {
        lastReportingPeriod = await getManager().findOne(ReportingPeriod, {
          where: { type: fundingSource, period: source.lastFundingPeriod },
        });
      }
      const funding = getManager().create(Funding, {
        firstReportingPeriod,
        lastReportingPeriod,
        fundingSpace,
        enrollmentId: enrollment.id,
      });

      return getManager().save(funding);
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
    | typeof AgeGroup
    | typeof FundingSource
    | typeof FundingTime
    | typeof SpecialEducationServicesType,
  value: string | undefined,
  firstLetterComparison: boolean = false
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
    const normalizedRef = ref.replace(stripRegex, '').toLowerCase();
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
