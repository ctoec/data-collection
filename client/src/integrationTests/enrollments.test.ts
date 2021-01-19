import { disableFetchMocks, enableFetchMocks } from 'jest-fetch-mock';
import { apiGet, apiPost, ApiOpts, apiPut, apiDelete } from '../utils/api';
import {
  Child,
  Enrollment,
  FundingSpace,
  Funding,
  ReportingPeriod,
  Organization,
  User,
  Site,
} from '../shared/models';
import moment, { Moment } from 'moment';
import { ChangeFunding, Withdraw, ChangeEnrollment } from '../shared/payloads';

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
    let reportingPeriods: ReportingPeriod[] | undefined;
    let organization: Organization;
    let site: Site;
    beforeAll(async () => {
      disableFetchMocks();
      utilMock.getCurrentHost.mockReturnValue(
        process.env.API_TEST_HOST || 'http://localhost:5001'
      );

      const user: User = await apiGet('users/current', '', TEST_OPTS);
      organization = user?.organizations?.shift() as Organization;
      site = user?.sites?.find(
        (s) => s.organizationId === organization.id
      ) as Site;
      reportingPeriods = await apiGet(`reporting-periods`, '', TEST_OPTS);
    });
    afterAll(() => {
      enableFetchMocks();
    });
    describe('enrollments', () => {
      it('PUT /enrollments/id', async () => {
        const { id: childId } = await createChild(organization);
        await createEnrollment(childId, site);
        let child: Child = await apiGet(`children/${childId}`, '', TEST_OPTS);
        const enrollment = child?.enrollments?.pop() as Enrollment;

        enrollment.entry = enrollment?.entry?.clone().add(2, 'months');
        const res = await apiPut(
          `enrollments/${enrollment.id}`,
          enrollment,
          TEST_OPTS
        );
        expect(res.status).toEqual(200);

        child = await apiGet(`children/${enrollment.childId}`, '', TEST_OPTS);
        const updatedEnrollment = child.enrollments?.find(
          (e) => e.id === enrollment?.id
        );
        expect(updatedEnrollment?.entry?.format('YYYY-MM-DD')).toEqual(
          enrollment.entry?.format('YYYY-MM-DD')
        );
      });

      it('PUT /enrollments/id for enrollment without siteId', async () => {
        const { id: childId } = await createChild(organization);
        // Create enrollment without site
        await createEnrollment(childId);
        let child: Child = await apiGet(`children/${childId}`, '', TEST_OPTS);
        const enrollment = child?.enrollments?.pop() as Enrollment;

        const res = await apiPut(
          `enrollments/${enrollment.id}`,
          {
            ...enrollment,
            site,
          },
          TEST_OPTS
        );
        expect(res.status).toEqual(200);

        child = await apiGet(`children/${enrollment.childId}`, '', TEST_OPTS);
        const updatedEnrollment = child?.enrollments?.find(
          (e) => e.id === enrollment.id
        );
        expect(updatedEnrollment).not.toBeUndefined();
        expect(updatedEnrollment?.siteId).toEqual(site?.id);
      });

      it('POST /enrollments/id/change-funding', async () => {
        const { id: childId } = await createChild(organization);
        await createEnrollment(childId, site, { withFunding: true });

        let child: Child = await apiGet(`children/${childId}`, '', TEST_OPTS);
        const enrollment = child.enrollments?.pop() as Enrollment;
        const currentFunding = (enrollment.fundings as Funding[])[0];
        const period = reportingPeriods?.find(
          (rp) =>
            rp.period > (currentFunding.firstReportingPeriod?.period as Moment)
        );

        const changeFunding: ChangeFunding = {
          newFunding: {
            firstReportingPeriod: period,
          } as Funding,
        };
        const res = await apiPost(
          `enrollments/${enrollment.id}/change-funding`,
          changeFunding,
          { ...TEST_OPTS, jsonParse: false }
        );
        expect(res.status).toEqual(200);

        child = await apiGet(`children/${enrollment.childId}`, '', TEST_OPTS);

        const updatedEnrollment = child.enrollments?.find(
          (e) => e.id === enrollment?.id
        );
        expect(updatedEnrollment?.fundings).toHaveLength(
          (enrollment.fundings?.length || 0) + 1
        );

        const updatedFunding = updatedEnrollment?.fundings?.find(
          (f) => f.id === currentFunding.id
        );

        expect(
          updatedFunding?.lastReportingPeriod?.period.format('MM-YYYY')
        ).toEqual(
          changeFunding.newFunding?.firstReportingPeriod?.period
            .add(-1, 'month')
            .format('MM-YYYY')
        );

        const newFunding = updatedEnrollment?.fundings?.find(
          (f) =>
            f.firstReportingPeriod?.id ===
              changeFunding.newFunding?.firstReportingPeriod?.id &&
            f.fundingSpace?.id === changeFunding.newFunding?.fundingSpace?.id
        );
        expect(newFunding).not.toBeUndefined();
      });

      it('POST /enrollments/id/withdraw', async () => {
        const { id: childId } = await createChild(organization);
        await createEnrollment(childId, site, { withFunding: true });

        let child: Child = await apiGet(`children/${childId}`, '', TEST_OPTS);
        const enrollment = child.enrollments?.pop() as Enrollment;

        const exit = moment().utc();
        const exitReason = 'an exit reason';
        const withdraw: Withdraw = {
          exit,
          exitReason,
        };

        const currentFunding = enrollment.fundings?.find(
          (f) => !f.lastReportingPeriod
        ) as Funding;

        const reportingPeriods: ReportingPeriod[] = await apiGet(
          `reporting-periods?source=${
            currentFunding.fundingSpace?.source.split('-')[0]
          }`,
          '',
          TEST_OPTS
        );
        const period = reportingPeriods.find(
          (rp) => rp.period > moment('07-01-2020', ['MM-DD-YYYY'])
        ) as ReportingPeriod;
        withdraw.funding = { lastReportingPeriod: period };

        const res = await apiPost(
          `enrollments/${enrollment.id}/withdraw`,
          withdraw,
          { ...TEST_OPTS, jsonParse: false }
        );
        expect(res.status).toEqual(200);

        const updatedChild: Child = await apiGet(
          `children/${enrollment.childId}`,
          '',
          TEST_OPTS
        );
        const updatedEnrollment = updatedChild.enrollments?.find(
          (e) => e.id === enrollment?.id
        );
        expect(updatedEnrollment?.exit?.format('MM-DD-YYYY')).toEqual(
          exit.format('MM-DD-YYYY')
        );
        expect(updatedEnrollment?.exitReason).toEqual(exitReason);
      });

      it('DELETE /enrollments/id', async () => {
        const { id: childId } = await createChild(organization);
        await createEnrollment(childId, site, { withFunding: true });

        let child: Child = await apiGet(`children/${childId}`, '', TEST_OPTS);
        const enrollment = child.enrollments?.pop() as Enrollment;

        const res = await apiDelete(`enrollments/${enrollment.id}`, TEST_OPTS);
        expect(res.status).toEqual(200);

        const updatedChild: Child = await apiGet(
          `children/${enrollment.childId}`,
          '',
          TEST_OPTS
        );
        const updatedEnrollment = updatedChild.enrollments?.find(
          (e) => e.id === enrollment?.id
        );
        expect(updatedEnrollment).toBeUndefined();
      });
    });
  });
});
