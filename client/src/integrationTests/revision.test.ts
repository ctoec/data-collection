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
    });
    afterAll(() => {
      enableFetchMocks();
    });
  });
});
