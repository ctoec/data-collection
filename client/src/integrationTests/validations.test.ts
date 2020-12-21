import { ApiOpts, apiGet, apiPost, apiPut } from '../utils/api';
import {
  Child,
  User,
  Organization,
  BirthCertificateType,
  Enrollment,
  UndefinableBoolean,
  ReportingPeriod,
} from '../shared/models';
import { disableFetchMocks, enableFetchMocks } from 'jest-fetch-mock';

jest.mock('../utils/getCurrentHost');
import * as util from '../utils/getCurrentHost';
import moment from 'moment';
import { ChangeEnrollment } from '../shared/payloads';
const utilMock = util as jest.Mocked<typeof util>;

const TEST_OPTS: ApiOpts = {
  headers: { 'X-Test-No-Authenticate': 'true' },
  accessToken: '',
};

describe('integration', () => {
  describe('api', () => {
    let organization: Organization;
    let childWithIdentifiers: Child;
    beforeAll(async () => {
      disableFetchMocks();
      utilMock.getCurrentHost.mockReturnValue(
        process.env.API_TEST_HOST || 'http://localhost:5001'
      );
      const user: User = await apiGet('users/current', '', TEST_OPTS);
      organization = user?.organizations?.shift() as Organization;
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
          const changeEnrollment: ChangeEnrollment = {
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
          const changeEnrollmentWithFunding: ChangeEnrollment = {
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

      describe('family', () => {});
    });
  });
});
