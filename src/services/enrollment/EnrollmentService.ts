import { FlattenedEnrollment, Enrollment } from '../../models';

export class EnrollmentService {
  public createEnrollmentsFromFlattenedEnrollments(
    flattenedEnrollments: FlattenedEnrollment[]
  ): Enrollment[] {
    return flattenedEnrollments.map((flattenedEnrollment) =>
      this.createEnrollmentFromFlattenedEnrollment(flattenedEnrollment)
    );
  }

  public createEnrollmentFromFlattenedEnrollment(
    flattenedEnrollment: FlattenedEnrollment
  ): Enrollment {
    // TODO
    return {
      id: 1,
      childId: '',
      child: {
        id: '',
        firstName: flattenedEnrollment.name,
        lastName: '',
        organizationId: 1,
      },
      siteId: 1,
    };
  }
}
