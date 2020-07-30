import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { EnrollmentReport } from './EnrollmentReport';
import {
  TemplateMeta,
  DATE_DESCRIPTION,
  TEXT_DESCRIPTION,
  BOOLEAN_DESCRIPTION,
  NUMBER_DESCRIPTION,
} from '../decorators/templateMetadata';

export const TEMPLATE_SECTIONS = {
  CHILD_INFO: 'Child info',
  FAMILY_INFO: 'Family info',
  FAMILY_INCOME_DETERMINATION: 'Family income determination',
  ENROLLMENT_FUNDING: 'Enrollment and funding',
};

@Entity()
export class FlattenedEnrollment {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne((type) => EnrollmentReport)
  report: EnrollmentReport;

  @Column({ nullable: true })
  externalId?: string;

  @Column({ nullable: true })
  @TemplateMeta({
    title: 'SASID',
    description: 'Valid SASID (10-digit number)',
    section: TEMPLATE_SECTIONS.CHILD_INFO,
  })
  sasid?: number;

  @Column({ nullable: true })
  @TemplateMeta({
    title: 'Name',
    description: 'Text; full name, separated by spaces',
    section: TEMPLATE_SECTIONS.CHILD_INFO,
  })
  name?: string;

  @Column({ nullable: true })
  @TemplateMeta({
    title: 'Date of birth',
    description: DATE_DESCRIPTION,
    section: TEMPLATE_SECTIONS.CHILD_INFO,
  })
  dateOfBirth?: Date;

  @Column({ nullable: true })
  @TemplateMeta({
    title: 'Birth certificate ID #',
    description: TEXT_DESCRIPTION,
    section: TEMPLATE_SECTIONS.CHILD_INFO,
  })
  birthCertificateId?: string;

  @Column({ nullable: true })
  @TemplateMeta({
    title: 'Town of birth',
    description: TEXT_DESCRIPTION,
    section: TEMPLATE_SECTIONS.CHILD_INFO,
  })
  townOfBirth?: string;

  @Column({ nullable: true })
  @TemplateMeta({
    title: 'State of birth',
    description: TEXT_DESCRIPTION,
    section: TEMPLATE_SECTIONS.CHILD_INFO,
  })
  stateOfBirth?: string;

  @Column({ nullable: true })
  @TemplateMeta({
    title: 'Race: American Indian or Alaska Native',
    description: BOOLEAN_DESCRIPTION,
    section: TEMPLATE_SECTIONS.CHILD_INFO,
  })
  americanIndianOrAlaskaNative?: string;

  @Column({ nullable: true })
  @TemplateMeta({
    title: 'Race: Asian',
    description: BOOLEAN_DESCRIPTION,
    section: TEMPLATE_SECTIONS.CHILD_INFO,
  })
  asian?: string;

  @Column({ nullable: true })
  @TemplateMeta({
    title: 'Race: Black or African American',
    description: BOOLEAN_DESCRIPTION,
    section: TEMPLATE_SECTIONS.CHILD_INFO,
  })
  blackOrAfricanAmerican?: string;

  @Column({ nullable: true })
  @TemplateMeta({
    title: 'Race: Native Hawaiian or Pacific Islander',
    description: BOOLEAN_DESCRIPTION,
    section: TEMPLATE_SECTIONS.CHILD_INFO,
  })
  nativeHawaiianOrPacificIslander?: string;

  @Column({ nullable: true })
  @TemplateMeta({
    title: 'Race: White',
    description: BOOLEAN_DESCRIPTION,
    section: TEMPLATE_SECTIONS.CHILD_INFO,
  })
  white?: string;

  @Column({ nullable: true })
  @TemplateMeta({
    title: 'Hispanic or Latinx ethnicity',
    description: BOOLEAN_DESCRIPTION,
    section: TEMPLATE_SECTIONS.CHILD_INFO,
  })
  ethnicity?: string;

  @Column({ nullable: true })
  @TemplateMeta({
    title: 'Gender',
    description: "'Female', 'Male', 'Nonbinary', 'Unspecified'",
    section: TEMPLATE_SECTIONS.CHILD_INFO,
  })
  gender?: string;

  @Column({ nullable: true })
  @TemplateMeta({
    title: 'Dual language learner',
    description: BOOLEAN_DESCRIPTION,
    section: TEMPLATE_SECTIONS.CHILD_INFO,
  })
  dualLanguageLearner?: boolean;

  @Column({ nullable: true })
  @TemplateMeta({
    title: 'Receiving special education services',
    description: BOOLEAN_DESCRIPTION,
    section: TEMPLATE_SECTIONS.CHILD_INFO,
  })
  receivingSpecialEducationServices?: boolean;

  @Column({ nullable: true })
  @TemplateMeta({
    title: 'Special education services type',
    description: "'LEA', 'Non-LEA'",
    section: TEMPLATE_SECTIONS.CHILD_INFO,
  })
  specialEducationServicesType?: string;

  @Column({ nullable: true })
  @TemplateMeta({
    title: 'Address (line 1)',
    description: TEXT_DESCRIPTION,
    section: TEMPLATE_SECTIONS.FAMILY_INFO,
  })
  addressLine1?: string;

  @Column({ nullable: true })
  @TemplateMeta({
    title: 'Address (line 2)',
    description: TEXT_DESCRIPTION,
    section: TEMPLATE_SECTIONS.FAMILY_INFO,
  })
  addressLine2?: string;

  @Column({ nullable: true })
  @TemplateMeta({
    title: 'Town',
    description: TEXT_DESCRIPTION,
    section: TEMPLATE_SECTIONS.FAMILY_INFO,
  })
  town?: string;

  @Column({ nullable: true })
  @TemplateMeta({
    title: 'State',
    description: "'CT', 'MA', 'NY', 'RI'",
    section: TEMPLATE_SECTIONS.FAMILY_INFO,
  })
  state?: string;

  @Column({ nullable: true })
  @TemplateMeta({
    title: 'Zipcode',
    description: 'Valid zipcode (5-digit number)',
    section: TEMPLATE_SECTIONS.FAMILY_INFO,
  })
  zipcode?: string;

  @Column({ nullable: true })
  @TemplateMeta({
    title: 'Lives with foster family',
    description: BOOLEAN_DESCRIPTION,
    section: TEMPLATE_SECTIONS.FAMILY_INFO,
  })
  livesWithFosterFamily?: boolean;

  @Column({ nullable: true })
  @TemplateMeta({
    title: 'Experienced homelessness or housing insecurity',
    description: BOOLEAN_DESCRIPTION,
    section: TEMPLATE_SECTIONS.FAMILY_INFO,
  })
  experiencedHomelessnessOrHousingInsecurity?: boolean;

  @Column({ nullable: true })
  @TemplateMeta({
    title: 'Household size',
    description: NUMBER_DESCRIPTION,
    section: TEMPLATE_SECTIONS.FAMILY_INCOME_DETERMINATION,
  })
  householdSize?: number;

  @Column({ nullable: true, comment: 'Annual household income\nNumber' })
  @TemplateMeta({
    title: 'Annual household income',
    description: NUMBER_DESCRIPTION,
    section: TEMPLATE_SECTIONS.FAMILY_INCOME_DETERMINATION,
  })
  annualHouseholdIncome?: number;

  @Column({ nullable: true })
  @TemplateMeta({
    title: 'Determination date',
    description: DATE_DESCRIPTION,
    section: TEMPLATE_SECTIONS.FAMILY_INCOME_DETERMINATION,
  })
  incomeDeterminationDate?: Date;

  @Column({ nullable: true })
  @TemplateMeta({
    title: 'Provider',
    description: 'Text; provider program name',
    section: TEMPLATE_SECTIONS.ENROLLMENT_FUNDING,
  })
  provider?: string;

  @Column({ nullable: true })
  @TemplateMeta({
    title: 'Site',
    description: 'Text; site name',
    section: TEMPLATE_SECTIONS.ENROLLMENT_FUNDING,
  })
  site?: string;

  @Column({ nullable: true })
  @TemplateMeta({
    title: 'Age group',
    description: "'Infant/Toddler', 'Preschool', 'School age'",
    section: TEMPLATE_SECTIONS.ENROLLMENT_FUNDING,
  })
  ageGroup?: string;

  @Column({ nullable: true })
  @TemplateMeta({
    title: 'Enrollment start date',
    description: DATE_DESCRIPTION,
    section: TEMPLATE_SECTIONS.ENROLLMENT_FUNDING,
  })
  enrollmentStartDate?: Date;

  @Column({ nullable: true })
  @TemplateMeta({
    title: 'Enrollment start date',
    description: DATE_DESCRIPTION,
    section: TEMPLATE_SECTIONS.ENROLLMENT_FUNDING,
  })
  enrollmentEndDate?: Date;

  @Column({ nullable: true })
  @TemplateMeta({
    title: 'Enrollment exit reason',
    description: 'Text; reason child withdrew from program',
    section: TEMPLATE_SECTIONS.ENROLLMENT_FUNDING,
  })
  enrollmentExitReason?: string;

  @Column({ nullable: true })
  @TemplateMeta({
    title: 'Funding type',
    description: "'CSR', 'PSR', 'CDC', 'HS-SS', 'HE/EHS'",
    section: TEMPLATE_SECTIONS.ENROLLMENT_FUNDING,
  })
  fundingType?: string;

  @Column({ nullable: true })
  @TemplateMeta({
    title: 'Space type',
    description:
      "'Full day', 'School day', 'Part day', 'Extended day', 'Full time', 'Part time', 'Part time/Full time'",
    section: TEMPLATE_SECTIONS.ENROLLMENT_FUNDING,
  })
  spaceType?: string;

  @Column({ nullable: true })
  @TemplateMeta({
    title: 'First funding period',
    description:
      'Valid date like MM/YYYY representing the month and year of the reporting period',
    section: TEMPLATE_SECTIONS.ENROLLMENT_FUNDING,
  })
  firstFundingPeriod?: string;

  @Column({ nullable: true })
  @TemplateMeta({
    title: 'Last funding period',
    description:
      'Valid date like MM/YYYY representing the month and year of the reporting period',
    section: TEMPLATE_SECTIONS.ENROLLMENT_FUNDING,
  })
  lastFundingPeriod?: string;

  @Column({ nullable: true })
  @TemplateMeta({
    title: 'Model',
    description: "'In person', 'Virtual', 'Hybrid'",
    section: TEMPLATE_SECTIONS.ENROLLMENT_FUNDING,
  })
  model?: string;

  @Column({ nullable: true })
  @TemplateMeta({
    title: 'Receiving Care 4 Kids',
    description: BOOLEAN_DESCRIPTION,
    section: TEMPLATE_SECTIONS.ENROLLMENT_FUNDING,
  })
  receivingCareForKids?: boolean;
}
