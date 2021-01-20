import { disableFetchMocks, enableFetchMocks } from 'jest-fetch-mock';
import { apiGet, apiPost, ApiOpts, apiPut } from '../utils/api';
import {
  Child,
  Organization,
  User,
  BirthCertificateType,
  Site,
} from '../shared/models';
import moment from 'moment';

jest.mock('../utils/getCurrentHost');
import * as util from '../utils/getCurrentHost';
import { createChild, createEnrollment } from './utils';
const utilMock = util as jest.Mocked<typeof util>;

const TEST_OPTS: ApiOpts = {
  headers: { 'X-Test-No-Authenticate': 'true' },
  accessToken: '',
};

describe('integration', () => {
  describe('api', () => {
    let organization: Organization;
    let site: Site;
    beforeAll(async () => {
      disableFetchMocks();
      utilMock.getCurrentHost.mockReturnValue(
        process.env.API_TEST_HOST || 'http://localhost:5001'
      );

      const user: User = await apiGet('/users/current', '', TEST_OPTS);
      organization = user?.organizations?.shift() as Organization;
      site = user?.sites?.find(
        (s) => s.organizationId === organization.id
      ) as Site;
    });
    describe('children', () => {
      let children: Child[];
      it('GET /children', async () => {
        // Create child so there's at least one
        await createChild(organization);

        children = await apiGet('children', '', TEST_OPTS);
        expect(children).not.toHaveLength(0);
      });

      it('GET /children?count=true', async () => {
        const { count } = await apiGet('children?count=true', '', TEST_OPTS);
        expect(count).toEqual(children.length);
      });

      it('GET /children?organizationId', async () => {
        const children: Child[] = await apiGet(
          `children?organizationId=${organization.id}`,
          '',
          TEST_OPTS
        );
        expect(
          children.every((child) => child.organization.id === organization.id)
        );
      });

      it('GET /children?missing-info=true', async () => {
        const missingInfoChildren: Child[] = await apiGet(
          'children?missing-info=true',
          '',
          TEST_OPTS
        );
        missingInfoChildren.forEach((child) => {
          expect(child.validationErrors).not.toBeUndefined();
          expect(child.validationErrors).not.toHaveLength(0);
        });
      });

      it('GET /children?month=MMM-YYYY', async () => {
        // Create child and enrollment
        const { id: childId } = await createChild(organization);
        await createEnrollment(childId, site);
        // by default, enrollment is created with start date 09/01/2020
        const activeMonth = moment('2020-08-01', 'YYYY-MM-DD');
        const activeInMonthChildren: Child[] = await apiGet(
          `children?month=${activeMonth.format('MMM-YYYY')}`,
          '',
          TEST_OPTS
        );

        expect(
          activeInMonthChildren.some((child) => child.id === childId)
        ).not.toBeTruthy();
        activeInMonthChildren.forEach((child) => {
          expect(child.enrollments).not.toBeUndefined();
          expect(child.enrollments).not.toHaveLength(0);
          expect(
            child.enrollments?.every((enrollment) =>
              enrollment.entry?.isSameOrBefore(activeMonth.endOf('month'))
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
          organization: { id: organization.id } as Organization,
        } as Child;

        const { id } = await apiPost('children', newChild, TEST_OPTS);
        expect(id).not.toBeUndefined();
        newChild.id = id;
        child = newChild;
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

      it('GET /children/id', async () => {
        const getChild = await apiGet(`children/${child.id}`, '', TEST_OPTS);
        expect(getChild.id).toEqual(child.id);
        expect(getChild.firstName).toEqual(child.firstName);
        expect(getChild.lastName).toEqual(child.lastName);
      });

      it('PUT /children/id', async () => {
        const { id: childId } = await createChild(organization);
        let child: Child = await apiGet(`children/${childId}`, '', TEST_OPTS);

        const updatedName = 'UpdatedName';
        await apiPut(
          `children/${childId}`,
          {
            ...child,
            firstName: updatedName,
          },
          TEST_OPTS
        );

        child = await apiGet(`children/${childId}`, '', TEST_OPTS);
        expect(child.firstName).toEqual(updatedName);
      });
    });
    afterAll(() => {
      enableFetchMocks();
      jest.resetAllMocks();
    });
  });
});
