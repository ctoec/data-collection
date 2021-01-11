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
    describe('oec-report', () => {
      it('GET /oec-report/:organizationId for unsubmitted org', async () => {
        const report = await apiGet(
          `oec-report/${organization.id}`,
          '',
          TEST_OPTS
        );
        expect(report.submitted).toBeFalsy();
      });
      it('POST /oec-report/:organizationId to submit for org', async () => {
        const res = await apiPost(
          `oec-report/${organization.id}`,
          undefined,
          TEST_OPTS
        );
        expect(res.status).toEqual(200);
      });
      it('GET /oec-report/:organizationId for submitted org', async () => {
        const report = await apiGet(
          `oec-report/${organization.id}`,
          '',
          TEST_OPTS
        );
        expect(report.submitted).toBeTruthy();
      });
    });
    afterAll(() => {
      enableFetchMocks();
    });
  });
});
