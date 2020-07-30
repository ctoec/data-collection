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
  externalId?: string;

  @Column({ nullable: true, comment: 'SASID\nValid SASID (10 digit number)' })
  sasid?: number;

  @Column({
    nullable: true,
    comment:
      'Name\nText with spaces separating first, middle, and last names and any name suffix',
  })
  name?: string;

  @Column({
    nullable: true,
    comment:
      "Date of birth\nValid date like 'MM/DD/YYYY', 'MM/DD/YY', 'MM-DD-YYYY', 'MM-DD-YY', 'YYYY-MM-DD', 'YY-MM-DD'",
  })
  dateOfBirth?: Date;

  @Column({ nullable: true, comment: 'Birth certificate ID #\nText' })
  birthCertificateId?: string;

  @Column({ nullable: true, comment: 'Town of birth\nText' })
  townOfBirth?: string;

  @Column({ nullable: true, comment: 'State of birth\nText' })
  stateOfBirth?: string;

  @Column({
    nullable: true,
    comment:
      "Race: American Indian or Alaska Native\n'Yes', 'yes', 'Y', 'y', 'No', 'no', 'N', 'n'",
  })
  americanIndianOrAlaskaNative?: string;

  @Column({
    nullable: true,
    comment: "Race: Asian\n'Yes', 'yes', 'Y', 'y', 'No', 'no', 'N', 'n'",
  })
  asian?: string;

  @Column({
    nullable: true,
    comment:
      "Race: Black or African American\n'Yes', 'yes', 'Y', 'y', 'No', 'no', 'N', 'n'",
  })
  blackOrAfricanAmerican?: string;

  @Column({
    nullable: true,
    comment:
      "Race: Native Hawaiian or Pacific Islander\n'Yes', 'yes', 'Y', 'y', 'No', 'no', 'N', 'n'",
  })
  nativeHawaiianOrPacificIslander?: string;

  @Column({
    nullable: true,
    comment: "Race: White\n'Yes', 'yes', 'Y', 'y', 'No', 'no', 'N', 'n'",
  })
  white?: string;

  @Column({
    nullable: true,
    comment:
      "Ethnicity: Hispanic or Latinx\n'Yes', 'yes', 'Y', 'y', 'No', 'no', 'N', 'n'",
  })
  ethnicity?: string;

  @Column({
    nullable: true,
    comment: "Gender\n'Male', 'Female', 'Nonbinary', 'Unspecified'",
  })
  gender?: string;

  @Column({
    nullable: true,
    comment:
      "Dual langugage learner\n'Yes', 'yes', 'Y', 'y', 'No', 'no', 'N', 'n'",
  })
  dualLanguageLearner?: boolean;

  @Column({
    nullable: true,
    comment:
      "Receiving special education services\n'Yes', 'yes', 'Y', 'y', 'No', 'no', 'N', 'n'",
  })
  receivingSpecialEducationServices?: boolean;

  @Column({ nullable: true })
  specialEducationServicesType?: string;

  @Column({ nullable: true, comment: 'Address (line 1)\nText' })
  addressLine1?: string;

  @Column({ nullable: true, comment: 'Address (line 2)\nText' })
  addressLine2?: string;

  @Column({ nullable: true, comment: 'Town\nText' })
  town?: string;

  @Column({ nullable: true, comment: "State\n'CT', 'MA', 'NY', 'RI'" })
  state?: string;

  @Column({
    nullable: true,
    comment: 'Zipcode\nValid zipcode (5-digit number)',
  })
  zipcode?: string;

  @Column({
    nullable: true,
    comment:
      "Lives with foster family\n'Yes', 'yes', 'Y', 'y', 'No', 'no', 'N', 'n'",
  })
  livesWithFosterFamily?: boolean;

  @Column({
    nullable: true,
    comment:
      "Experienced homeless or housing insecurity\n'Yes', 'yes', 'Y', 'y', 'No', 'no', 'N', 'n'",
  })
  experiencedHomelessnessOrHousingInsecurity?: boolean;

  @Column({ nullable: true, comment: 'Household size\nNumber' })
  householdSize?: number;

  @Column({ nullable: true, comment: 'Annual household income\nNumber' })
  annualHouseholdIncome?: number;

  @Column({
    nullable: true,
    comment:
      "Determination date\nValid date like 'MM/DD/YYYY', 'MM/DD/YY', 'MM-DD-YYYY', 'MM-DD-YY', 'YYYY-MM-DD', 'YY-MM-DD'",
  })
  incomeDeterminationDate?: Date;

  @Column({ nullable: true, comment: 'Provider\nProvider program name' })
  provider?: string;

  @Column({ nullable: true, comment: 'Site\nSite name' })
  site?: string;

  @Column({
    nullable: true,
    comment: "Age group\n'Infant/Toddler', 'Preschool', 'School age'",
  })
  ageGroup?: string;

  @Column({
    nullable: true,
    comment:
      "Enrollment start date\nValid date like 'MM/DD/YYYY', 'MM/DD/YY', 'MM-DD-YYYY', 'MM-DD-YY', 'YYYY-MM-DD', 'YY-MM-DD'",
  })
  enrollmentStartDate?: Date;

  @Column({
    nullable: true,
    comment:
      "Enrollment end date\nValid date like 'MM/DD/YYYY', 'MM/DD/YY', 'MM-DD-YYYY', 'MM-DD-YY', 'YYYY-MM-DD', 'YY-MM-DD'",
  })
  enrollmentEndDate?: Date;

  @Column({
    nullable: true,
    comment:
      "Enrollment exit reason\n'Aged out', 'Stopped attending', 'Chose to attend a different program', 'Moved within CT', 'Moved to another state', 'Withdrew due to lack of payment', 'Child was asked to leave', 'Unknown', or other description of the reason the child withdrew",
  })
  enrollmentExitReason?: string;

  @Column({
    nullable: true,
    comment: "Funding type\n'CSR', 'PSR', 'CDC', 'SS', 'SHS'",
  })
  fundingType?: string;

  @Column({
    nullable: true,
    comment:
      "Space type\n'Full day', 'School day', 'Part day', 'Extended day', 'Full time', 'Part time', 'Part time/Full time'",
  })
  spaceType?: string;

  @Column({
    nullable: true,
    comment:
      'First funding period\nValid date like MM/YYYY representing the month and year of the reporting period',
  })
  firstFundingPeriod?: string;

  @Column({
    nullable: true,
    comment:
      'Last funding period\nValid date like MM/YYYY representing the month and year of the reporting period',
  })
  lastFundingPeriod?: string;

  @Column({ nullable: true, comment: "Model\n'In person', 'Virtual'" })
  model?: string;

  @Column({
    nullable: true,
    comment:
      "Receiving Care 4 Kids\n'Yes', 'yes', 'Y', 'y', 'No', 'no', 'N', 'n'",
  })
  receivingCareForKids?: boolean;
}
