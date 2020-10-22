import { random } from 'faker';
import { Enrollment, Funding, Organization } from '../entity';
import {
  getReportingPeriodFromDates,
  reportingPeriods,
} from './reportingPeriods';

export const getFakeFunding = (
  id,
  enrollment: Enrollment,
  organization: Organization
): Funding => {
  const fundingSpace = organization?.fundingSpaces.find(
    (f) => f.ageGroup === enrollment.ageGroup
  );
  return {
    id,
    enrollment: enrollment,
    enrollmentId: enrollment.id,
    fundingSpace,
    firstReportingPeriod: {
      id,
      ...getReportingPeriodFromDates(
        fundingSpace.source,
        random.arrayElement(reportingPeriods)
      ),
    },
    updateMetaData: { updatedAt: new Date() },
  };
};
