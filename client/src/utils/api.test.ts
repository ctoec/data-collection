import { apiGet, apiPost, ApiOpts } from './api';
import { disableFetchMocks } from 'jest-fetch-mock';

disableFetchMocks();
jest.mock('./getCurrentHost');
import * as util from './getCurrentHost';
import { Child, Organization } from '../shared/models';
const utilMock = util as jest.Mocked<typeof util>;

const TEST_OPTS: ApiOpts = {
  headers: { 'X-Test-No-Authenticate': 'true' },
  accessToken: '',
};

describe('integration', () => {
  describe('api', () => {
    beforeAll(() => {
      utilMock.getCurrentHost.mockReturnValue(
        process.env.API_TEST_HOST || 'http://localhost:5001'
      );
    });
    describe('children', () => {
      let children: Child[];
      it('GET /children', async () => {
        children = await apiGet('children', '', TEST_OPTS);
        expect(children).not.toHaveLength(0);
      });

      it('GET /children?count=true', async () => {
        if (!children?.length) throw new Error('no children');

        const { count } = await apiGet('children?count=true', '', TEST_OPTS);
        expect(count).toEqual(children.length);
      });

      it('GET /children?missing-info=true', async () => {
        const missingInfoChildren: Child[] = await apiGet(
          'children?missing-info=true',
          '',
          TEST_OPTS
        );
        missingInfoChildren.forEach((child) => {
          expect(child.validationErrors).not.toBeUndefined;
          expect(child.validationErrors).not.toHaveLength(0);
        });
      });

      it('GET /children?month=MMM-YYYY', async () => {
        const childWithEnrollment = children?.find(
          (child) => child.enrollments?.length
        );
        if (!childWithEnrollment) throw new Error('no child with enrollments');

        const anActiveMonth = childWithEnrollment.enrollments?.find(
          (enrollment) => enrollment.entry
        )?.entry;
        if (!anActiveMonth) throw new Error('no child with active enrollment');

        const activeInMonthChildren: Child[] = await apiGet(
          `children?month=${anActiveMonth.format('MMM-YYYY')}`,
          '',
          TEST_OPTS
        );
        activeInMonthChildren.forEach((child) => {
          expect(child.enrollments).not.toBeUndefined;
          expect(child.enrollments).not.toHaveLength(0);
          expect(
            child.enrollments?.every((enrollment) =>
              enrollment.entry?.isSameOrBefore(anActiveMonth.endOf('month'))
            )
          ).toBeTruthy;
        });
      });
      let child: Child;
      it('POST /children for allowed org', async () => {
        if (!children?.length) throw new Error('no children');
        const newChild = {
          ...children[0],
          firstName: 'AllowedNewChild',
          lastName: 'FromIntegrationTest',
        };
        const { id } = await apiPost('children', newChild, TEST_OPTS);
        expect(id).not.toBeUndefined;
        newChild.id = id;
        child = newChild;
      });

      it('GET /children/id', async () => {
        if (!child) throw new Error('no child');

        const getChild = await apiGet(`children/${child.id}`, '', TEST_OPTS);
        expect(getChild.id).toEqual(child.id);
        expect(getChild.firstName).toEqual(child.firstName);
        expect(getChild.lastName).toEqual(child.lastName);
      });

      it('POST /children for disallowed org', async () => {
        if (!children?.length) throw new Error('no children');
        const newChild = {
          ...children[0],
          firstName: 'DisallowedNewChild',
          lastName: 'FromIntegrationTest',
          organization: { id: 1000000000000000000000 } as Organization,
        };

        expect(apiPost('children', newChild, TEST_OPTS)).rejects.toMatch(
          'Child information not saved'
        );
      });
    });
    afterAll(() => jest.resetAllMocks());
  });
});
