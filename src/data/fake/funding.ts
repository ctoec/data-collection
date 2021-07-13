import { random } from 'faker';
import { Enrollment, Funding, Organization } from '../../entity';

export const getFakeFunding = (
  id,
  enrollment: Enrollment,
  organization: Organization,
  includeEndDate?: boolean
): Funding => {
  const fundingSpace = random.arrayElement(
    organization?.fundingSpaces.filter(
      (f) => f.ageGroup === enrollment.ageGroup
    ) || []
  );

  return {
    id,
    enrollment,
    enrollmentId: enrollment.id,
    fundingSpace,
    startDate: enrollment.entry,
    endDate: includeEndDate ? enrollment.exit : null,
    updateMetaData: { updatedAt: new Date() },
    deletedDate: null,
  };
};
