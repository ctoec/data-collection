import { FlattenedEnrollment, Enrollment } from '../../entity';
import { Region } from '../../entity/enums';

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
    const organization = { id: 1, name: 'Organization' };
    const site = {
      id: 1,
      organization,
      name: 'Site',
      titleI: true,
      region: Region.East,
    };
    return {
      id: 1,
      child: {
        id: '',
        firstName: flattenedEnrollment.name,
        lastName: '',
        organization,
        family: { id: 1, organization },
      },
      site: site,
    };
  }
}
