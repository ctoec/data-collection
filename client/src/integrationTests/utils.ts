import {
  Organization,
  BirthCertificateType,
  Child,
  Site,
  Enrollment,
  Funding,
  ReportingPeriod,
  FundingSpace,
  FundingSource,
} from '../shared/models';
import { apiPost, ApiOpts, apiGet } from '../utils/api';
import moment from 'moment';
import { ChangeEnrollment } from '../shared/payloads';

export const TEST_OPTS: ApiOpts = {
  headers: { 'X-Test-No-Authenticate': 'true' },
  accessToken: '',
};

export const createChild = async (org: Organization) => {
  const child = {
    organization: org,
    firstName: 'first',
    lastName: 'last',
    birthdate: moment('2020-01-01', ['YYYY-MM-DD']),
    birthCertificateType: BirthCertificateType.Unavailable,
  } as Child;

  return apiPost('children', child, TEST_OPTS);
};

export const createEnrollment = async (
  site: Site,
  childId: string,
  opts?: { withFunding: boolean }
) => {
  const date = moment('2020-09-01', ['YYYY-MM-DD']);
  const changeEnrollment: ChangeEnrollment = {
    newEnrollment: {
      site,
      entry: date,
    } as Enrollment,
  };

  if (opts?.withFunding) {
    const reportingPeriods: ReportingPeriod[] = await apiGet(
      'reporting-periods?source=CDC',
      '',
      TEST_OPTS
    );
    const fundingSpaces: FundingSpace[] = await apiGet(
      `funding-spaces?organizationId=${site.organizationId}`,
      '',
      TEST_OPTS
    );
    changeEnrollment.newEnrollment.fundings = [
      {
        firstReportingPeriod: reportingPeriods.find(
          (rp) => rp.period.format('YYYY-MM-DD') === date.format('YYYY-MM-DD')
        ),
        fundingSpace: fundingSpaces.find(
          (fs) => fs.source === FundingSource.CDC
        ) as FundingSpace,
      } as Funding,
    ];
  }

  await apiPost(`children/${childId}/change-enrollment`, changeEnrollment, {
    ...TEST_OPTS,
    jsonParse: false,
  });
};
