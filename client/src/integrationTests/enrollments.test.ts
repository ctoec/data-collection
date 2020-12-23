import { disableFetchMocks, enableFetchMocks } from 'jest-fetch-mock';
import { apiGet, apiPost, ApiOpts, apiPut, apiDelete } from '../utils/api';
import {
  Child,
  Enrollment,
  FundingSpace,
  Funding,
  ReportingPeriod,
} from '../shared/models';
import moment from 'moment';
import { ChangeFunding, Withdraw, ChangeEnrollment } from '../shared/payloads';

jest.mock('../utils/getCurrentHost');
import * as util from '../utils/getCurrentHost';
const utilMock = util as jest.Mocked<typeof util>;

const TEST_OPTS: ApiOpts = {
  headers: { 'X-Test-No-Authenticate': 'true' },
  accessToken: '',
};

describe('integration', () => {
  describe('api', () => {
    let enrollment: Enrollment | undefined;
    let reportingPeriods: ReportingPeriod[] | undefined;
    beforeAll(async () => {
      disableFetchMocks();
      utilMock.getCurrentHost.mockReturnValue(
        process.env.API_TEST_HOST || 'http://localhost:5001'
      );
      const children: Child[] = await apiGet('children', '', TEST_OPTS);
      const child = children.find((c) =>
        c.enrollments?.some(
          (e) => !!e.site && !e?.exit && !!e?.fundings?.length
        )
      );
      enrollment = child?.enrollments?.find(
        (e) => !!e.site && !e?.exit && !!e?.fundings?.length
      );
      reportingPeriods = await apiGet(`reporting-periods`, '', TEST_OPTS);
    });
    afterAll(() => {
      enableFetchMocks();
    });
    describe('enrollments', () => {
      it('PUT /enrollments/id', async () => {
        if (!enrollment) throw new Error('no enrollment');

        enrollment.entry = enrollment.entry
          ? enrollment.entry.clone().add(2, 'months')
          : moment.utc();
        const res = await apiPut(
          `enrollments/${enrollment.id}`,
          enrollment,
          TEST_OPTS
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
        expect(updatedEnrollment?.entry?.format('YYYY-MM-DD')).toEqual(
          enrollment.entry?.format('YYYY-MM-DD')
        );
      });

      it('PUT /enrollments/id for enrollment without siteId', async () => {
        if (!enrollment) throw new Error('no enrollment');

        const site = enrollment.site;

        const newEnrollment = { ...enrollment };
        delete newEnrollment.id;
        delete newEnrollment.site;
        delete newEnrollment.siteId;
        delete newEnrollment.fundings;
        const changeEnrollment: ChangeEnrollment = {
          newEnrollment,
          oldEnrollment: {
            funding: {
              lastReportingPeriod: reportingPeriods?.find(
                (rp) => true
              ) as ReportingPeriod,
            },
          },
        };
        await apiPost(
          `children/${enrollment.childId}/change-enrollment`,
          changeEnrollment,
          { ...TEST_OPTS, jsonParse: false }
        );
        let updatedChild: Child = await apiGet(
          `children/${enrollment.childId}`,
          '',
          TEST_OPTS
        );

        const sitelessEnrollment = updatedChild?.enrollments?.find(
          (e) => !e.siteId
        );
        if (!sitelessEnrollment) throw new Error('change-enrollment failed');
        sitelessEnrollment.site = site;

        const res = await apiPut(
          `enrollments/${sitelessEnrollment.id}`,
          sitelessEnrollment,
          TEST_OPTS
        );
        expect(res.status).toEqual(200);

        updatedChild = await apiGet(
          `children/${enrollment.childId}`,
          '',
          TEST_OPTS
        );
        const updatedEnrollment = updatedChild?.enrollments?.find(
          (e) => e.id === sitelessEnrollment.id
        );
        expect(updatedEnrollment).not.toBeUndefined();
        expect(updatedEnrollment?.siteId).toEqual(site?.id);
      });

      it.only('POST /enrollments/id/change-funding', async () => {
        if (!enrollment) throw new Error('no enrollment');
        const organizationId = enrollment?.site?.organizationId;
        const [fundingSpace] = (await apiGet(
          `funding-spaces?organizationId=${organizationId}`,
          '',
          TEST_OPTS
        )) as FundingSpace[];

        const period = reportingPeriods?.find(
          (rp) => rp.period > moment('07-01-2020', ['MM-DD-YYYY'])
        );
        const changeFunding: ChangeFunding = {
          newFunding: {
            firstReportingPeriod: period,
            fundingSpace: fundingSpace,
          } as Funding,
        };
        const res = await apiPost(
          `enrollments/${enrollment.id}/change-funding`,
          changeFunding,
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
        expect(updatedEnrollment?.fundings).toHaveLength(
          (enrollment.fundings?.length || 0) + 1
        );

        const previouslyCurrentFunding = enrollment.fundings?.find(
          (f) => !f.lastReportingPeriod
        );
        if (previouslyCurrentFunding) {
          const updatedFunding = updatedEnrollment?.fundings?.find(
            (f) => f.id === previouslyCurrentFunding.id
          );

          expect(
            updatedFunding?.lastReportingPeriod?.period.format('MM-YYYY')
          ).toEqual(
            changeFunding.newFunding?.firstReportingPeriod?.period
              .add(-1, 'month')
              .format('MM-YYYY')
          );
        }

        const newFunding = updatedEnrollment?.fundings?.find(
          (f) =>
            f.firstReportingPeriod?.id ===
              changeFunding.newFunding?.firstReportingPeriod?.id &&
            f.fundingSpace?.id === changeFunding.newFunding?.fundingSpace?.id
        );
        expect(newFunding).not.toBeUndefined();
      });

      it('POST /enrollments/id/withdraw', async () => {
        if (!enrollment) throw new Error('no enrollment');

        const exit = moment().utc();
        const exitReason = 'an exit reason';
        const withdraw: Withdraw = {
          exit,
          exitReason,
        };

        const currentFunding = enrollment.fundings?.find(
          (f) => !f.lastReportingPeriod
        );

        if (currentFunding) {
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
        }

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
        if (!enrollment) throw new Error('no enrollment');

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
