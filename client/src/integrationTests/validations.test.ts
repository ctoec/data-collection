import { ApiOpts, apiGet, apiPost, apiPut } from '../utils/api';
import {
  Child,
  User,
  Organization,
  BirthCertificateType,
  Enrollment,
  ReportingPeriod,
  UndefinableBoolean,
  Site,
  AgeGroup,
  FundingSource,
  FundingSpace,
  Funding,
} from '../shared/models';
import moment from 'moment';
import {
  ChangeEnrollmentRequest,
  ChangeFundingRequest,
} from '../shared/payloads';
import { disableFetchMocks, enableFetchMocks } from 'jest-fetch-mock';

jest.mock('../utils/getCurrentHost');
import * as util from '../utils/getCurrentHost';

const utilMock = util as jest.Mocked<typeof util>;

const TEST_OPTS: ApiOpts = {
  headers: { 'X-Test-No-Authenticate': 'true' },
  accessToken: '',
};

describe('integration', () => {
  describe('api', () => {
    let organization: Organization;
    let site: Site;
    let childWithIdentifiers: Child;
    beforeAll(async () => {
      disableFetchMocks();
      utilMock.getCurrentHost.mockReturnValue(
        process.env.API_TEST_HOST || 'http://localhost:5001'
      );

      const user: User = await apiGet('users/current', '', TEST_OPTS);
      organization = user?.organizations?.shift() as Organization;
      site = user?.sites?.find(
        (site) => site.organizationId === organization.id
      ) as Site;
      childWithIdentifiers = {
        organization,
        firstName: 'first',
        lastName: 'last',
        birthdate: moment('2020-01-01', ['YYYY-MM-DD']),
        birthCertificateType: BirthCertificateType.Unavailable,
      } as Child;
    });
    afterAll(() => {
      enableFetchMocks();
    });
    describe('validations', () => {
      describe('child', () => {
        it('blocks create with missing identifiers', async () => {
          const child = {
            organization,
          };
          expect(apiPost('children', child, TEST_OPTS)).rejects.toMatchObject({
            message: 'Cannot create child without identifier information.',
          });
        });
        it('has missing info errors', async () => {
          // Create child with as little info as possible
          const { id } = await apiPost(
            'children',
            childWithIdentifiers,
            TEST_OPTS
          );
          let child: Child = await apiGet(`children/${id}`, '', TEST_OPTS);

          // Then update so that ALL possibly missing info is missing
          const updatedChild = { ...child };
          updatedChild.firstName = '';
          updatedChild.lastName = '';
          await apiPut(`children/${id}`, updatedChild, TEST_OPTS);
          child = await apiGet(`children/${id}`, '', TEST_OPTS);

          expect(child).toHaveProperty('validationErrors');
          expect(child.validationErrors).not.toHaveLength(0);
          [
            'firstName',
            'lastName',
            'americanIndianOrAlaskaNative',
            'asian',
            'blackOrAfricanAmerican',
            'nativeHawaiianOrPacificIslander',
            'white',
            'raceNotDisclosed',
            'hispanicOrLatinxEthnicity',
            'gender',
            'dualLanguageLearner',
            'foster',
            'receivesDisabilityServices',
            'family',
          ].forEach((prop) => {
            const err = child.validationErrors?.find(
              (e) => e.property === prop
            );
            expect(err?.property).toEqual(prop);
          });
        });
        it('has missing birth cert errors if US birth cert', async () => {
          const { id } = await apiPost(
            'children',
            childWithIdentifiers,
            TEST_OPTS
          );
          let child: Child = await apiGet(`children/${id}`, '', TEST_OPTS);

          // Update to have US birth cert
          await apiPut(
            `children/${id}`,
            {
              ...child,
              birthCertificateType: BirthCertificateType.US,
              birthState: '',
              birthTown: '',
            },
            TEST_OPTS
          );
          child = await apiGet(`children/${id}`, '', TEST_OPTS);

          expect(child).toHaveProperty('validationErrors');
          expect(child.validationErrors).not.toHaveLength(0);
          ['birthCertificateId', 'birthTown', 'birthState'].forEach((prop) => {
            const err = child.validationErrors?.find(
              (e) => e.property === prop
            );
            expect(err?.property).toEqual(prop);
          });
        });
        it('has missing funded enrollment error if no enrollment or funding', async () => {
          const { id } = await apiPost(
            'children',
            childWithIdentifiers,
            TEST_OPTS
          );
          let child: Child = await apiGet(`children/${id}`, '', TEST_OPTS);

          let missingFundedEnrollmentError = child?.validationErrors?.find(
            (e) => !!e.constraints?.fundedEnrollment
          );
          expect(missingFundedEnrollmentError).not.toBeUndefined();

          // Then, add an enrollment without a funding and ensure the error is still there
          const changeEnrollment: ChangeEnrollmentRequest = {
            newEnrollment: {
              entry: moment(),
            } as Enrollment,
          };
          await apiPost(`children/${id}/change-enrollment`, changeEnrollment, {
            ...TEST_OPTS,
            jsonParse: false,
          });
          child = await apiGet(`children/${id}`, '', TEST_OPTS);

          missingFundedEnrollmentError = child?.validationErrors?.find(
            (e) => !!e.constraints?.fundedEnrollment
          );
          expect(missingFundedEnrollmentError).not.toBeUndefined();

          const fundingSpaces = await apiGet(
            `funding-spaces?organizationId=${organization.id}`,
            '',
            TEST_OPTS
          );
          const reportingPeriods = await apiGet(
            'reporting-periods?source=CDC',
            '',
            TEST_OPTS
          );
          const changeEnrollmentWithFunding: ChangeEnrollmentRequest = {
            newEnrollment: {
              entry: moment(),
              fundings: [
                {
                  firstReportingPeriod: reportingPeriods[0] as ReportingPeriod,
                  fundingSpace: fundingSpaces[0],
                },
              ],
            } as Enrollment,
          };
          await apiPost(
            `children/${id}/change-enrollment`,
            changeEnrollmentWithFunding,
            { ...TEST_OPTS, jsonParse: false }
          );
          child = await apiGet(`children/${id}`, '', TEST_OPTS);

          missingFundedEnrollmentError = child?.validationErrors?.find(
            (e) => !!e.constraints?.fundedEnrollment
          );
          expect(missingFundedEnrollmentError).toBeUndefined();
        });
      });

      describe('family', () => {
        it('has missing info errors', async () => {
          const { id } = await apiPost(
            'children',
            childWithIdentifiers,
            TEST_OPTS
          );
          let child: Child = await apiGet(`children/${id}`, '', TEST_OPTS);

          expect(child?.family).toHaveProperty('validationErrors');
          expect(child?.family?.validationErrors).not.toHaveLength(0);
          [
            'streetAddress',
            'town',
            'state',
            'zipCode',
            'incomeDeterminations',
          ].forEach((prop) => {
            const err = child?.family?.validationErrors?.find(
              (e) => e.property === prop
            );
            expect(err?.property).toEqual(prop);
          });
        });
        it('does not have missing address errors if homeless', async () => {
          const { id } = await apiPost(
            'children',
            childWithIdentifiers,
            TEST_OPTS
          );
          let child: Child = await apiGet(`children/${id}`, '', TEST_OPTS);
          ['streetAddress', 'town', 'state', 'zipCode'].forEach((prop) => {
            const err = child?.validationErrors?.find(
              (e) => e.property === prop
            );
            expect(err).toBeUndefined();
          });
        });
        it('does not have missing income determination errors if child is foster', async () => {
          const { id } = await apiPost(
            'children',
            {
              ...childWithIdentifiers,
              foster: UndefinableBoolean.Yes,
            },
            TEST_OPTS
          );
          let child: Child = await apiGet(`children/${id}`, '', TEST_OPTS);
          const incomeDeterminationError = child?.validationErrors?.find(
            (e) => e.property === 'incomeDeterminations'
          );
          expect(incomeDeterminationError).toBeUndefined();
        });
      });

      describe('income determination', () => {
        it('has missing info errors', async () => {
          const { id } = await apiPost(
            'children',
            childWithIdentifiers,
            TEST_OPTS
          );
          let child: Child = await apiGet(`children/${id}`, '', TEST_OPTS);

          // Add empty income determination
          await apiPost(
            `families/${child.family?.id}/income-determinations`,
            {},
            TEST_OPTS
          );
          child = await apiGet(`children/${id}`, '', TEST_OPTS);

          expect(child?.family?.incomeDeterminations).toHaveLength(1);
          const incomeDetermination = child?.family?.incomeDeterminations?.pop();

          expect(incomeDetermination).toHaveProperty('validationErrors');
          ['numberOfPeople', 'income', 'determinationDate'].forEach((prop) => {
            const err = incomeDetermination?.validationErrors?.find(
              (e) => e.property === prop
            );
            expect(err?.property).toEqual(prop);
          });
        });
      });

      describe('enrollment', () => {
        it('has missing info errors', async () => {
          const { id } = await apiPost(
            'children',
            childWithIdentifiers,
            TEST_OPTS
          );
          let child: Child = await apiGet(`children/${id}`, '', TEST_OPTS);

          const changeEnrollment: ChangeEnrollmentRequest = {
            newEnrollment: {} as Enrollment,
          };

          // Add empty enrollment
          await apiPost(`children/${id}/change-enrollment`, changeEnrollment, {
            ...TEST_OPTS,
            jsonParse: false,
          });

          child = await apiGet(`children/${id}`, '', TEST_OPTS);
          const enrollment = child?.enrollments?.pop();
          ['site', 'model', 'ageGroup', 'entry'].forEach((prop) => {
            const err = enrollment?.validationErrors?.find(
              (e) => e.property === prop
            );
            expect(err?.property).toEqual(prop);
          });
        });

        it('has missing exit reason error if exited', async () => {
          const { id } = await apiPost(
            'children',
            childWithIdentifiers,
            TEST_OPTS
          );
          let child: Child = await apiGet(`children/${id}`, '', TEST_OPTS);

          const changeEnrollment: ChangeEnrollmentRequest = {
            newEnrollment: {
              siteId: site.id,
              entry: moment(),
              exit: moment(),
            } as Enrollment,
          };

          await apiPost(`children/${id}/change-enrollment`, changeEnrollment, {
            ...TEST_OPTS,
            jsonParse: false,
          });

          child = await apiGet(`children/${id}`, '', TEST_OPTS);
          const enrollment = child?.enrollments?.pop() as Enrollment;
          expect(enrollment.exit).not.toBeUndefined();
          expect(
            enrollment.validationErrors?.find(
              (err) => err.property === 'exitReason'
            )
          ).not.toBeUndefined();
        });

        it('has entry and exit cannot be in the future', async () => {
          const { id } = await apiPost(
            'children',
            childWithIdentifiers,
            TEST_OPTS
          );
          let child: Child = await apiGet(`children/${id}`, '', TEST_OPTS);

          const changeEnrollment: ChangeEnrollmentRequest = {
            newEnrollment: {
              siteId: site.id,
              entry: moment('2030-09-01', 'YYYY-MM-DD'),
              exit: moment('2031-08-01', 'YYYY-MM-DD'),
            } as Enrollment,
          };

          await apiPost(`children/${id}/change-enrollment`, changeEnrollment, {
            ...TEST_OPTS,
            jsonParse: false,
          });

          child = await apiGet(`children/${id}`, '', TEST_OPTS);
          const enrollment = child?.enrollments?.pop() as Enrollment;
          const entryError = enrollment.validationErrors?.find(
            (err) => err.property === 'entry'
          );
          expect(entryError).not.toBeUndefined();
          expect((entryError?.constraints || {})['entry']).toEqual(
            'Entry cannot be in the future.'
          );
          const exitError = enrollment.validationErrors?.find(
            (err) => err.property === 'exit'
          );
          expect(exitError).not.toBeUndefined();
          expect((exitError?.constraints || {})['exit']).toEqual(
            'Exit cannot be in the future.'
          );
        });

        it('has funding age group matches enrollment', async () => {
          const { id } = await apiPost(
            'children',
            childWithIdentifiers,
            TEST_OPTS
          );
          let child: Child = await apiGet(`children/${id}`, '', TEST_OPTS);

          const fundingSpaces: FundingSpace[] = await apiGet(
            `funding-spaces?organizationId=${child.organization.id}`,
            '',
            TEST_OPTS
          );
          const schoolAgeFundingSpace = fundingSpaces.find(
            (space) => space.ageGroup === AgeGroup.SchoolAge
          );

          const changeEnrollment: ChangeEnrollmentRequest = {
            newEnrollment: {
              siteId: site.id,
              entry: moment(),
              ageGroup: AgeGroup.InfantToddler,
              fundings: [
                {
                  fundingSpace: schoolAgeFundingSpace,
                },
              ],
            } as Enrollment,
          };

          await apiPost(`children/${id}/change-enrollment`, changeEnrollment, {
            ...TEST_OPTS,
            jsonParse: false,
          });

          child = await apiGet(`children/${id}`, '', TEST_OPTS);
          const enrollment = child?.enrollments?.pop() as Enrollment;
          const fundingError = enrollment?.validationErrors?.find(
            (err) => err.property === 'fundings'
          );
          expect(fundingError).not.toBeUndefined();
          expect(
            (fundingError?.constraints || {})['ageGroupMatch']
          ).not.toBeUndefined();
        });
      });

      describe('funding', () => {
        it('has missing info errors', async () => {
          const { id } = await apiPost(
            'children',
            childWithIdentifiers,
            TEST_OPTS
          );
          let child: Child = await apiGet(`children/${id}`, '', TEST_OPTS);

          const changeEnrollment: ChangeEnrollmentRequest = {
            newEnrollment: {
              fundings: [{}],
            } as Enrollment,
          };

          // Add empty enrollment with empty funding
          await apiPost(`children/${id}/change-enrollment`, changeEnrollment, {
            ...TEST_OPTS,
            jsonParse: false,
          });

          child = await apiGet(`children/${id}`, '', TEST_OPTS);
          const enrollment = child?.enrollments?.pop();
          const funding = enrollment?.fundings?.pop() as Funding;
          ['fundingSpace', 'firstReportingPeriod'].forEach((prop) => {
            const err = funding?.validationErrors?.find(
              (e) => e.property === prop
            );
            expect(err?.property).toEqual(prop);
          });
        });

        it('has funding begins after enrollment entry', async () => {
          const { id } = await apiPost(
            'children',
            childWithIdentifiers,
            TEST_OPTS
          );
          let child: Child = await apiGet(`children/${id}`, '', TEST_OPTS);

          const reportingPeriods: ReportingPeriod[] = await apiGet(
            'reporting-periods',
            '',
            TEST_OPTS
          );
          const enrollmentEntry = moment('2020-09-01', 'YYYY-MM-DD');
          const reportingPeriodBeforeEntry = reportingPeriods.find((rp) =>
            rp.period.isBefore(enrollmentEntry)
          );
          const changeEnrollment: ChangeEnrollmentRequest = {
            newEnrollment: {
              entry: enrollmentEntry,
              fundings: [
                {
                  firstReportingPeriod: reportingPeriodBeforeEntry,
                },
              ],
            } as Enrollment,
          };

          await apiPost(`children/${id}/change-enrollment`, changeEnrollment, {
            ...TEST_OPTS,
            jsonParse: false,
          });

          child = await apiGet(`children/${id}`, '', TEST_OPTS);
          const enrollment = child?.enrollments?.pop();
          const funding = enrollment?.fundings?.pop() as Funding;

          const firstReportingPeriodErr = funding.validationErrors?.find(
            (err) => err.property === 'firstReportingPeriod'
          );
          expect(firstReportingPeriodErr).not.toBeUndefined();
          expect(
            (firstReportingPeriodErr?.constraints || {})[
              'firstReportingPeriodAfterEntry'
            ]
          ).not.toBeUndefined();
        });

        it('has fundings do not overlap', async () => {
          const { id } = await apiPost(
            'children',
            childWithIdentifiers,
            TEST_OPTS
          );
          let child: Child = await apiGet(`children/${id}`, '', TEST_OPTS);

          const reportingPeriods: ReportingPeriod[] = await apiGet(
            'reporting-periods',
            '',
            TEST_OPTS
          );
          const enrollmentEntry = moment('2020-09-01', 'YYYY-MM-DD');
          const reportingPeriod = reportingPeriods.find((rp) =>
            rp.period.isAfter(enrollmentEntry)
          );

          // Create enrollment with funding
          const changeEnrollment: ChangeEnrollmentRequest = {
            newEnrollment: {
              entry: enrollmentEntry,
              fundings: [
                {
                  firstReportingPeriod: reportingPeriod,
                },
              ],
            } as Enrollment,
          };

          await apiPost(`children/${id}/change-enrollment`, changeEnrollment, {
            ...TEST_OPTS,
            jsonParse: false,
          });
          child = await apiGet(`children/${id}`, '', TEST_OPTS);
          let enrollment = child?.enrollments?.pop() as Enrollment;

          // Update enrollment to have second funding
          const oldFundingLastReportingPeriod = reportingPeriods.find((rp) =>
            rp.period.isAfter(reportingPeriod?.period.clone().add('month', 4))
          ) as ReportingPeriod;
          const newFundingReportingPeriod = reportingPeriods.find(
            (rp) =>
              rp.period.isAfter(
                reportingPeriod?.period.clone().add('months', 2)
              ) &&
              rp.period.isBefore(
                reportingPeriod?.period.clone().add('months', 4)
              )
          ) as ReportingPeriod;
          const changeFunding: ChangeFundingRequest = {
            newFunding: {
              firstReportingPeriod: newFundingReportingPeriod,
            } as Funding,
            oldFunding: {
              lastReportingPeriod: oldFundingLastReportingPeriod,
            },
          };
          await apiPost(
            `enrollments/${enrollment.id}/change-funding`,
            changeFunding,
            { ...TEST_OPTS, jsonParse: false }
          );
          child = await apiGet(`children/${id}`, '', TEST_OPTS);
          enrollment = child?.enrollments?.pop() as Enrollment;

          enrollment.fundings?.forEach((funding) => {
            const firstReportingPeriodOverlapErr = funding.validationErrors?.find(
              (err) => err.property === 'firstReportingPeriod'
            );
            expect(firstReportingPeriodOverlapErr).not.toBeUndefined();
            expect(
              (firstReportingPeriodOverlapErr?.constraints || {})[
                'fundingOverlap'
              ]
            ).not.toBeUndefined();

            const lastReportingPeriodOverlapErr = funding.validationErrors?.find(
              (err) => err.property === 'lastReportingPeriod'
            );
            expect(lastReportingPeriodOverlapErr).not.toBeUndefined();
            expect(
              (lastReportingPeriodOverlapErr?.constraints || {})[
                'fundingOverlap'
              ]
            ).not.toBeUndefined();
          });
        });

        it.only('has last reporting period is after first', async () => {
          const { id } = await apiPost(
            'children',
            childWithIdentifiers,
            TEST_OPTS
          );
          let child: Child = await apiGet(`children/${id}`, '', TEST_OPTS);

          const reportingPeriods: ReportingPeriod[] = await apiGet(
            'reporting-periods',
            '',
            TEST_OPTS
          );
          const enrollmentEntry = moment('2020-09-01', 'YYYY-MM-DD');
          const firstReportingPeriod = reportingPeriods.find((rp) =>
            rp.period.isAfter(enrollmentEntry.clone().add('months', 4))
          );
          const lastReportingPeriod = reportingPeriods.find(
            (rp) =>
              rp.period.isAfter(enrollmentEntry) &&
              rp.period.isBefore(enrollmentEntry.clone().add('month', 4))
          ) as ReportingPeriod;

          // Create enrollment with funding
          const changeEnrollment: ChangeEnrollmentRequest = {
            newEnrollment: {
              entry: enrollmentEntry,
              fundings: [
                {
                  firstReportingPeriod,
                },
              ],
            } as Enrollment,
          };

          await apiPost(`children/${id}/change-enrollment`, changeEnrollment, {
            ...TEST_OPTS,
            jsonParse: false,
          });
          child = await apiGet(`children/${id}`, '', TEST_OPTS);
          let enrollment = child?.enrollments?.pop() as Enrollment;
          let funding = enrollment.fundings?.pop() as Funding;

          const changeFunding: ChangeFundingRequest = {
            oldFunding: {
              lastReportingPeriod,
            },
          };

          await apiPost(
            `enrollments/${enrollment.id}/change-funding`,
            changeFunding,
            { ...TEST_OPTS, jsonParse: false }
          );
          child = await apiGet(`children/${id}`, '', TEST_OPTS);
          enrollment = child?.enrollments?.pop() as Enrollment;
          funding = enrollment.fundings?.pop() as Funding;

          const lastAfterFirstErr = funding.validationErrors?.find(
            (err) => err.property === 'lastReportingPeriod'
          );
          expect(lastAfterFirstErr).not.toBeUndefined();
          expect(
            (lastAfterFirstErr?.constraints || {})[
              'lastReportingPeriodAfterFirst'
            ]
          ).not.toBeUndefined();
        });
      });
    });
  });
});
