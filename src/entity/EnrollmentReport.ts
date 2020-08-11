import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

import { EnrollmentReport as EnrollmentReportInterface } from 'models';

import { FlattenedEnrollment } from './FlattenedEnrollment';
import { Enrollment } from './Enrollment';

@Entity()
export class EnrollmentReport implements EnrollmentReportInterface {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany((type) => FlattenedEnrollment, (enrollment) => enrollment.report, {
    cascade: true,
    eager: true,
  })
  enrollments: Array<FlattenedEnrollment>;
}
