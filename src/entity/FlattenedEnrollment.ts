import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

import {
  FlattenedEnrollment as FlattenedEnrollmentInterface,
  Gender,
  SpecialEducationServicesType,
  AgeGroup,
  FundingSource,
  FundingTime,
} from '../../client/src/shared/models';

import { EnrollmentReport } from './EnrollmentReport';
import {
  ColumnMetadata,
  REQUIRED,
  OPTIONAL,
  REQUIRED_IF_US_BORN,
  REQUIRED_AT_LEAST_ONE,
  BOOLEAN_FORMAT,
  DEMOGRAPHIC_REPORTING_REASON,
  DATE_FORMAT,
  GEOGRAPHIC_REPORTING_REASON,
  REQUIRED_NOT_FOSTER,
  UTILIZATION_REPORTING_REASON,
  REPORTING_REASON,
  REPORTING_PERIOD_FORMAT,
} from './decorators/columnMetadata';
import { Moment } from 'moment';
import { momentTransformer } from './transformers/momentTransformer';

export const SECTIONS = {
  CHILD_INFO: 'Child information',
  FAMILY_INFO: 'Family information',
  FAMILY_INCOME: 'Family income determination',
  ENROLLMENT_FUNDING: 'Enrollment and funding',
};

@Entity()
export class FlattenedEnrollment implements FlattenedEnrollmentInterface {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne((type) => EnrollmentReport, { nullable: false })
  report: EnrollmentReport;

  @Column()
  reportId: number;

  @Column({ nullable: true })
  @ColumnMetadata({
    formattedName: 'First Name',
    required: REQUIRED,
    definition: "Legal name as it appears on the child's birth certificate.",
    reason:
      'Used for linking to a variety of datasets, including SASID-backed data.',
    format: 'Text',
    example: 'Firstname',
    section: SECTIONS.CHILD_INFO,
  })
  firstName?: string;

  @Column({ nullable: true })
  @ColumnMetadata({
    formattedName: 'Middle Name',
    required: OPTIONAL,
    definition: "Legal name as it appears on the child's birth certificate.",
    reason:
      'Used for linking to a variety of datasets, including SASID-backed data.',
    format: 'Text',
    example: 'Middlename',
    section: SECTIONS.CHILD_INFO,
  })
  middleName?: string;

  @Column({ nullable: true })
  @ColumnMetadata({
    formattedName: 'Last Name',
    required: REQUIRED,
    definition: "Legal name as it appears on the child's birth certificate.",
    reason:
      'Used for linking to a variety of datasets, including SASID-backed data.',
    format: 'Text',
    example: 'Lastname',
    section: SECTIONS.CHILD_INFO,
  })
  lastName?: string;

  @Column({ nullable: true })
  @ColumnMetadata({
    formattedName: 'Suffix',
    required: OPTIONAL,
    definition: "Legal name as it appears on the child's birth certificate.",
    reason:
      'Used for linking to a variety of datasets, including SASID-backed data.',
    format: 'Text',
    example: 'Sr',
    section: SECTIONS.CHILD_INFO,
  })
  suffix?: string;

  @Column({ nullable: true })
  @ColumnMetadata({
    formattedName: 'SASID',
    required: OPTIONAL,
    definition: 'The State Assigned Student ID',
    reason: 'Used for linking to SASID-backed data.',
    format: 'Valid SASID (10-digit number)',
    example: '0123456789',
    section: SECTIONS.CHILD_INFO,
  })
  sasid?: string;

  @Column({ nullable: true, type: 'date', transformer: momentTransformer })
  @ColumnMetadata({
    formattedName: 'Date of birth',
    required: REQUIRED,
    definition: "Date of birth as it appears on the child's birth certificate",
    reason:
      'Used for a variety of reporting; allows linking to a variety of data sets, including SASID-backed data.',
    format: DATE_FORMAT,
    example: '10/01/2016',
    section: SECTIONS.CHILD_INFO,
  })
  birthdate?: Moment;

  @Column({ nullable: true })
  @ColumnMetadata({
    formattedName: 'Birth certificate ID #',
    required: REQUIRED_IF_US_BORN,
    definition: "The identification number of the child's birth certificate.",
    reason: 'Tiebreaker for linking to SASID-backed data.',
    format:
      'Text; comprised of numbers, letters, and dashes (-); exact format varies by state/country',
    example: '2015-00-1234567',
    section: SECTIONS.CHILD_INFO,
  })
  birthCertificateId?: string;

  @Column({ nullable: true })
  @ColumnMetadata({
    formattedName: 'Town of birth',
    required: REQUIRED_IF_US_BORN,
    definition:
      "Place of birth as it appears on the child's birth certificate.",
    reason: 'Tiebreaker for linking to SASID-backed data.',
    format: 'Text',
    example: 'Hartford',
    section: SECTIONS.CHILD_INFO,
  })
  birthTown?: string;

  @Column({ nullable: true })
  @ColumnMetadata({
    formattedName: 'State of birth',
    required: REQUIRED_IF_US_BORN,
    definition:
      "Place of birth as it appears on the child's birth certificate.",
    reason: 'Tiebreaker for linking to SASID-backed data.',
    format: 'Text; two-letter state abbreviation',
    example: 'CT',
    section: SECTIONS.CHILD_INFO,
  })
  birthState?: string;

  @Column({ nullable: true })
  @ColumnMetadata({
    formattedName: 'Race: American Indian or Alaska Native',
    required: REQUIRED_AT_LEAST_ONE,
    definition: "The child's race, as identified by the family.",
    reason: DEMOGRAPHIC_REPORTING_REASON,
    format: BOOLEAN_FORMAT,
    example: 'Yes',
    section: SECTIONS.CHILD_INFO,
  })
  americanIndianOrAlaskaNative?: boolean;

  @Column({ nullable: true })
  @ColumnMetadata({
    formattedName: 'Race: Asian',
    required: REQUIRED_AT_LEAST_ONE,
    definition: "The child's race, as identified by the family.",
    reason: DEMOGRAPHIC_REPORTING_REASON,
    format: BOOLEAN_FORMAT,
    example: 'Yes',
    section: SECTIONS.CHILD_INFO,
  })
  asian?: boolean;

  @Column({ nullable: true })
  @ColumnMetadata({
    formattedName: 'Race: Black or African American',
    required: REQUIRED_AT_LEAST_ONE,
    definition: "The child's race, as identified by the family.",
    reason: DEMOGRAPHIC_REPORTING_REASON,
    format: BOOLEAN_FORMAT,
    example: 'Yes',
    section: SECTIONS.CHILD_INFO,
  })
  blackOrAfricanAmerican?: boolean;

  @Column({ nullable: true })
  @ColumnMetadata({
    formattedName: 'Race: Native Hawaiian or Pacific Islander',
    required: REQUIRED_AT_LEAST_ONE,
    definition: "The child's race, as identified by the family.",
    reason: DEMOGRAPHIC_REPORTING_REASON,
    format: BOOLEAN_FORMAT,
    example: 'Yes',
    section: SECTIONS.CHILD_INFO,
  })
  nativeHawaiianOrPacificIslander?: boolean;

  @Column({ nullable: true })
  @ColumnMetadata({
    formattedName: 'Race: White',
    required: REQUIRED_AT_LEAST_ONE,
    definition: "The child's race, as identified by the family.",
    reason: DEMOGRAPHIC_REPORTING_REASON,
    format: BOOLEAN_FORMAT,
    example: 'Yes',
    section: SECTIONS.CHILD_INFO,
  })
  white?: boolean;

  @Column({ nullable: true })
  @ColumnMetadata({
    formattedName: 'Hispanic or Latinx Ethnicity',
    required: REQUIRED,
    definition: "The child's ethnicity, has identified by the family.",
    reason: DEMOGRAPHIC_REPORTING_REASON,
    format: BOOLEAN_FORMAT,
    example: 'Yes',
    section: SECTIONS.CHILD_INFO,
  })
  hispanicOrLatinxEthnicity?: boolean;

  @Column({ nullable: true })
  @ColumnMetadata({
    formattedName: 'Gender',
    required: REQUIRED,
    definition:
      "The child's gender, as identified by the family (not as it appears on the birth certificate).",
    reason: 'Allows linking to SASID-backed data',
    format: Object.values(Gender).join(', '),
    example: 'Nonbinary',
    section: SECTIONS.CHILD_INFO,
  })
  gender?: string;

  @Column({ nullable: true })
  @ColumnMetadata({
    formattedName: 'Dual language learner',
    required: REQUIRED,
    definition:
      'Children who have a home language other than English and are learning to or more launguages at the same time, or learning a second language while continuing to develop their first language are dual language learners.',
    reason: DEMOGRAPHIC_REPORTING_REASON,
    format: BOOLEAN_FORMAT,
    example: 'Yes',
    section: SECTIONS.CHILD_INFO,
  })
  dualLanguageLearner?: boolean;

  @Column({ nullable: true })
  @ColumnMetadata({
    formattedName: 'Receiving Special Education Services',
    required: REQUIRED,
    definition:
      'Children receiving services with an IEP or an IFSP are receiving special education services.',
    reason: DEMOGRAPHIC_REPORTING_REASON,
    format: BOOLEAN_FORMAT,
    example: 'Yes',
    section: SECTIONS.CHILD_INFO,
  })
  receivesSpecialEducationServices?: boolean;

  @Column({ nullable: true })
  @ColumnMetadata({
    formattedName: 'Special Education Services Type',
    required: 'Required if child is receiving special education services.',
    definition:
      'Whether a child receives special education services from a Local Education Agency (LEA) or another provider.',
    reason: DEMOGRAPHIC_REPORTING_REASON,
    format: Object.values(SpecialEducationServicesType).join(', '),
    example: 'Non-LEA',
    section: SECTIONS.CHILD_INFO,
  })
  specialEducationServicesType?: string;

  @Column({ nullable: true })
  @ColumnMetadata({
    formattedName: 'Street address',
    required: REQUIRED,
    definition: 'The primary residence of the family.',
    reason: GEOGRAPHIC_REPORTING_REASON,
    format: 'Text',
    example: '123 Green Street',
    section: SECTIONS.FAMILY_INFO,
  })
  streetAddress?: string;

  @Column({ nullable: true })
  @ColumnMetadata({
    formattedName: 'Town',
    required: REQUIRED,
    definition: 'The primary residence of the family.',
    reason: GEOGRAPHIC_REPORTING_REASON,
    format: 'Text',
    example: 'Hartford',
    section: SECTIONS.FAMILY_INFO,
  })
  town?: string;

  @Column({ nullable: true })
  @ColumnMetadata({
    formattedName: 'State',
    required: REQUIRED,
    definition: 'The primary residence of the family.',
    reason: GEOGRAPHIC_REPORTING_REASON,
    format: 'Text; two-letter state abbreviation',
    example: 'CT',
    section: SECTIONS.FAMILY_INFO,
  })
  state?: string;

  @Column({ nullable: true })
  @ColumnMetadata({
    formattedName: 'Zipcode',
    required: REQUIRED,
    definition: 'The primary residence of the family.',
    reason: GEOGRAPHIC_REPORTING_REASON,
    format: 'Valid zipcode (5-digit number)',
    example: '01234',
    section: SECTIONS.FAMILY_INFO,
  })
  zip?: string;

  @Column({ nullable: true })
  @ColumnMetadata({
    formattedName: 'Lives with foster family',
    required: OPTIONAL,
    definition: 'Whether the child lives with a foster family.',
    reason:
      'Affects eligibility for state funding, and used for demographic reporting.',
    format: BOOLEAN_FORMAT,
    example: 'Yes',
    section: SECTIONS.FAMILY_INFO,
  })
  foster?: boolean;

  @Column({ nullable: true })
  @ColumnMetadata({
    formattedName: 'Experienced homelessness or housing insecurity',
    required: OPTIONAL,
    definition:
      "Children and youth who lack a fixed, regular, and adequate nighttime residence. See [Decision-making Tool to Determine a Family's Homeless Situation](https://eclkc.ohs.acf.hhs.gov/sites/default/files/learning-modules/homelessness-v2/module-4/story_content/external_files/HL%20Module%204%20Decision-Tool_Final%204_20_18.pdf) for definitions and guidance.",
    reason:
      'Used for reporting and identification of programs that serve families at risk of homelessness.',
    format: BOOLEAN_FORMAT,
    example: 'Yes',
    section: SECTIONS.FAMILY_INFO,
  })
  homelessness?: boolean;

  @Column({ nullable: true })
  @ColumnMetadata({
    formattedName: 'Household size',
    required: REQUIRED_NOT_FOSTER,
    definition:
      'The number of people in the household, for income eligibility purposes.',
    reason:
      'Allows for income group reporting and automated calculation of funding eligibility.',
    format: 'Number',
    example: '4',
    section: SECTIONS.FAMILY_INCOME,
  })
  numberOfPeople?: number;

  @Column({ nullable: true, type: 'decimal', precision: 14, scale: 2 })
  @ColumnMetadata({
    formattedName: 'Annual household income',
    required: REQUIRED_NOT_FOSTER,
    definition: 'The documented household income, for eligibility purposes.',
    reason:
      'Allows for demographic reporting an automated calculation of funding eligibility.',
    format: 'Number',
    example: '20000',
    section: SECTIONS.FAMILY_INCOME,
  })
  income?: number;

  @Column({ nullable: true, type: 'date', transformer: momentTransformer })
  @ColumnMetadata({
    formattedName: 'Determination date',
    required: REQUIRED_NOT_FOSTER,
    definition:
      "The date the provider received documentation of the family's income.",
    reason:
      'Used to ensure the family income has been determined within the last year.',
    format: DATE_FORMAT,
    example: `10/01/${new Date().getFullYear()}`,
    section: SECTIONS.FAMILY_INCOME,
  })
  determinationDate?: Moment;

  @Column({ nullable: true })
  @ColumnMetadata({
    formattedName: 'Provider',
    required: REQUIRED,
    definition: 'The provider from which the child is receiving services.',
    reason: 'Used to link child information to provider data.',
    format: 'Text',
    example: "Children's Center of Connecticut",
    section: SECTIONS.ENROLLMENT_FUNDING,
  })
  provider?: string;

  @Column({ nullable: true })
  @ColumnMetadata({
    formattedName: 'Site',
    required: REQUIRED,
    definition: 'The location at which the child receives ECE services.',
    reason: 'Used to link with other data like ECIS and PSIS.',
    format: 'Text',
    example: "Children's Center of Connecticut at Hartford",
    section: SECTIONS.ENROLLMENT_FUNDING,
  })
  site?: string;

  @Column({ nullable: true })
  @ColumnMetadata({
    formattedName: 'Model',
    required: REQUIRED,
    definition: 'The type of services received by the child.',
    reason: 'Used to identify children receiving in-person or virtual services',
    format: 'In-person, Virtual, Hybrid',
    example: 'Hybrid',
    section: SECTIONS.ENROLLMENT_FUNDING,
  })
  model?: string;

  @Column({ nullable: true })
  @ColumnMetadata({
    formattedName: 'Age Group',
    required: REQUIRED,
    definition:
      'The type of service being provided, as described by the age of the participating children.',
    reason: UTILIZATION_REPORTING_REASON,
    format: Object.values(AgeGroup).join(', '),
    example: 'School age',
    section: SECTIONS.ENROLLMENT_FUNDING,
  })
  ageGroup?: string;

  @Column({ nullable: true, type: 'date', transformer: momentTransformer })
  @ColumnMetadata({
    formattedName: 'Enrollment Start Date',
    required: REQUIRED,
    definition: 'The first date the child attended the program.',
    reason: REPORTING_REASON,
    format: DATE_FORMAT,
    example: '10/01/2016',
    section: SECTIONS.ENROLLMENT_FUNDING,
  })
  entry?: Moment;

  @Column({ nullable: true, type: 'date', transformer: momentTransformer })
  @ColumnMetadata({
    formattedName: 'Enrollment End Date',
    required: 'Required if exited',
    definition: 'The last date the child attended the program.',
    reason: REPORTING_REASON,
    format: DATE_FORMAT,
    example: '08/30/2017',
    section: SECTIONS.ENROLLMENT_FUNDING,
  })
  exit?: Moment;

  @Column({ nullable: true })
  @ColumnMetadata({
    formattedName: 'Enrollment Exit Reason',
    required: 'Required if exited',
    definition: 'The reason for ending an enrollment',
    reason: REPORTING_REASON,
    format: 'Text',
    example: 'Aged out',
    section: SECTIONS.ENROLLMENT_FUNDING,
  })
  exitReason?: string;

  @Column({ nullable: true })
  @ColumnMetadata({
    formattedName: 'Funding Type',
    required: REQUIRED,
    definition:
      'The type of service being provided, as described by the funding source',
    reason: UTILIZATION_REPORTING_REASON,
    format: Object.values(FundingSource).join(', '),
    example: 'SR',
    section: SECTIONS.ENROLLMENT_FUNDING,
  })
  source?: string;

  @Column({ nullable: true })
  @ColumnMetadata({
    formattedName: 'Space type',
    required: REQUIRED,
    definition: 'The period during the day when services are provided',
    reason: UTILIZATION_REPORTING_REASON,
    format: Object.values(FundingTime).join(', '),
    example: 'Wraparound',
    section: SECTIONS.ENROLLMENT_FUNDING,
  })
  time?: string;

  @Column({ nullable: true, type: 'date', transformer: momentTransformer })
  @ColumnMetadata({
    formattedName: 'First funding period',
    required: REQUIRED,
    definition:
      "The first reporting period (roughly equal to a month) during which the child occupied the funded space. The first funding period is often the same as the child's enrollment start month.",
    reason: UTILIZATION_REPORTING_REASON,
    format: REPORTING_PERIOD_FORMAT,
    example: '10/2016',
    section: SECTIONS.ENROLLMENT_FUNDING,
  })
  firstFundingPeriod?: Moment;

  @Column({ nullable: true, type: 'date', transformer: momentTransformer })
  @ColumnMetadata({
    formattedName: 'Last funding period',
    required: REQUIRED,
    definition:
      'The last reporting period (roughly equal to a month) during which the child occupied the funded space.',
    reason: 'Used to track children moving between funding groups',
    format: REPORTING_PERIOD_FORMAT,
    example: '08/2017',
    section: SECTIONS.ENROLLMENT_FUNDING,
  })
  lastFundingPeriod?: Moment;

  @Column({ nullable: true })
  @ColumnMetadata({
    formattedName: 'Receiving Care 4 Kids?',
    required: REQUIRED,
    definition: "Whether the child's family is receiving a Care 4 Kids subsidy",
    reason:
      'Used to identify overlaps between state funded spaces and Care 4 Kids subsidies',
    format: BOOLEAN_FORMAT,
    example: 'Yes',
    section: SECTIONS.ENROLLMENT_FUNDING,
  })
  receivesC4K?: boolean;
}
