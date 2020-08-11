import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';

import { Child as ChildInterface } from 'shared/models';

import { Enrollment } from './Enrollment';
import { Family } from './Family';
import { Gender } from './enums/Gender';
import { Organization } from './Organization';
import { UpdateMetaData } from './embeddedColumns/UpdateMetaData';

@Entity()
export class Child implements ChildInterface {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  sasid?: string;

  @Column()
  firstName: string;

  @Column({ nullable: true })
  middleName?: string;

  @Column()
  lastName: string;

  @Column({ nullable: true })
  suffix?: string;

  @Column({ nullable: true })
  birthdate?: Date;

  @Column({ nullable: true })
  birthTown?: string;

  @Column({ nullable: true })
  birthState?: string;

  @Column({ nullable: true })
  birthCertificateId?: string;

  @Column({ nullable: true })
  americanIndianOrAlaskaNative?: boolean;

  @Column({ nullable: true })
  asian?: boolean;

  @Column({ nullable: true })
  blackOrAfricanAmerican?: boolean;

  @Column({ nullable: true })
  nativeHawaiianOrPacificIslander?: boolean;

  @Column({ nullable: true })
  white?: boolean;

  @Column({ nullable: true })
  hispanicOrLatinxEthnicity?: boolean;

  @Column({ nullable: true, type: 'enum', enum: Gender })
  gender?: Gender;

  @Column({ nullable: true })
  foster?: boolean;

  @Column({ default: false })
  recievesC4K?: boolean = false;

  @ManyToOne((type) => Family, { nullable: false })
  family: Family;

  @ManyToOne((type) => Organization, { nullable: false })
  organization?: Organization;

  @OneToMany((type) => Enrollment, (enrollment) => enrollment.child)
  enrollments?: Array<Enrollment>;

  @Column((type) => UpdateMetaData, { prefix: false })
  updateMetaData?: UpdateMetaData;
}
