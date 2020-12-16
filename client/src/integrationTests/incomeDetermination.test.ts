import { disableFetchMocks, enableFetchMocks } from 'jest-fetch-mock';
import { Child, Family } from '../shared/models';
import { apiGet, ApiOpts, apiPut } from '../utils/api';

jest.mock('../utils/getCurrentHost');
import * as util from '../utils/getCurrentHost';
const utilMock = util as jest.Mocked<typeof util>;

const TEST_OPTS: ApiOpts = {
  headers: { 'X-Test-No-Authenticate': 'true' },
  accessToken: '',
};

describe('integration', () => {
  describe('api', async () => {
    const children: Child[] = await apiGet('children', '', TEST_OPTS);
    const childWithDets = children.find(c => !!c.family?.incomeDeterminations?.length);
    const { family } = childWithDets || {};
    const incomeDet = family?.incomeDeterminations?.[0];

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
        if (!family || !incomeDet) throw new Error('no income det to update');
        const newIncome = 62289;

        const res = await apiPut(`/families/${family.id}/income-determinations/${incomeDet.id}`, { ...incomeDet, income: 62289 }, TEST_OPTS)
        expect(res.status).toEqual(200);

        const updatedFamily: Family = await apiGet(`/families/${family.id}`, '', TEST_OPTS)
        const updatedDet = updatedFamily?.incomeDeterminations?.find(d => d.id === incomeDet.id)
        expect(updatedDet?.income).toEqual(newIncome);
      })
      it('POST /:familyId/income-determinations', async () => {
        if (!family) throw new Error('no family');

      })
      it('DELETE /:familyId/income-determinations/:determinationId', async () => {
        // DO THESE RUN IN ORDER, OR DO WE NEED A DIFF DET TO DELETE?
        if (!family || !incomeDet) throw new Error('no income det to delete');

      })
    })
  })
})