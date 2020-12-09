import { name, address, random } from 'faker';
import { Child, Organization, Site } from '../../entity';
import {
  BirthCertificateType,
  Gender,
  RACE_FIELDS,
} from '../../client/src/shared/models';
import { stagingUserAllowedOrganizations } from './organizations';
import { sitesByOrgName } from './sites';
import moment from 'moment';
import { makeFakeFamily } from './family';
import { getFakeIncomeDet } from './incomeDeterminations';
import { makeFakeEnrollments } from './enrollment';
import { getFakeFundingSpaces } from './fundingSpace';
import { weightedBoolean, weightedUndefinableBoolean } from './fakeDataUtils';

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
  sitesByOrgName[o.providerName].forEach((s, i) => {
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

const children: Child[] = Array.from({ length: 100 }, (_, i) => {
  const org = random.arrayElement(_organizations);
  return {
    id: '' + i,
    firstName: name.firstName(),
    lastName: name.lastName(),
    birthCertificateType: weightedBoolean(8)
      ? BirthCertificateType.NonUS
      : BirthCertificateType.US, // Arbitrary, would be better based on actual frequency in data
    birthdate: moment().add(-random.number({ min: 6, max: 60 }), 'months'),
    organization: org,
    organizationId: org.id,
    updateMetaData: { updatedAt: new Date() },
    deletedDate: null,
    cascadeDeleteEnrollments: null,
  };
});

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
        birthState: weightedBoolean(90) ? 'CT' : address.stateAbbr(),
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

  const family = makeFakeFamily(i);
  const foster = weightedUndefinableBoolean(5);

  return {
    ...c,
    ...birthCertDetails,
    ...childRace,
    hispanicOrLatinxEthnicity: weightedUndefinableBoolean(30), // No idea if this is representative
    middleName: makeMiddleNameEdgeCases(
      weightedBoolean(10) ? 1 : random.number(3)
    ),
    suffix: weightedBoolean(5)
      ? random.arrayElement(possibleSuffixes)
      : undefined,
    sasid: random.number({ min: 1000000000, max: 9999999999 }) + '',
    gender: random.arrayElement(possibleGenders),
    dualLanguageLearner: weightedUndefinableBoolean(10), // No idea if this is representative
    foster,
    receivesDisabilityServices: weightedUndefinableBoolean(5),
    family: {
      ...family,
      incomeDeterminations: foster ? [] : [getFakeIncomeDet(i, family)],
    },
    enrollments: makeFakeEnrollments(i, c, site),
    cascadeDeleteEnrollments: null,
  } as Child;
});

// Iterate through, delete keys arbitrarily
const childrenMissingSomeInfo = completeChildren.map((c) => {
  if (random.boolean()) {
    const randomKey = random.arrayElement(
      Object.keys(c).filter((k) => k != 'cascadeDeleteEnrollments')
    );
    return { ...c, [randomKey]: undefined, cascadeDeleteEnrollments: null };
  }
  return c;
});

// Delete one key from all children
// TODO: make this a func that takes a param for which key
const childrenAllMissingOneField = completeChildren.map((c) => {
  return { ...c, firstName: undefined, cascadeDeleteEnrollments: null };
});

export {
  completeChildren,
  childrenMissingSomeInfo,
  childrenAllMissingOneField,
};