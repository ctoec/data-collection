import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

import { EnrollmentReport as EnrollmentReportInterface } from '../../shared/models';

import { FlattenedEnrollment } from './FlattenedEnrollment';

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
