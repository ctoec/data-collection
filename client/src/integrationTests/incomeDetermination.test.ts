import { disableFetchMocks, enableFetchMocks } from 'jest-fetch-mock';
import moment from 'moment';
import { Child, Family, IncomeDetermination } from '../shared/models';
import { apiDelete, apiGet, ApiOpts, apiPost, apiPut } from '../utils/api';

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
    const childrenWithDets = children.filter(
      (c) => !!c.family?.incomeDeterminations?.length
    );

    // Used for update and create income dets
    const childToUpdate = childrenWithDets[0];
    const { family: familyToUpdate } = childToUpdate || {};
    const detToUpdate = familyToUpdate?.incomeDeterminations?.[0];

    // Used for delete income det
    const childToDeleteFrom = childrenWithDets[1];
    const { family: familyToDeleteFrom } = childToDeleteFrom || {};
    const detToDelete = familyToDeleteFrom?.incomeDeterminations?.[0];

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
        if (!familyToUpdate || !detToUpdate)
          throw new Error('no income det to update');
        const newIncome = 33599;

        const res = await apiPut(
          `families/${familyToUpdate.id}/income-determinations/${detToUpdate.id}`,
          { ...detToUpdate, income: newIncome },
          TEST_OPTS
        );
        expect(res.status).toEqual(200);

        const updatedFamily: Family = await apiGet(
          `families/${familyToUpdate.id}`,
          '',
          TEST_OPTS
        );
        const updatedDet = updatedFamily?.incomeDeterminations?.find(
          (d) => d.id === detToUpdate.id
        );
        expect(updatedDet?.income).toEqual(newIncome);
      });
      it('POST /:familyId/income-determinations', async () => {
        if (!familyToUpdate) throw new Error('no family to add income det to');
        const newDet = {
          numberOfPeople: 13,
          income: 33773,
          determinationDate: moment(),
          family: familyToUpdate,
        } as IncomeDetermination;

        const res = await apiPost(
          `families/${familyToUpdate.id}/income-determinations`,
          newDet,
          TEST_OPTS
        );
        expect(res.status).toEqual(200);

        const updatedFamily: Family = await apiGet(
          `families/${familyToUpdate.id}`,
          '',
          TEST_OPTS
        );
        const createdDet = updatedFamily?.incomeDeterminations?.find(
          (d) => d.income === newDet.income
        );
        expect(createdDet).toBeDefined;
      });
      it('DELETE /:familyId/income-determinations/:determinationId', async () => {
        // DO THESE RUN IN ORDER, OR DO WE NEED A DIFF DET TO DELETE?
        if (!familyToDeleteFrom || !detToDelete)
          throw new Error('no income det to delete');
        const res = await apiDelete(
          `families/${familyToDeleteFrom.id}/income-determinations/${detToDelete.id}`
        );
        expect(res.status).toEqual(200);

        const updatedFamily: Family = await apiGet(
          `families/${familyToDeleteFrom.id}`,
          '',
          TEST_OPTS
        );

        const deletedDet = updatedFamily?.incomeDeterminations?.find(
          (d) => d.id === detToDelete.id
        );
        expect(deletedDet).toBeUndefined;
      });
    });
  });
});
