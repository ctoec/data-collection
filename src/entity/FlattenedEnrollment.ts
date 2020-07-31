import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  ManyToOne,
} from 'typeorm';
import { EnrollmentReport } from './EnrollmentReport';

@Entity()
export class FlattenedEnrollment {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne((type) => EnrollmentReport)
  report: EnrollmentReport;

  @Column({ nullable: true })
  name?: string;

  @Column({ nullable: true })
  sasid?: number;

  @Column({ nullable: true })
  dateOfBirth?: Date;

  @Column({ nullable: true })
  birthCertificateId?: string;

  @Column({ nullable: true })
  townOfBirth?: string;

  @Column({ nullable: true })
  stateOfBirth?: string;

  @Column({ nullable: true })
  americanIndianOrAlaskaNative?: string;

  @Column({ nullable: true })
  asian?: string;

  @Column({ nullable: true })
  blackOrAfricanAmerican?: string;

  @Column({ nullable: true })
  nativeHawaiianOrPacificIslander?: string;

  @Column({ nullable: true })
  white?: string;

  @Column({ nullable: true })
  ethnicity?: string;

  @Column({ nullable: true })
  gender?: string;

  @Column({ nullable: true })
  dualLanguageLearner?: boolean;

  @Column({ nullable: true })
  receivingSpecialEducationServices?: boolean;

  @Column({ nullable: true })
  specialEducationServicesType?: string;

  @Column({ nullable: true })
  addressLine1?: string;

  @Column({ nullable: true })
  addressLine2?: string;

  @Column({ nullable: true })
  town?: string;

  @Column({ nullable: true })
  state?: string;

  @Column({ nullable: true })
  zipcode?: string;

  @Column({ nullable: true })
  livesWithFosterFamily?: boolean;

  @Column({ nullable: true })
  experiencedHomelessnessOrHousingInsecurity?: boolean;

  @Column({ nullable: true })
  householdSize?: number;

  @Column({ nullable: true })
  annualHouseholdIncome?: number;

  @Column({ nullable: true })
  incomeDeterminationDate?: Date;

  @Column({ nullable: true })
  provider?: string;

  @Column({ nullable: true })
  site?: string;

  @Column({ nullable: true })
  model?: string;

  @Column({ nullable: true })
  ageGroup?: string;

  @Column({ nullable: true })
  enrollmentStartDate?: Date;

  @Column({ nullable: true })
  enrollmentEndDate?: Date;

  @Column({ nullable: true })
  enrollmentExitReason?: string;

  @Column({ nullable: true })
  fundingType?: string;

  @Column({ nullable: true })
  spaceType?: string;

  @Column({ nullable: true })
  firstFundingPeriod?: string;

  @Column({ nullable: true })
  lastFundingPeriod?: string;

  @Column({ nullable: true })
  receivingCareForKids?: boolean;
}
