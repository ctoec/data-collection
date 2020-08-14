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
} from '../../shared/models';
import { getManager } from 'typeorm';

export const mapFlattenedEnrollment = async (source: FlattenedEnrollment) => {
  try {
    const organization = await mapOrganization(source);
    // TODO: check org access
    const site = await mapSite(source);
    // TODO: check site access
    const child = mapChild(source);
    const family = mapFamily(source);
    const enrollment = await mapEnrollment(source, site);

    child.family = family;
    child.enrollments = [enrollment];

    return child;
  } catch (err) {
    console.error('Unable to map row: ', err);
    return;
  }
};

// TODO: How do we want to implement fuzzy matching here?
const mapOrganization = (source: FlattenedEnrollment) => {
  if (!source.provider) return Promise.reject('Provider is required');
  return getManager().findOneOrFail(Organization, {
    where: { name: source.provider },
  });
};

// TODO: How do we want to implement fuzzy matching here?
const mapSite = (source: FlattenedEnrollment) => {
  if (!source.site) return Promise.reject('Site is required');
  return getManager().findOneOrFail(Site, { where: { name: source.site } });
};

const mapChild = (source: FlattenedEnrollment) => {
  const SUFFIXES = ['sr', 'jr', 'ii', 'iii'];
  const nameParts = (source.name || '').split(' ');
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
  let gender = Gender.NotSpecified;
  if (source.gender) {
    Object.values(Gender).forEach((g) => {
      if (
        g.slice(0, 1).toLowerCase() === source.gender.slice(0, 1).toLowerCase()
      ) {
        gender = g;
      }
    });
  }
  // Could do city/state verification here for birth cert location
  // Could do birthdate verification (post-20??)

  return Object.assign(new Child(), {
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
    specialEducationServicesType: source.specialEducationServicesType,
  });
};

const mapFamily = (source: FlattenedEnrollment) => {
  const incomeDetermination = mapIncomeDetermination(source);
  return Object.assign(new Family(), {
    streetAddress: source.streetAddress,
    town: source.town,
    state: source.state,
    zip: source.zipcode,
    homelessness: source.experiencedHomelessnessOrHousingInsecurity,
    incomeDeterminations: [incomeDetermination],
  });
};

const mapIncomeDetermination = (source: FlattenedEnrollment) => {
  return Object.assign(new IncomeDetermination(), {
    numberOfPeople: source.householdSize,
    income: source.annualHouseholdIncome,
    determinationDate: source.incomeDeterminationDate,
  });
};

const mapEnrollment = async (source: FlattenedEnrollment, site: Site) => {
  let ageGroup;
  if (source.ageGroup) {
    Object.values(AgeGroup).forEach((a) => {
      if (a.toLowerCase() === source.ageGroup.toLowerCase()) {
        ageGroup = a;
      }
    });
  }

  const funding = await mapFunding(source, site.organization, ageGroup);
  return Object.assign(new Enrollment(), {
    site,
    ageGroup,
    entry: source.enrollmentStartDate,
    exit: source.enrollmentEndDate,
    exitReason: source.enrollmentExitReason,
    fundings: [funding],
  });
};

const mapFunding = async (
  source: FlattenedEnrollment,
  organization: Organization,
  ageGroup: AgeGroup
) => {
  let fundingSource;
  if (source.fundingType) {
    Object.values(FundingSource).forEach((fs) => {
      if (fs.toLowerCase() === source.fundingType.toLowerCase()) {
        fundingSource = fs;
      }
    });
  }

  let fundingTime;
  if (source.spaceType) {
    Object.values(FundingTime).forEach((ft) => {
      if (ft.toLowerCase() === source.spaceType.toLowerCase()) {
        fundingTime = ft;
      }
    });
  }

  if (fundingSource && fundingTime) {
    // Get the FundingSpace with associated funding source and funding time
    let fundingSpace;
    const fundingSpaces = await getManager().find(FundingSpace);
    fundingSpace = fundingSpaces.find((space) => space.time === fundingTime);

    // If no direct match on time and source === CDC, look for a split
    if (!fundingSpace && fundingSource === FundingSource.CDC) {
      fundingSpace = fundingSpaces.find(
        (space) => space.time === FundingTime.Split
      );
    }

    if (fundingSpace) {
      let firstReportingPeriod, lastReportingPeriod;
      if (source.firstFundingPeriod) {
        const [month, year] = source.firstFundingPeriod.split('/');
        firstReportingPeriod = await getManager().findOne(ReportingPeriod, {
          where: { type: fundingSource, period: `${year}-${month}-01` },
        });
      }
      if (source.lastFundingPeriod) {
        const [month, year] = source.lastFundingPeriod.split('/');
        lastReportingPeriod = await getManager().findOne(ReportingPeriod, {
          where: { type: fundingSource, period: `${year}-${month}-01` },
        });
      }
      return Object.assign(new Funding(), {
        firstReportingPeriod,
        lastReportingPeriod,
        fundingSpace,
      });
    }
  }

  // If we could not determine a fundingSpace, return nothing.
  // TODO: If the user supplied fundingType or spaceType, capture that
  // there was an error ingesting the funding info for this row so UI can
  // prompt user to fix it
  if (
    source.fundingType ||
    source.spaceType ||
    source.firstFundingPeriod ||
    source.lastFundingPeriod
  ) {
    console.log(
      "User tried to enter funding information but we couldn't figure it out"
    );
  }
};
