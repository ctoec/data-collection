import { disableFetchMocks, enableFetchMocks } from 'jest-fetch-mock';
import moment from 'moment';
import {
  Child,
  Family,
  IncomeDetermination,
  User,
  Organization,
} from '../shared/models';
import { apiDelete, apiGet, ApiOpts, apiPost, apiPut } from '../utils/api';

jest.mock('../utils/getCurrentHost');
import * as util from '../utils/getCurrentHost';
import { create } from 'domain';
import { createChild, createIncomeDetermination } from './utils';
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

      const user: User = await apiGet('users/current', '', TEST_OPTS);
      organization = user.organizations?.shift() as Organization;
    });

    afterAll(() => {
      enableFetchMocks();
    });

    describe('income determinations', () => {
      it('POST /:familyId/income-determinations', async () => {
        const { id: childId } = await createChild(organization);
        let child: Child = await apiGet(`children/${childId}`, '', TEST_OPTS);
        const familyId = child.family?.id as number;

        const newDet = {
          numberOfPeople: 13,
          income: 33773,
          determinationDate: moment(),
          family: { id: familyId },
        } as IncomeDetermination;

        const { id: newDetId } = await apiPost(
          `families/${familyId}/income-determinations`,
          newDet,
          TEST_OPTS
        );

        child = await apiGet(`children/${child.id}`, '', TEST_OPTS);
        const createdDet = child?.family?.incomeDeterminations?.find(
          (d) => d.id === newDetId
        );
        expect(createdDet).toBeDefined;
      });

      it('PUT /:familyId/income-determinations/:determinationId', async () => {
        const { id: childId } = await createChild(organization);
        let child: Child = await apiGet(`children/${childId}`, '', TEST_OPTS);
        const familyId = child.family?.id as number;
        const { id: detId } = await createIncomeDetermination(familyId);

        const newIncome = 33599;

        const res = await apiPut(
          `families/${familyId}/income-determinations/${detId}`,
          { income: newIncome },
          TEST_OPTS
        );
        expect(res.status).toEqual(200);

        child = await apiGet(`children/${child.id}`, '', TEST_OPTS);
        const updatedDet = child?.family?.incomeDeterminations?.find(
          (d) => d.id === detId
        );
        expect(updatedDet?.income).toEqual(newIncome);
      });

      it('DELETE /:familyId/income-determinations/:determinationId', async () => {
        const { id: childId } = await createChild(organization);
        let child: Child = await apiGet(`children/${childId}`, '', TEST_OPTS);
        const familyId = child.family?.id as number;
        const { id: detId } = await createIncomeDetermination(familyId);

        const res = await apiDelete(
          `families/${familyId}/income-determinations/${detId}`,
          TEST_OPTS
        );
        expect(res.status).toEqual(200);

        child = await apiGet(`children/${child.id}`, '', TEST_OPTS);

        const deletedDet = child?.family?.incomeDeterminations?.find(
          (d) => d.id === detId
        );
        expect(deletedDet).toBeUndefined;
      });
    });
  });
});
