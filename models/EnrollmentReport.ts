import { FlattenedEnrollment } from './';

export interface EnrollmentReport {
  id: number;
  enrollments: Array<FlattenedEnrollment>;
}
