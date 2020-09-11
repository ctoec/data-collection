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
import { Length, MinDate, MaxDate, ValidateNested, IsNotEmpty, isNotEmpty } from "class-validator";
import { ChildRaceIndicated } from './decorators/childRaceValidation';
import { ChildGenderSpecified } from './decorators/childGenderValidation';
import moment from 'moment';

@Entity()
export class Child implements ChildInterface {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  sasid?: string;

  @Column()
  @IsNotEmpty({ message: 'First name is required' })
  firstName: string;

  @Column({ nullable: true })
  middleName?: string;

  @Column()
  @IsNotEmpty({ message: 'Last name is required' })
  lastName: string;

  @Column({ nullable: true })
  suffix?: string;

  @Column({ nullable: true, type: 'date', transformer: momentTransformer })
  @IsNotEmpty() // do we need this?
  // TODO: what are the actual age parameters?
  @MinDate(moment().add(-7, 'years').toDate(), { message: 'Birth date must be within last 7 years' })
  @MaxDate(moment().add(-6, 'weeks').toDate(), { message: 'Child must be older than 6 weeks' })
  birthdate?: Moment;

  @Column({ nullable: true })
  @IsNotEmpty({ message: 'Birth town is required' })
  birthTown?: string;

  @Column({ nullable: true })
  // TODO: do we account for birth certs from outside the US?
  @Length(2)
  birthState?: string;

  @Column({ nullable: true })
  @IsNotEmpty({ message: 'Birth certificate ID is required' })
  birthCertificateId?: string;

  @Column({ nullable: true })
  @ChildRaceIndicated()
  americanIndianOrAlaskaNative?: boolean;

  @Column({ nullable: true })
  @ChildRaceIndicated()
  asian?: boolean;

  @Column({ nullable: true })
  @ChildRaceIndicated()
  blackOrAfricanAmerican?: boolean;

  @Column({ nullable: true })
  @ChildRaceIndicated()
  nativeHawaiianOrPacificIslander?: boolean;

  @Column({ nullable: true })
  @ChildRaceIndicated()
  white?: boolean;

  @Column({ nullable: true })
  hispanicOrLatinxEthnicity?: boolean;

  @Column({ nullable: true, type: 'simple-enum', enum: Gender })
  @ChildGenderSpecified()
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

  @ValidateNested()
  @ManyToOne((type) => Family, { nullable: false })
  family: Family;

  @Column()
  familyId: number;

  @ManyToOne((type) => Organization, { nullable: false })
  organization?: Organization;

  @ValidateNested({ each: true })
  @OneToMany((type) => Enrollment, (enrollment) => enrollment.child)
  enrollments?: Array<Enrollment>;

  @Column((type) => UpdateMetaData, { prefix: false })
  updateMetaData?: UpdateMetaData;
}
