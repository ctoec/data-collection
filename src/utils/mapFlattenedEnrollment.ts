import {
  FlattenedEnrollment,
  Child,
  Family,
  Site,
  Enrollment,
  IncomeDetermination,
  Funding,
  Organization,
  FundingSpace,
  ReportingPeriod,
} from '../entity';
import {
  Gender,
  AgeGroup,
  FundingSource,
  FundingTime,
  SpecialEducationServicesType,
} from '../../shared/models';
import { getManager } from 'typeorm';
import moment from 'moment';

/**
 * Creates Child, Family, IncomeDetermination, Enrollment, and Funding
 * from source FlattenedEnrollment.
 * Also looks up existing Organization and Site by name.
 *
 *
 * TODO: Implement some Org/Site access authorization layer.
 * When/where/how do we layer in internal app authorization?
 * @param source
 */
export const mapFlattenedEnrollment = async (source: FlattenedEnrollment) => {
  try {
    const organization = await mapOrganization(source);
    const site = await mapSite(source);
    const child = mapChild(source);
    const family = mapFamily(source);
    const incomeDetermination = mapIncomeDetermination(source);
    const enrollment = mapEnrollment(source, site, child);
    const funding = await mapFunding(source, organization, enrollment.ageGroup);

    return {
      organization,
      site,
      child,
      family,
      incomeDetermination,
      enrollment,
      funding,
    };
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
const mapOrganization = (source: FlattenedEnrollment) => {
  if (!source.provider) return Promise.reject('Provider is required');
  return getManager().findOneOrFail(Organization, {
    where: { name: source.provider },
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
const mapSite = (source: FlattenedEnrollment) => {
  if (!source.site) return Promise.reject('Site is required');
  return getManager().findOneOrFail(Site, { where: { name: source.site } });
};

/**
 * Create Child object from FlattenedEnrollment source.
 * TODO: How do we handle blocking data errors in a single row?
 * TODO: Also accept "Lastname, Firstname Middlename[,] Suffix" ?
 * @param source
 */
const mapChild = (source: FlattenedEnrollment) => {
  const SUFFIXES = ['sr', 'jr', 'ii', 'iii'];
  const normalizedName = source.name.trim().replace(/\s+/, ' ');
  const nameParts = (normalizedName || '').split(' ');
  if (nameParts.length < 2) {
    throw new Error(
      'Name is required, and must include at least first and last name separated by space'
    );
  }

  // Name
  let firstName, middleName, lastName, suffix;
  firstName = nameParts[0];
  if (nameParts.length === 2) {
    lastName = nameParts[1];
  } else if (nameParts.length === 4) {
    middleName = nameParts[1];
    lastName = nameParts[2];
    suffix = nameParts[3];
  } else {
    if (SUFFIXES.includes(nameParts[2].replace('.', '').toLowerCase())) {
      lastName = nameParts[1];
      suffix = nameParts[2];
    } else {
      middleName = nameParts[1];
      lastName = nameParts[2];
    }
  }

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

  return getManager().create(Child, {
    sasid: source.sasid,
    firstName,
    middleName,
    lastName,
    suffix,
    birthdate: source.dateOfBirth,
    birthTown: source.townOfBirth,
    birthState: source.stateOfBirth,
    birthCertificateId: source.birthCertificateId,
    americanIndianOrAlaskaNative: source.americanIndianOrAlaskaNative,
    asian: source.asian,
    blackOrAfricanAmerican: source.blackOrAfricanAmerican,
    nativeHawaiianOrPacificIslander: source.nativeHawaiianOrPacificIslander,
    white: source.white,
    hispanicOrLatinxEthnicity: source.hispanicOrLatinxEthnicity,
    gender,
    foster: source.livesWithFosterFamily,
    recievesC4K: source.receivingCareForKids,
    recievesSpecialEducationServices: source.receivingSpecialEducationServices,
    specialEducationServicesType,
  });
};

/**
 * Create Family object (with IncomeDetermination) from FlattenedEnrollment
 * source.
 * TODO: Lookup existing families before creating new one
 * @param source
 */
const mapFamily = (source: FlattenedEnrollment) => {
  return getManager().create(Family, {
    streetAddress: source.streetAddress,
    town: source.town,
    state: source.state,
    zip: source.zipcode,
    homelessness: source.experiencedHomelessnessOrHousingInsecurity,
  });
};

/**
 * Create IncomeDetermination object from FlattenedEnrollment source.
 * @param source
 */
const mapIncomeDetermination = (source: FlattenedEnrollment) => {
  return getManager().create(IncomeDetermination, {
    numberOfPeople: source.householdSize,
    income: source.annualHouseholdIncome,
    determinationDate: source.incomeDeterminationDate,
  });
};

/**
 * Create Enrollment object from FlattenedEnrollment source,
 * for given site (already parsed from source).
 * @param source
 * @param site
 */
const mapEnrollment = (
  source: FlattenedEnrollment,
  site: Site,
  child: Child
) => {
  const ageGroup: AgeGroup = mapEnum(AgeGroup, source.ageGroup);

  return getManager().create(Enrollment, {
    siteId: site.id,
    childId: child.id,
    ageGroup,
    entry: source.enrollmentStartDate,
    exit: source.enrollmentEndDate,
    exitReason: source.enrollmentExitReason,
  });
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
  source: FlattenedEnrollment,
  organization: Organization,
  ageGroup: AgeGroup
) => {
  const fundingSource: FundingSource = mapEnum(
    FundingSource,
    source.fundingType
  );
  const fundingTime: FundingTime = mapEnum(FundingTime, source.spaceType);

  // Cannot create funding without FundingSpace, and cannot find FundingSpace
  // without fundingSource AND fundingTime, so if you don't have them
  // MOVE ALONG
  if (fundingSource && fundingTime) {
    // Get the FundingSpace with associated funding source and agegroup for the given organization
    let fundingSpace: FundingSpace;
    const fundingSpaces = await getManager().find(FundingSpace, {
      where: { source: fundingSource, ageGroup, organization },
    });
    fundingSpace = fundingSpaces.find((space) => space.time === fundingTime);

    // If no direct match on time and source === CDC, look for a split
    if (!fundingSpace && fundingSource === FundingSource.CDC) {
      fundingSpace = fundingSpaces.find(
        (space) => space.time === FundingTime.Split
      );
    }

    // Cannot create funding without FundingSpace, so if you don't have one
    // MOVE ALONG
    if (fundingSpace) {
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
      return getManager().create(Funding, {
        firstReportingPeriod,
        lastReportingPeriod,
        fundingSpace,
      });
    }
  }

  // If we could not find a fundingSpace, we cannot create a funding
  // so NOTHING is returned.
  if (
    source.fundingType ||
    source.spaceType ||
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
  const normalizedValue = value.trim().replace(stripRegex, '').toLowerCase();
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
