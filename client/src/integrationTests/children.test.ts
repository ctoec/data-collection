import { disableFetchMocks, enableFetchMocks } from 'jest-fetch-mock';
import { apiGet, apiPost, ApiOpts } from '../utils/api';

jest.mock('../utils/getCurrentHost');
import * as util from '../utils/getCurrentHost';
import {
  Child,
  Organization,
  User,
  Site,
  BirthCertificateType,
} from '../shared/models';
import moment from 'moment';
const utilMock = util as jest.Mocked<typeof util>;

const TEST_OPTS: ApiOpts = {
  headers: { 'X-Test-No-Authenticate': 'true' },
  accessToken: '',
};

let ALLOWED_ORGS: Organization[];

describe('integration', () => {
  describe('api', () => {
    beforeAll(async () => {
      disableFetchMocks();
      utilMock.getCurrentHost.mockReturnValue(
        process.env.API_TEST_HOST || 'http://localhost:5001'
      );

      const thisUser: User = await apiGet('/users/current', '', TEST_OPTS);
      ALLOWED_ORGS = thisUser.organizations as Organization[];
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

      it('GET /children?organizationId', async () => {
        const orgId = ALLOWED_ORGS[0].id;
        const children: Child[] = await apiGet(
          `children?organizationId=${orgId}`,
          '',
          TEST_OPTS
        );
        expect(children.every((child) => child.organization.id === orgId));
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
        const newChild = {
          firstName: 'AllowedNewChild',
          lastName: 'FromIntegrationTest',
          birthCertificateType: BirthCertificateType.Unavailable,
          birthdate: moment('06-22-2019', ['MM-DD-YYYY']),
          organization: { id: ALLOWED_ORGS[0].id } as Organization,
        } as Child;

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
        const newChild = {
          firstName: 'DisallowedNewChild',
          lastName: 'FromIntegrationTest',
          organization: { id: 1000000000000000000000 } as Organization,
        } as Child;

        expect(apiPost('children', newChild, TEST_OPTS)).rejects.toMatch(
          'Child information not saved'
        );
      });
    });
    afterAll(() => {
      enableFetchMocks();
      jest.resetAllMocks();
    });
  });
});
