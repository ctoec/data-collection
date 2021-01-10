import { disableFetchMocks, enableFetchMocks } from 'jest-fetch-mock';
import { apiGet, apiPost, ApiOpts } from '../utils/api';
import { Organization, User } from '../shared/models';

jest.mock('../utils/getCurrentHost');
import * as util from '../utils/getCurrentHost';
const utilMock = util as jest.Mocked<typeof util>;

const TEST_OPTS: ApiOpts = {
  headers: { 'X-Test-No-Authenticate': 'true' },
  accessToken: '',
};

describe('integration', () => {
  describe('api', () => {
    let organization: Organization;
    beforeAll(async () => {
      disableFetchMocks();
      utilMock.getCurrentHost.mockReturnValue(
        process.env.API_TEST_HOST || 'http://localhost:5001'
      );

      const user: User = await apiGet('/users/current', '', TEST_OPTS);
      organization = user?.organizations?.shift() as Organization;
    });
    afterAll(() => {
      enableFetchMocks();
    });
    describe('oecReport', () => {
      it('GET /oecReport/:organizationId for fresh org', async () => {
        const report = await apiGet(
          `oecReport/${organization.id}`,
          '',
          TEST_OPTS
        );
        expect(report).toBeFalsy();
      });
      it('POST /oecReport/:organizationId to submit for org', async () => {
        const res = await apiPost(
          `oecReport/${organization.id}`,
          undefined,
          TEST_OPTS
        );
        expect(res.status).toEqual(200);
      });
      it('GET /oecReport/:organizationId for submitted org', async () => {
        const report = await apiGet(
          `oecReport/${organization.id}`,
          '',
          TEST_OPTS
        );
        expect(report).toBeTruthy();
      });
    });
  });
});
