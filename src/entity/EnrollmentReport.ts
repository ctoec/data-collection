import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { FlattenedEnrollment } from './FlattenedEnrollment';

@Entity()
export class EnrollmentReport {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany((type) => FlattenedEnrollment, (enrollment) => enrollment.report, {
    cascade: true,
    eager: true,
  })
  enrollments: Array<FlattenedEnrollment>;
}
