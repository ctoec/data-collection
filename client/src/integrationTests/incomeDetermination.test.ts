import { disableFetchMocks, enableFetchMocks } from 'jest-fetch-mock';
import { ApiOpts } from '../utils/api';

jest.mock('../utils/getCurrentHost');
import * as util from '../utils/getCurrentHost';
const utilMock = util as jest.Mocked<typeof util>;

const TEST_OPTS: ApiOpts = {
  headers: { 'X-Test-No-Authenticate': 'true' },
  accessToken: '',
};

describe('integration', () => {
  describe('api', () => {
    beforeAll(async () => {
      disableFetchMocks();
      utilMock.getCurrentHost.mockReturnValue(
        process.env.API_TEST_HOST || 'http://localhost:5001'
      );
    });
    afterAll(() => {
      enableFetchMocks();
    });
    describe('income determinations', () => {
      it('PUT /:familyId/income-determinations/:determinationId', async () => {
      })
      it('POST /:familyId/income-determinations', async () => {
      })
      it('DELETE /:familyId/income-determinations/:determinationId', async () => {
      })
    })
  })
})