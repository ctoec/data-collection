import { disableFetchMocks, enableFetchMocks } from 'jest-fetch-mock';
import { apiGet, ApiOpts, apiPost } from '../utils/api';
import {
  AddSiteRequest,
  ChangeFundingSpaceRequest,
  Organization,
  UpdateSiteRequest,
  User,
} from '../shared/models';

jest.mock('../utils/getCurrentHost');
import * as util from '../utils/getCurrentHost';
const utilMock = util as jest.Mocked<typeof util>;

const TEST_OPTS: ApiOpts = {
  headers: { 'X-Test-No-Authenticate': 'true' },
  accessToken: '',
};

let SITE_NAME_CHANGES: UpdateSiteRequest[];
let ADD_SITE: AddSiteRequest[];
let FUNDING_SPACE_CHANGES: ChangeFundingSpaceRequest[];

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
        SITE_NAME_CHANGES = [
          {
            organizationId: organization.id,
            siteId: 1,
            newName: 'Gryffindor Childcare',
          } as UpdateSiteRequest,
          {
            organizationId: organization.id,
            siteId: 2,
            newName: 'Hufflepuff Childcare',
          } as UpdateSiteRequest,
          {
            organizationId: organization.id,
            siteId: 3,
            remove: true,
          } as UpdateSiteRequest,
        ];

        ADD_SITE = [
          {
            organizationId: organization.id,
            siteName: 'Ravenclaw Childcare',
            licenseId: '123456789',
            registryId: '987654321',
          } as AddSiteRequest,
        ];

        FUNDING_SPACE_CHANGES = [
          {
            organizationId: organization.id,
            fundingSpace: 'Infant/toddler - Child Day Care - Full time',
            shouldHave: true,
          } as ChangeFundingSpaceRequest,
          {
            organizationId: organization.id,
            fundingSpace: 'Preschool - State Head Start - Extended day',
            shouldHave: false,
          } as ChangeFundingSpaceRequest,
        ];

        const { status } = await apiPost(
          `revision-request/${organization.id}`,
          {
            updateSiteRequests: SITE_NAME_CHANGES,
            addSiteRequests: ADD_SITE,
            fundingSpaceRequests: FUNDING_SPACE_CHANGES,
          },
          { ...TEST_OPTS, jsonParse: false }
        );
        expect(status).toEqual(201);
      });

      // There's no actual way within the app to invoke the get for this route,
      // this test is just here to make sure we can retrieve the same information
      // from the DB that we sent (just a sanity check that everything saved)
      it('GET revision-request/update-sites/:organizationId', async () => {
        const siteRevisions = await apiGet(
          `revision-request/update-sites/${organization.id}`,
          '',
          TEST_OPTS
        );
        expect(siteRevisions.length).toBeGreaterThan(0);

        // Use find functions to identify requests that map to the ones we sent,
        // in case we run the tests more than once and the DB has lots of
        // requests in it
        const updateOne = siteRevisions.find(
          (elt: UpdateSiteRequest) => elt.siteId === SITE_NAME_CHANGES[0].siteId
        );
        expect(updateOne.newName).toEqual(SITE_NAME_CHANGES[0].newName);
        expect(updateOne.remove).toBeFalsy();
        const updateTwo = siteRevisions.find(
          (elt: UpdateSiteRequest) => elt.siteId === SITE_NAME_CHANGES[1].siteId
        );
        expect(updateTwo.newName).toEqual(SITE_NAME_CHANGES[1].newName);
        expect(updateTwo.remove).toBeFalsy();
        const updateThree = siteRevisions.find(
          (elt: UpdateSiteRequest) => elt.siteId === SITE_NAME_CHANGES[2].siteId
        );
        expect(updateThree.remove).toBeTruthy();
      });

      it('GET revision-request/add-sites/:organizationId', async () => {
        const siteAdditions = await apiGet(
          `revision-request/add-sites/${organization.id}`,
          '',
          TEST_OPTS
        );
        expect(siteAdditions.length).toBeGreaterThan(0);

        // Use find functions to identify requests that map to the ones we sent,
        // in case we run the tests more than once and the DB has lots of
        // requests in it
        const updateOne = siteAdditions.find(
          (elt: AddSiteRequest) => elt.registryId === ADD_SITE[0].registryId
        );
        expect(updateOne.siteName).toEqual(ADD_SITE[0].siteName);
        expect(updateOne.licenseId).toEqual(ADD_SITE[0].licenseId);
      });

      it('GET revision-request/change-funding-spaces/:organizationId', async () => {
        const fundingSpaceChanges = await apiGet(
          `revision-request/change-funding-spaces/${organization.id}`,
          '',
          TEST_OPTS
        );
        expect(fundingSpaceChanges.length).toBeGreaterThan(0);

        // Use find functions to identify requests that map to the ones we sent,
        // in case we run the tests more than once and the DB has lots of
        // requests in it
        const updateOne = fundingSpaceChanges.find(
          (elt: ChangeFundingSpaceRequest) =>
            elt.fundingSpace === FUNDING_SPACE_CHANGES[0].fundingSpace
        );
        expect(updateOne.shouldHave).toBeTruthy();
        const updateTwo = fundingSpaceChanges.find(
          (elt: ChangeFundingSpaceRequest) =>
            elt.fundingSpace === FUNDING_SPACE_CHANGES[1].fundingSpace
        );
        expect(updateTwo.remove).toBeFalsy();
      });
    });
    afterAll(() => {
      enableFetchMocks();
    });
  });
});
