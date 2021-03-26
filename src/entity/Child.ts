import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  DeleteDateColumn,
  BeforeUpdate,
  BeforeInsert,
} from 'typeorm';
import moment, { Moment } from 'moment';
import {
  ValidateNested,
  IsNotEmpty,
  ValidationError,
  ValidateIf,
} from 'class-validator';

import {
  Child as ChildInterface,
  Gender,
  BirthCertificateType,
  UndefinableBoolean,
} from '../../client/src/shared/models';

import { Enrollment } from './Enrollment';
import { Family } from './Family';
import { Organization } from './Organization';
import { UpdateMetaData } from './embeddedColumns/UpdateMetaData';
import { momentTransformer, enumTransformer } from './transformers';
import { ChildRaceIndicated } from './decorators/Child/raceValidation';
import { ChildGenderSpecified } from './decorators/Child/genderValidation';
import { MomentComparison } from './decorators/momentValidators';
import { FundedEnrollmentValidation } from './decorators/Child/fundedEnrollmentValidation';
import { EnrollmentDatesCannotOverlapValidation } from './decorators/Child/enrollmentDatesValidation';

@Entity()
export class Child implements ChildInterface {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  sasid?: string;

  @Column({ nullable: true })
  uniqueId?: string;

  @Column({ nullable: true })
  @IsNotEmpty()
  firstName?: string;

  @Column({ nullable: true })
  middleName?: string;

  @Column({ nullable: true })
  @IsNotEmpty()
  lastName?: string;

  @Column({ nullable: true })
  suffix?: string;

  @Column({ nullable: true, type: 'date', transformer: momentTransformer })
  @IsNotEmpty()
  @MomentComparison({
    compareFunc: (birthdate: Moment) => birthdate.isBefore(moment()),
    message: 'Birthdate cannot be in the future.',
  })
  birthdate?: Moment;

  @Column({
    type: 'varchar',
    length: 30,
    nullable: true,
    transformer: enumTransformer(BirthCertificateType),
  })
  @IsNotEmpty()
  birthCertificateType?: BirthCertificateType;

  @Column({ nullable: true })
  birthTown?: string;

  @Column({ nullable: true })
  birthState?: string;

  @Column({ nullable: true })
  @ValidateIf((o) => {
    //Only validate if Type is US and birthTown or birthState have data
    //Will be set to null otherwise
    if (o.birthCertificateType !== BirthCertificateType.US) {
      return false;
    }
    return o.birthTown || o.birthState;
  })
  @IsNotEmpty()
  birthCertificateId?: string;

  @BeforeInsert()
  @BeforeUpdate()
  updateBirthCertificate?(): void {
    const townEmpty = !this.birthTown;
    const stateEmpty = !this.birthState;
    const idEmpty = !this.birthCertificateId;

    if (this.birthCertificateType === BirthCertificateType.US) {
      //If birthCertificateType is set to US, but no info provided, change to Unavailable
      if (townEmpty && stateEmpty && idEmpty) {
        this.birthCertificateType = BirthCertificateType.Unavailable;
        this.birthTown = '';
        this.birthState = '';
      } else {
        //If there is some information, but town or state are empty, set to null
        //This will set them to "not collected"
        if (townEmpty) this.birthTown = null;
        if (stateEmpty) this.birthState = null;
      }
    } else {
      //If birthCertificateType is not US, set town and state to empty so
      //they aren't checked as "not collected"
      if (townEmpty) this.birthTown = '';
      if (stateEmpty) this.birthState = '';
    }
  }

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
  @ChildRaceIndicated()
  raceNotDisclosed?: boolean;

  @Column({
    type: 'varchar',
    length: 20,
    nullable: true,
    transformer: enumTransformer(UndefinableBoolean),
  })
  @IsNotEmpty()
  hispanicOrLatinxEthnicity?: UndefinableBoolean;

  @Column({
    type: 'varchar',
    length: 20,
    nullable: true,
    transformer: enumTransformer(Gender),
  })
  @ChildGenderSpecified()
  gender?: Gender;

  @Column({
    type: 'varchar',
    length: 20,
    nullable: true,
    transformer: enumTransformer(UndefinableBoolean),
  })
  @IsNotEmpty()
  dualLanguageLearner?: UndefinableBoolean;

  @Column({
    type: 'varchar',
    length: 20,
    nullable: true,
    transformer: enumTransformer(UndefinableBoolean),
  })
  @IsNotEmpty()
  foster?: UndefinableBoolean;

  @Column({
    type: 'varchar',
    length: 20,
    nullable: true,
    transformer: enumTransformer(UndefinableBoolean),
  })
  @IsNotEmpty()
  receivesDisabilityServices?: UndefinableBoolean;

  @ValidateNested()
  @IsNotEmpty()
  @ManyToOne(() => Family)
  family?: Family;

  @ManyToOne(() => Organization, { nullable: false })
  organization: Organization;

  @Column()
  organizationId: number;

  @ValidateNested({ each: true })
  @OneToMany(() => Enrollment, (enrollment) => enrollment.child, {
    cascade: ['soft-remove'],
  })
  @FundedEnrollmentValidation()
  @EnrollmentDatesCannotOverlapValidation()
  enrollments?: Array<Enrollment>;

  @Column(() => UpdateMetaData, { prefix: false })
  updateMetaData: UpdateMetaData;

  @DeleteDateColumn()
  deletedDate: Date;

  validationErrors?: ValidationError[];
}
