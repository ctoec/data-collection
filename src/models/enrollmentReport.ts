import { FlattenedEnrollment } from './flattenedEnrollment';

export interface EnrollmentReport {
  id: number;
  enrollments: FlattenedEnrollment[];
}
