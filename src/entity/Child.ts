import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';

import {
  Child as ChildInterface,
  Gender,
  SpecialEducationServicesType,
} from '../../client/src/shared/models';

import { Enrollment } from './Enrollment';
import { Family } from './Family';
import { Organization } from './Organization';
import { UpdateMetaData } from './embeddedColumns/UpdateMetaData';
import { Moment } from 'moment';
import { momentTransformer } from './transformers/momentTransformer';
import { Length, MinDate, MaxDate } from "class-validator";

@Entity()
export class Child implements ChildInterface {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  sasid?: string;

  @Column()
  @Length(1)
  firstName: string;

  @Column({ nullable: true })
  middleName?: string;

  @Column()
  @Length(1)
  lastName: string;

  @Column({ nullable: true })
  suffix?: string;

  @Column({ nullable: true, type: 'date', transformer: momentTransformer })
  // TODO: what are the actual age parameters?
  @MinDate(new Date(2010))
  @MaxDate(new Date())
  birthdate?: Moment;

  @Column({ nullable: true })
  @Length(1)
  birthTown?: string;

  @Column({ nullable: true })
  @Length(2)
  birthState?: string;

  @Column({ nullable: true })
  @Length(1)
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

  @Column({ nullable: true, type: 'simple-enum', enum: Gender })
  gender?: Gender;

  @Column({ nullable: true })
  foster?: boolean;

  @Column({ default: false })
  recievesC4K?: boolean = false;

  @Column({ nullable: true })
  recievesSpecialEducationServices?: boolean;

  @Column({
    nullable: true,
    type: 'simple-enum',
    enum: SpecialEducationServicesType,
  })
  specialEducationServicesType?: SpecialEducationServicesType;

  @ManyToOne((type) => Family, { nullable: false })
  family: Family;

  @Column()
  familyId: number;

  @ManyToOne((type) => Organization, { nullable: false })
  organization?: Organization;

  @OneToMany((type) => Enrollment, (enrollment) => enrollment.child)
  enrollments?: Array<Enrollment>;

  @Column((type) => UpdateMetaData, { prefix: false })
  updateMetaData?: UpdateMetaData;
}
