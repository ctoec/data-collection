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
  describe('api', () => {
    // Used for update and create income dets
    let childToUpdate: Child | undefined;
    let familyToUpdate: Family | undefined;
    let detToUpdate: IncomeDetermination | undefined;

    // Used for delete income det
    let childToDeleteFrom: Child | undefined;
    let familyToDeleteFrom: Family | undefined;
    let detToDelete: IncomeDetermination | undefined;

    beforeAll(async () => {
      disableFetchMocks();
      utilMock.getCurrentHost.mockReturnValue(
        process.env.API_TEST_HOST || 'http://localhost:5001'
      );
      const children: Child[] = await apiGet('children', '', TEST_OPTS);
      const childrenWithDets = (children || []).filter(
        (c) => !!c.family?.incomeDeterminations?.length
      );

      childToUpdate = childrenWithDets[0];
      familyToUpdate = childToUpdate.family;
      detToUpdate = familyToUpdate?.incomeDeterminations?.[0];

      childToDeleteFrom = childrenWithDets[1];
      familyToDeleteFrom = childToDeleteFrom.family;
      detToDelete = familyToDeleteFrom?.incomeDeterminations?.[0];
    });

    afterAll(() => {
      enableFetchMocks();
    });

    describe('income determinations', () => {
      it('PUT /:familyId/income-determinations/:determinationId', async () => {
        if (!childToUpdate || !familyToUpdate || !detToUpdate)
          throw new Error('no income det to update');

        const newIncome = 33599;

        const res = await apiPut(
          `families/${familyToUpdate.id}/income-determinations/${detToUpdate.id}`,
          { ...detToUpdate, income: newIncome },
          TEST_OPTS
        );
        expect(res.status).toEqual(200);

        const updatedChild: Child = await apiGet(
          `children/${childToUpdate.id}`,
          '',
          TEST_OPTS
        );
        const updatedDet = updatedChild?.family?.incomeDeterminations?.find(
          (d) => d.id === detToUpdate?.id
        );
        expect(updatedDet?.income).toEqual(newIncome);
      });

      it('POST /:familyId/income-determinations', async () => {
        if (!childToUpdate || !familyToUpdate || !detToUpdate)
          throw new Error('no family to add income det to');

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
        expect(res.id).toBeGreaterThan(detToUpdate?.id);

        const updatedChild: Child = await apiGet(
          `children/${childToUpdate.id}`,
          '',
          TEST_OPTS
        );
        const createdDet = updatedChild?.family?.incomeDeterminations?.find(
          (d) => d.income === newDet.income
        );
        expect(createdDet).toBeDefined;
      });

      it('DELETE /:familyId/income-determinations/:determinationId', async () => {
        if (!childToDeleteFrom || !familyToDeleteFrom || !detToDelete)
          throw new Error('no income det to delete');
        const res = await apiDelete(
          `families/${familyToDeleteFrom.id}/income-determinations/${detToDelete.id}`,
          TEST_OPTS
        );
        expect(res.status).toEqual(200);

        const updatedChild: Child = await apiGet(
          `children/${childToDeleteFrom.id}`,
          '',
          TEST_OPTS
        );

        const deletedDet = updatedChild?.family?.incomeDeterminations?.find(
          (d) => d.id === detToDelete?.id
        );
        expect(deletedDet).toBeUndefined;
      });
    });
  });
});
