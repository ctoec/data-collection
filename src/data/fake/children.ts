import { name, address, random } from 'faker';
import { Child, Family, Organization, Site } from '../../entity';
import {
  BirthCertificateType,
  Gender,
  RACE_FIELDS,
  UndefinableBoolean,
} from '../../../client/src/shared/models';
import { stagingUserAllowedOrganizations } from './organizations';
import { sitesByOrgName } from './sites';
import moment from 'moment';
import { makeFakeFamily } from './family';
import { getFakeIncomeDet } from './incomeDeterminations';
import { makeFakeEnrollments } from './enrollment';
import { getFakeFundingSpaces } from './fundingSpace';
import { getFakeFunding } from './funding';
import { weightedBoolean } from './utils';
import {
  getAllColumnMetadata,
  REQUIRED_IF_CHANGED_ENROLLMENT,
  REQUIRED_IF_CHANGED_ENROLLMENT_FUNDING,
  REQUIRED_IF_INCOME_DISCLOSED,
  REQUIRED_IF_US_BORN,
} from '../../template';
import { TEMPLATE_REQUIREMENT_LEVELS } from '../../../client/src/shared/constants';

const COLUMN_METADATA = getAllColumnMetadata();
const OPTIONAL_FIELDS = COLUMN_METADATA.filter(
  (col) => col.requirementLevel === TEMPLATE_REQUIREMENT_LEVELS.OPTIONAL
).map((optionalCol) => optionalCol.propertyName);

// Two different kinds of conditionals, so separate them to test on the
// appropriate kind of record (separating the historical records out
// makes this easier because then we won't use them all up testing the
// non-historical conditional fields)
const SINGLE_ENROLLMENT_CONDITIONAL_FIELDS = COLUMN_METADATA.filter(
  (col) =>
    col.requirementLevel === TEMPLATE_REQUIREMENT_LEVELS.CONDITIONAL &&
    (col.requirementString === REQUIRED_IF_US_BORN ||
      col.requirementString === REQUIRED_IF_INCOME_DISCLOSED)
);

const _organizations: Organization[] = stagingUserAllowedOrganizations.map(
  (o, i) => ({
    ...o,
    id: i,
    fundingSpaces: getFakeFundingSpaces({ ...o, id: i }),
    sites: [],
  })
);

const _sites: Site[] = [];

_organizations.forEach((o) =>
  sitesByOrgName[o.providerName].forEach((s) => {
    const newSite = {
      ...s,
      organization: o,
      organizationId: o.id,
      id: _sites.length + 1,
    };
    _sites.push(newSite);
    o.sites.push(newSite);
  })
);

const children: Child[] = Array.from({ length: 20 }, (_, i) => {
  const org = random.arrayElement(_organizations);
  return {
    id: '' + i,
    firstName: name.firstName(),
    lastName: name.lastName(),
    birthdate: moment().add(-random.number({ min: 6, max: 60 }), 'months'),
    birthCertificateType: BirthCertificateType.US,
    organization: org,
    organizationId: org.id,
    updateMetaData: { updatedAt: new Date() },
    deletedDate: null,
    family: {} as Family,
    foster: i ? UndefinableBoolean.No : UndefinableBoolean.Yes,
  };
});

random
  .arrayElements(children, 5)
  .forEach((c) => (c.birthCertificateType = BirthCertificateType.NonUS));
random
  .arrayElements(children, 5)
  .forEach((c) => (c.dualLanguageLearner = UndefinableBoolean.Yes));
random
  .arrayElements(children, 5)
  .forEach((c) => (c.receivesDisabilityServices = UndefinableBoolean.Yes));
random
  .arrayElements(children, 5)
  .forEach((c) => (c.hispanicOrLatinxEthnicity = UndefinableBoolean.Yes));
random
  .arrayElements(children, 5)
  .forEach((c) => (c.family.homelessness = UndefinableBoolean.Yes));

const possibleGenders = [Gender.Female, Gender.Male, Gender.Nonbinary];
function makeMiddleNameEdgeCases(num: number) {
  let _name = '';
  for (let i = 0; i < num; i++) {
    _name += ` ${name.firstName()}`;
  }
  return _name;
}
const possibleSuffixes = ['Jr', 'III', 'IV'];

const completeChildren: Child[] = children.map((c, i) => {
  const site = random.arrayElement(c.organization.sites);
  const isUSBirthCert = c.birthCertificateType === BirthCertificateType.US;
  const birthCertDetails = isUSBirthCert
    ? {
        birthTown: address.city(),
        birthState: weightedBoolean(80) ? 'CT' : address.stateAbbr(),
        birthCertificateId:
          random.number({ min: 10000000000, max: 99999999999 }) + '',
      }
    : {};
  const childRace = random
    .arrayElements(
      RACE_FIELDS,
      random.number({ min: 1, max: RACE_FIELDS.length - 1 })
    )
    .reduce((acc, race) => ({ ...acc, [race]: true }), {});

  const family = makeFakeFamily({ ...c.family, id: i });

  return {
    ...c,
    ...birthCertDetails,
    ...childRace,
    middleName: makeMiddleNameEdgeCases(
      weightedBoolean(10) ? 1 : random.number(3)
    ),
    suffix: weightedBoolean(10)
      ? random.arrayElement(possibleSuffixes)
      : undefined,
    sasid: random.number({ min: 1000000000, max: 9999999999 }) + '',
    gender: random.arrayElement(possibleGenders),
    family: {
      ...family,
      incomeDeterminations:
        c.foster === UndefinableBoolean.Yes
          ? [getFakeIncomeDet(i, family, true)]
          : [getFakeIncomeDet(i, family, false)],
    },
    enrollments: makeFakeEnrollments(i, c, site),
  } as Child;
});

// Iterate through, delete keys arbitrarily
const childrenMissingSomeInfo = completeChildren.map((c) => {
  if (random.boolean()) {
    const randomKey = random.arrayElement(Object.keys(c));
    return { ...c, [randomKey]: undefined };
  }
  return c;
});

const childrenMissingOptionalFields = OPTIONAL_FIELDS.map((property, idx) => {
  const testChild = completeChildren[idx];
  // Special case for homelessness, since although it's an optional
  // field, if it's omitted for a child that was generated with
  // homelessness = true, the child has no address so we need to
  // make one (because having neither address info nor homelessness
  // marked _should_ cause an error, and that's not the point of
  // this test)
  if (property === 'homelessness') {
    const newAddress = {
      streetAddress: address.streetAddress(),
      town: address.city(),
      state: 'CT',
      zipCode: address.zipCodeByState('CT'),
    };
    return {
      ...testChild,
      family: {
        ...testChild.family,
        ...newAddress,
      },
      [property]: undefined,
    };
  } else {
    return { ...testChild, [property]: undefined } as Child;
  }
});

const singleEnrollmentChildren = completeChildren.filter(
  (c) => c.enrollments.length <= 1
);
const historicalEnrollmentChildren = completeChildren.filter(
  (c) => c.enrollments.length > 1
);

// For these sets of children, the complete data covers the case where
// the conditional requirement is met. So we'll omit the conditionally
// required fields and expect errors.
const childrenMissingConditionalFields = SINGLE_ENROLLMENT_CONDITIONAL_FIELDS.map(
  (col, idx) => {
    const testChild = singleEnrollmentChildren[idx];
    // Use conditional type text to decide what fields to toggle
    // We'll use records with historical data for the other two conditionals
    if (col.requirementString === REQUIRED_IF_US_BORN) {
      return {
        ...testChild,
        birthCertificateType: BirthCertificateType.US,
        birthState: undefined,
        birthTown: undefined,
      } as Child;
    }
    if (col.requirementString === REQUIRED_IF_INCOME_DISCLOSED) {
      const newDet = getFakeIncomeDet(100, testChild.family, true);
      const family = {
        ...testChild.family,
        incomeDeterminations: [{ ...newDet, incomeNotDisclosed: false }],
      };
      // Need same correction with foster as we did with homeless
      // because that's not what this is testing
      return {
        ...testChild,
        foster: UndefinableBoolean.No,
        family: { ...family },
      } as Child;
    }
  }
);

// Remaining conditionals require historical enrollment:
// - REQUIRED_IF_CHANGED_ENROLLMENT
const changedEnrollmentRecord = historicalEnrollmentChildren[0];
let prevEnrollment = changedEnrollmentRecord.enrollments.find(
  (e) => e.exitReason
);
prevEnrollment = {
  ...prevEnrollment,
  exit: undefined,
  exitReason: undefined,
};
const otherEnrollments = changedEnrollmentRecord.enrollments.filter(
  (e) => !e.exit
);
childrenMissingConditionalFields.push({
  ...changedEnrollmentRecord,
  enrollments: [...otherEnrollments, prevEnrollment],
});

// - REQUIRED_IF_CHANGED_ENROLLMENT_FUNDING
let changedFundingRecord = historicalEnrollmentChildren[1];
const currentEnrollment = changedFundingRecord.enrollments.find(
  (e) => !e.exitReason
);
let oldFunding = getFakeFunding(
  99,
  currentEnrollment,
  changedFundingRecord.organization,
  true
);
oldFunding = { ...oldFunding, lastReportingPeriod: undefined };
const newFunding = getFakeFunding(
  100,
  currentEnrollment,
  changedFundingRecord.organization,
  false
);
const updatedEnrollment = {
  ...currentEnrollment,
  fundings: [newFunding, oldFunding],
};
childrenMissingConditionalFields.push({
  ...changedFundingRecord,
  enrollments: [updatedEnrollment],
});

// Delete one key from all children
// TODO: make this a func that takes a param for which key
const childrenAllMissingOneField = completeChildren.map((c) => {
  return { ...c, firstName: undefined };
});

export {
  completeChildren,
  childrenMissingSomeInfo,
  childrenAllMissingOneField,
  childrenMissingOptionalFields,
  childrenMissingConditionalFields,
};
