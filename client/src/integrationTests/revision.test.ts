import { disableFetchMocks, enableFetchMocks } from 'jest-fetch-mock';
import { apiGet, ApiOpts, apiPost } from '../utils/api';
import { Organization, Revision, User } from '../shared/models';

jest.mock('../utils/getCurrentHost');
import * as util from '../utils/getCurrentHost';
const utilMock = util as jest.Mocked<typeof util>;

const TEST_OPTS: ApiOpts = {
  headers: { 'X-Test-No-Authenticate': 'true' },
  accessToken: '',
};

const SITE_NAME_CHANGES = [
  'CHANGE Gryffindor Childcare TO Slytherin Childcare',
  'CHANGE Hufflepuff Childcare TO Ravenclaw Childcare',
  'REMOVE Diagon Alley Funzone',
];
const NEW_SITE_NAME = 'Nockturn Alley School for Dark Wizards';
const NEW_SITE_LICENSE = '123456789';
const NEW_SITE_NO_NAEYC = true;
const NEW_SITE_REGISTRY = '321654987';
const FUNDING_SPACE_TYPES = [
  'Child Day Care - Full Time',
  'Child Day Care - Part Time/Full Time',
  'Child Day Care - Part Time/Full Time',
  'School Readiness - Full Day',
  'School Readiness - School Day',
  'Child Day Care - Part Time/Full Time',
];

let ALLOWED_ORGS: Organization[];
describe('integration', () => {
  describe('api', () => {
    let organization: Organization;
    beforeAll(async () => {
      disableFetchMocks();
      utilMock.getCurrentHost.mockReturnValue(
        process.env.API_TEST_HOST || 'http://localhost:5001'
      );

      const user: User = await apiGet('/users/current', '', TEST_OPTS);
      ALLOWED_ORGS = user.organizations as Organization[];
      organization = ALLOWED_ORGS[0];
    });
    describe('revision-request/:organizationId', () => {
      it('POST revision-request/:organizationId to send a revision request object', async () => {
        const revisionRequest = {
          siteNameChanges: SITE_NAME_CHANGES,
          newSiteName: NEW_SITE_NAME,
          newSiteLicense: NEW_SITE_LICENSE,
          newSiteNoNaeyc: NEW_SITE_NO_NAEYC,
          newSiteRegistryId: NEW_SITE_REGISTRY,
          fundingSpaceTypes: FUNDING_SPACE_TYPES,
        } as Revision;
        const { id } = await apiPost(
          `revision-request/${organization.id}`,
          revisionRequest,
          TEST_OPTS
        );
        expect(id).not.toBeUndefined();
      });
      it('GET revision-request/:organizationId for posted revision request', async () => {
        const revisions = await apiGet(
          `revision-request/${organization.id}`,
          '',
          TEST_OPTS
        );
        expect(revisions.length).toBeGreaterThan(0);
        expect(revisions[0].siteNameChanges).toEqual(SITE_NAME_CHANGES);
        expect(revisions[0].newSiteName).toEqual(NEW_SITE_NAME);
        expect(revisions[0].newSiteNoNaeyc).toBeTruthy();
        expect(revisions[0].newSiteRegistryId).toEqual(NEW_SITE_REGISTRY);
        revisions[0].fundingSpaceTypes.forEach((fst: string, i: number) => {
          expect(fst).toEqual(FUNDING_SPACE_TYPES[i]);
        });
      });
    });
    afterAll(() => {
      enableFetchMocks();
    });
  });
});
