import { seed, name, address, random } from 'faker';
import {
  Child,
  Funding,
  IncomeDetermination,
  Organization,
  Site,
} from '../entity';
import {
  BirthCertificateType,
  Gender,
  RACE_FIELDS,
} from '../../client/src/shared/models';
import { organizations } from './organizations';
import { sitesByOrgName } from './sites';
import moment from 'moment';
import { makeFakeFamily } from './family';
import { getFakeIncomeDet } from './incomeDeterminations';
import { makeFakeEnrollment } from './enrollment';
import { getFakeFunding } from './funding';
import { getFakeFundingSpaces } from './fundingSpace';
import { weightedBoolean } from './fakeDataUtils';


// So we get consistent results
seed(123);

const _organizations: Organization[] = organizations.map((o, i) => ({
  ...o,
  id: i,
  fundingSpaces: getFakeFundingSpaces({ ...o, id: i }),
  sites: [],
}));

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
    birthCertificateType: weightedBoolean(8) ? BirthCertificateType.nonUS : BirthCertificateType.US, // Arbitrary, would be better based on actual frequency in data
    birthdate: moment().add(-Math.floor(Math.random() * 60), 'months'),
    organization: org,
    organizationId: org.id,
    updateMetaData: { updatedAt: new Date() },
  };
});

const genderCopy = { ...Gender };
delete genderCopy.NotSpecified;
const possibleGenders = Object.keys(genderCopy);
function makeMiddleNameEdgeCases(num: number) {
  let _name = '';
  for (let i = 0; i < num; i++) {
    _name += ` ${name.firstName()}`;
  }
  return _name;
}
const possibleSuffixes = ['Jr', 'III', 'IV'];
const incompleteChildren: Child[] = children.slice(0, 50);
const completeChildren: Child[] = children.slice(50, 100).map((c, i) => {
  const site = random.arrayElement(c.organization.sites);
  const isUSBirthCert = c.birthCertificateType === BirthCertificateType.US;
  const birthCertDetails = isUSBirthCert
    ? {
      birthTown: address.city(),
      birthState: weightedBoolean(90) ? 'CT' : address.stateAbbr(),
      birthCertificateId: random.number({ min: 10000000000, max: 99999999999 }) + '',
    }
    : {};
  const childRace = random
    .arrayElements(RACE_FIELDS, random.number({ min: 1, max: RACE_FIELDS.length - 1 }))
    .reduce((acc, race) => ({ ...acc, [race]: true }), {});

  const family = makeFakeFamily(i);

  const foster = weightedBoolean(5);
  const incomeDeterminations: IncomeDetermination[] = foster
    ? []
    : [getFakeIncomeDet(i, family)];

  const enrollment = makeFakeEnrollment(i, c, site);

  const fundings: Funding[] = [
    getFakeFunding(i, enrollment, site.organization),
  ];

  return {
    ...c,
    ...birthCertDetails,
    ...childRace,
    hispanicOrLatinxEthnicity: weightedBoolean(30), // No idea if this is representative
    middleName: makeMiddleNameEdgeCases(random.number(3)),
    suffix: weightedBoolean(5) ? random.arrayElement(possibleSuffixes) : undefined,
    sasid: random.number({ min: 1000000000, max: 9999999999 }) + '',
    gender: random.arrayElement(possibleGenders) as Gender,
    dualLanguageLearner: weightedBoolean(10), // No idea if this is representative
    foster,
    receivesDisabilityServices: weightedBoolean(5),
    family: {
      ...family,
      incomeDeterminations,
    },
    enrollments: [
      {
        ...enrollment,
        fundings,
      },
    ],
  };
});

// TODO: add a few changed enrollment kids

const allChildren = [...incompleteChildren, ...completeChildren];

export { incompleteChildren, completeChildren, allChildren };
