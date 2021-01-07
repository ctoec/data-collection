import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  DeleteDateColumn,
  AfterUpdate,
  getManager,
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
import { ChildBirthCertificateSpecified } from './decorators/Child/birthCertificateValidation';
import { FundedEnrollmentValidation } from './decorators/Child/fundedEnrollmentValidation';

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
    compareFunc: (birthdate: Moment) =>
      birthdate.isSameOrAfter(moment().add(-12, 'years')),
    message: 'Birthdate must be within last 12 years.',
  })
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
  @ValidateIf((o) => o.birthCertificateType === BirthCertificateType.US)
  @ChildBirthCertificateSpecified()
  birthTown?: string;

  @Column({ nullable: true })
  @ValidateIf((o) => o.birthCertificateType === BirthCertificateType.US)
  @ChildBirthCertificateSpecified()
  birthState?: string;

  @Column({ nullable: true })
  @ValidateIf((o) => o.birthCertificateType === BirthCertificateType.US)
  @IsNotEmpty()
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
  @OneToMany(() => Enrollment, (enrollment) => enrollment.child)
  @FundedEnrollmentValidation()
  enrollments?: Array<Enrollment>;

  @Column(() => UpdateMetaData, { prefix: false })
  updateMetaData: UpdateMetaData;

  @DeleteDateColumn()
  deletedDate: Date;

  @AfterUpdate()
  async cascadeDeleteEnrollments() {
    if (this.deletedDate !== null) {
      await Promise.all(
        this.enrollments.map(
          async (e) => await getManager().softRemove(Enrollment, e)
        )
      );
    }
  }

  validationErrors?: ValidationError[];
}
