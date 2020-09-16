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
import {
  Length,
  MinDate,
  MaxDate,
  ValidateNested,
  IsNotEmpty,
} from 'class-validator';
import { ChildRaceIndicated } from './decorators/Child/raceValidation';
import { ChildGenderSpecified } from './decorators/Child/genderValidation';
import moment from 'moment';

@Entity()
export class Child implements ChildInterface {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  sasid?: string;

  @Column({ nullable: true })
  name: string;

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
  @IsNotEmpty()
  @MinDate(moment().add(-12, 'years').toDate(), {
    message: 'Birth date must be within last 12 years',
  })
  @MaxDate(moment().toDate(), { message: 'Birth date must be in the past' })
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
  @IsNotEmpty()
  // No default value because this is a radio button
  hispanicOrLatinxEthnicity?: boolean;

  @Column({ nullable: true, type: 'simple-enum', enum: Gender })
  @ChildGenderSpecified()
  gender?: Gender;

  @Column({ default: false })
  foster?: boolean;

  @Column({ default: false })
  receivesC4K?: boolean = false;

  @Column({ nullable: true })
  receivesSpecialEducationServices?: boolean;

  @Column({
    nullable: true,
    type: 'simple-enum',
    enum: SpecialEducationServicesType,
  })
  specialEducationServicesType?: SpecialEducationServicesType;

  @ValidateNested()
  @ManyToOne(() => Family, { nullable: false })
  family: Family;

  @ManyToOne(() => Organization, { nullable: false })
  organization?: Organization;

  @ValidateNested({ each: true })
  @OneToMany(() => Enrollment, (enrollment) => enrollment.child)
  enrollments?: Array<Enrollment>;

  @Column(() => UpdateMetaData, { prefix: false })
  updateMetaData?: UpdateMetaData;
}
