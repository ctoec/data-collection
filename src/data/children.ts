import { name, address, random } from 'faker';
import {
  Child,
  Funding,
  IncomeDetermination,
  Organization,
  Site,
} from '../entity';
import { BirthCertificateType, Gender } from '../../client/src/shared/models';
import { organizations } from './organizations';
import { sitesByOrgName } from './sites';
import moment from 'moment';
import { raceFields } from '../utils/raceFields';
import { makeFakeFamily } from './family';
import { getFakeIncomeDet } from './incomeDeterminations';
import { makeFakeEnrollment } from './enrollment';
import { getFakeFunding } from './funding';
import { getFakeFundingSpaces } from './fundingSpace';

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

const possibleBirthCertTypes = Object.values(BirthCertificateType);
const children: Child[] = Array.from({ length: 100 }, (_, i) => {
  const org = random.arrayElement(_organizations);
  return {
    id: '' + i,
    firstName: name.firstName(),
    lastName: name.lastName(),
    birthCertificateType: random.arrayElement(possibleBirthCertTypes),
    organization: org,
    organizationId: org.id,
    updateMetaData: { updatedAt: new Date() },
  };
});

const possibleGenders = Object.keys(Gender);
function makeMiddleNameEdgeCases(num: number) {
  let _name = '';
  for (let i = 0; i < num; i++) {
    _name += ` ${name.firstName()}`;
  }
  return _name;
}
const incompleteChildren: Child[] = children.slice(0, 50);
const completeChildren: Child[] = children.slice(50, 100).map((c, i) => {
  const site = random.arrayElement(c.organization.sites);
  const isUSBirthCert = c.birthCertificateType === BirthCertificateType.US;
  const birthCertDetails = isUSBirthCert
    ? {
        birthdate: moment().add(-Math.floor(Math.random() * 60), 'months'),
        birthTown: address.city(),
        birthState: address.stateAbbr(),
        birthCertificateId: '' + random.number(),
      }
    : {};
  const childRace = random.boolean()
    ? { notDisclosed: true }
    : random
        .arrayElements(raceFields, random.number(raceFields.length))
        .reduce((acc, race) => ({ ...acc, [race]: true }), {});

  const family = makeFakeFamily(i);

  const foster = random.boolean();
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
    hispanicOrLatinxEthnicity: random.boolean(),
    middleName: makeMiddleNameEdgeCases(random.number(3)),
    suffix: random.boolean() ? 'Jr' : undefined,
    sasid: random.boolean() ? random.uuid() : undefined,
    gender: random.arrayElement(possibleGenders) as Gender,
    dualLanguageLearner: random.boolean(),
    foster,
    receivesDisabilityServices: random.boolean(),
    family: {
      ...family,
      incomeDeterminations,
    },
    enrollments: [
      {
        ...enrollment,
        fundings,
      },
    ], // TODO
  };
});

const allChildren = [...incompleteChildren, ...completeChildren];

export { incompleteChildren, completeChildren, allChildren };
