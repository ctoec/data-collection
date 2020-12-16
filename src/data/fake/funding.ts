import { random } from 'faker';
import { Enrollment, Funding, Organization } from '../../entity';
import {
  getReportingPeriodFromDates,
  reportingPeriods,
} from './reportingPeriods';

export const getFakeFunding = (
  id,
  enrollment: Enrollment,
  organization: Organization,
  includeLastReportingPeriod?: boolean
): Funding => {
  const fundingSpace = random.arrayElement(
    organization?.fundingSpaces.filter(
      (f) => f.ageGroup === enrollment.ageGroup
    ) || []
  );
  const firstAndLastReportingPeriods = random
    .arrayElements(reportingPeriods, 2)
    .map((r) => ({
      id,
      ...getReportingPeriodFromDates(fundingSpace.source, r),
    }));
  return {
    id,
    enrollment,
    enrollmentId: enrollment.id,
    fundingSpace,
    firstReportingPeriod: firstAndLastReportingPeriods[0],
    lastReportingPeriod: includeLastReportingPeriod
      ? firstAndLastReportingPeriods[1]
      : undefined,
    updateMetaData: { updatedAt: new Date() },
    deletedDate: null,
  };
};
