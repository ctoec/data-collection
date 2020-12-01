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
  UndefinableBoolean
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
  @IsNotEmpty({ message: 'First name is required' })
  firstName?: string;

  @Column({ nullable: true })
  middleName?: string;

  @Column({ nullable: true })
  @IsNotEmpty({ message: 'Last name is required' })
  lastName?: string;

  @Column({ nullable: true })
  suffix?: string;

  @Column({ nullable: true, type: 'date', transformer: momentTransformer })
  @IsNotEmpty()
  @MomentComparison({
    compareFunc: (birthdate: Moment) =>
      birthdate.isSameOrAfter(moment().add(-12, 'years')),
    message: 'Birth date must be within last 12 years',
  })
  @MomentComparison({
    compareFunc: (birthdate: Moment) => birthdate.isBefore(moment()),
    message: 'Birth date must be in the past',
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

  @Column({
    type: 'varchar',
    length: 20,
    nullable: true,
    transformer: enumTransformer(UndefinableBoolean),
  })
  @ChildRaceIndicated()
  raceNotDisclosed?: UndefinableBoolean;

  @Column({
    type: 'varchar',
    length: 20,
    nullable: true,
    transformer: enumTransformer(UndefinableBoolean),
  })
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
  }) dualLanguageLearner?: UndefinableBoolean;

  @Column({
    type: 'varchar',
    length: 20,
    nullable: true,
    transformer: enumTransformer(UndefinableBoolean),
  })
  foster?: UndefinableBoolean;

  @Column({
    type: 'varchar',
    length: 20,
    nullable: true,
    transformer: enumTransformer(UndefinableBoolean),
  })
  receivesDisabilityServices?: UndefinableBoolean;

  @ValidateNested()
  @ValidateIf((child) => {
    if (child.family) child.family.childIsFoster = child.foster;
    // This value is used in family to conditionally validate income determinations and then removed
    return true;
  })
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
