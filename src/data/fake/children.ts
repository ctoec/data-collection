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
import { weightedBoolean } from './utils';

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
    cascadeDeleteEnrollments: null,
    family: {} as Family,
    foster: i ? UndefinableBoolean.No : UndefinableBoolean.Yes
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
