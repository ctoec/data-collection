import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  ManyToOne,
} from 'typeorm';
import { EnrollmentReport } from './EnrollmentReport';
import {
  DataDefinition,
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
} from '../decorators/dataDefinition';
import { utils } from 'xlsx/types';

@Entity()
export class FlattenedEnrollment {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne((type) => EnrollmentReport, { nullable: false })
  report: EnrollmentReport;

  @Column({ nullable: true })
  @DataDefinition({
    formattedName: 'Name',
    required: REQUIRED,
    definition: "Legal name as it appears on the child's birth certificate.",
    reason:
      'Used for linking to a variety of datasets, including SASID-backed data.',
    format: 'Text; names separated by spaces',
    example: 'Firstname Lastname',
  })
  name?: string;

  @Column({ nullable: true })
  @DataDefinition({
    formattedName: 'SASID',
    required: OPTIONAL,
    definition: 'The State Assigned Student ID',
    reason: 'Used for linking to SASID-backed data.',
    format: 'Valid SASID (10-digit number)',
    example: '0123456789',
  })
  sasid?: number;

  @Column({ nullable: true })
  @DataDefinition({
    formattedName: 'Date of birth',
    required: REQUIRED,
    definition: "Date of birth as it appears on the child's birth certificate",
    reason:
      'Used for a variety of reporting; allows linking to a variety of data sets, including SASID-backed data.',
    format: DATE_FORMAT,
    example: '10/01/2016',
  })
  dateOfBirth?: Date;

  @Column({ nullable: true })
  @DataDefinition({
    formattedName: 'Birth certificate ID #',
    required: REQUIRED_IF_US_BORN,
    definition: "The identification number of the child's birth certificate.",
    reason: 'Tiebreaker for linking to SASID-backed data.',
    format:
      'Text; comprised of numbers, letters, and dashes (-); exact format varies by state/country',
    example: '2015-00-1234567',
  })
  birthCertificateId?: string;

  @Column({ nullable: true })
  @DataDefinition({
    formattedName: 'Town of birth',
    required: REQUIRED_IF_US_BORN,
    definition:
      "Place of birth as it appears on the child's birth certificate.",
    reason: 'Tiebreaker for linking to SASID-backed data.',
    format: 'Text',
    example: 'Hartford',
  })
  townOfBirth?: string;

  @Column({ nullable: true })
  @DataDefinition({
    formattedName: 'State of birth',
    required: REQUIRED_IF_US_BORN,
    definition:
      "Place of birth as it appears on the child's birth certificate.",
    reason: 'Tiebreaker for linking to SASID-backed data.',
    format: 'Text; two-letter state abbreviation',
    example: 'CT',
  })
  stateOfBirth?: string;

  @Column({ nullable: true })
  @DataDefinition({
    formattedName: 'Race: American Indian or Alaska Native',
    required: REQUIRED_AT_LEAST_ONE,
    definition: "The child's race, as identified by the family.",
    reason: DEMOGRAPHIC_REPORTING_REASON,
    format: BOOLEAN_FORMAT,
    example: 'Yes',
  })
  americanIndianOrAlaskaNative?: boolean;

  @Column({ nullable: true })
  @DataDefinition({
    formattedName: 'Race: Asian',
    required: REQUIRED_AT_LEAST_ONE,
    definition: "The child's race, as identified by the family.",
    reason: DEMOGRAPHIC_REPORTING_REASON,
    format: BOOLEAN_FORMAT,
    example: 'Yes',
  })
  asian?: boolean;

  @Column({ nullable: true })
  @DataDefinition({
    formattedName: 'Race: Black or African American',
    required: REQUIRED_AT_LEAST_ONE,
    definition: "The child's race, as identified by the family.",
    reason: DEMOGRAPHIC_REPORTING_REASON,
    format: BOOLEAN_FORMAT,
    example: 'Yes',
  })
  blackOrAfricanAmerican?: boolean;

  @Column({ nullable: true })
  @DataDefinition({
    formattedName: 'Race: Native Hawaiian or Pacific Islander',
    required: REQUIRED_AT_LEAST_ONE,
    definition: "The child's race, as identified by the family.",
    reason: DEMOGRAPHIC_REPORTING_REASON,
    format: BOOLEAN_FORMAT,
    example: 'Yes',
  })
  nativeHawaiianOrPacificIslander?: boolean;

  @Column({ nullable: true })
  @DataDefinition({
    formattedName: 'Race: White',
    required: REQUIRED_AT_LEAST_ONE,
    definition: "The child's race, as identified by the family.",
    reason: DEMOGRAPHIC_REPORTING_REASON,
    format: BOOLEAN_FORMAT,
    example: 'Yes',
  })
  white?: boolean;

  @Column({ nullable: true })
  @DataDefinition({
    formattedName: 'Hispanic or Latinx ethnicity',
    required: REQUIRED,
    definition: "The child's ethnicity, has identified by the family.",
    reason: DEMOGRAPHIC_REPORTING_REASON,
    format: BOOLEAN_FORMAT,
    example: 'Yes',
  })
  hispanicOrLatinxEthnicity?: boolean;

  @Column({ nullable: true })
  @DataDefinition({
    formattedName: 'Gender',
    required: REQUIRED,
    definition:
      "The child's gender, as identified by the family (not as it appears on the birth certificate).",
    reason: 'Allows linking to SASID-backed data',
    format: 'Male, Female, Nonbinary, Unspecified',
    example: 'Nonbinary',
  })
  gender?: string;

  @Column({ nullable: true })
  @DataDefinition({
    formattedName: 'Dual language learner?',
    required: REQUIRED,
    definition:
      'Children who have a home language other than English and are learning to or more launguages at the same time, or learning a second language while continuing to develop their first language are dual language learners.',
    reason: DEMOGRAPHIC_REPORTING_REASON,
    format: BOOLEAN_FORMAT,
    example: 'Yes',
  })
  dualLanguageLearner?: boolean;

  @Column({ nullable: true })
  @DataDefinition({
    formattedName: 'Receiving special education services?',
    required: REQUIRED,
    definition:
      'Children receiving services with an IEP or an IFSP are receiving special education services.',
    reason: DEMOGRAPHIC_REPORTING_REASON,
    format: BOOLEAN_FORMAT,
    example: 'Yes',
  })
  receivingSpecialEducationServices?: boolean;

  @Column({ nullable: true })
  @DataDefinition({
    formattedName: 'Special education services type',
    required: 'Required if child is receiving special education services.',
    definition:
      'Whether a child receives special education services from a Local Education Agency (LEA) or another provider.',
    reason: DEMOGRAPHIC_REPORTING_REASON,
    format: 'LEA, Non-LEA',
    example: 'Non-LEA',
  })
  specialEducationServicesType?: string;

  @Column({ nullable: true })
  @DataDefinition({
    formattedName: 'Street address',
    required: REQUIRED,
    definition: 'The primary residence of the family.',
    reason: GEOGRAPHIC_REPORTING_REASON,
    format: 'Text',
    example: '123 Green Street',
  })
  streetAddress?: string;

  @Column({ nullable: true })
  @DataDefinition({
    formattedName: 'City / town',
    required: REQUIRED,
    definition: 'The primary residence of the family.',
    reason: GEOGRAPHIC_REPORTING_REASON,
    format: 'Text',
    example: 'Hartford',
  })
  town?: string;

  @Column({ nullable: true })
  @DataDefinition({
    formattedName: 'State',
    required: REQUIRED,
    definition: 'The primary residence of the family.',
    reason: GEOGRAPHIC_REPORTING_REASON,
    format: 'Text; two-letter state abbreviation',
    example: 'CT',
  })
  state?: string;

  @Column({ nullable: true })
  @DataDefinition({
    formattedName: 'Zipcode',
    required: REQUIRED,
    definition: 'The primary residence of the family.',
    reason: GEOGRAPHIC_REPORTING_REASON,
    format: 'Valid zipcode (5-digit number)',
    example: '01234',
  })
  zipcode?: string;

  @Column({ nullable: true })
  @DataDefinition({
    formattedName: 'Lives with foster family',
    required: OPTIONAL,
    definition: 'Whether the child lives with a foster family.',
    reason:
      'Affects eligibility for state funding, and used for demographic reporting.',
    format: BOOLEAN_FORMAT,
    example: 'Yes',
  })
  livesWithFosterFamily?: boolean;

  @Column({ nullable: true })
  @DataDefinition({
    formattedName: 'Experienced homelessness or houseing insecurity',
    required: OPTIONAL,
    definition:
      "Children and youth who lack a fixed, regular, and adequate nighttime residence. See [Decision-making Tool to Determine a Family's Homeless Situation](https://eclkc.ohs.acf.hhs.gov/sites/default/files/learning-modules/homelessness-v2/module-4/story_content/external_files/HL%20Module%204%20Decision-Tool_Final%204_20_18.pdf) for definitions and guidance.",
    reason:
      'Used for reporting and identification of programs that serve families at risk of homelessness.',
    format: BOOLEAN_FORMAT,
    example: 'Yes',
  })
  experiencedHomelessnessOrHousingInsecurity?: boolean;

  @Column({ nullable: true })
  @DataDefinition({
    formattedName: 'Household size',
    required: REQUIRED_NOT_FOSTER,
    definition:
      'The number of people in the household, for income eligibility purposes.',
    reason:
      'Allows for income group reporting and automated calculation of funding eligibility.',
    format: 'Number',
    example: '4',
  })
  householdSize?: number;

  @Column({ nullable: true })
  @DataDefinition({
    formattedName: 'Annual household income',
    required: REQUIRED_NOT_FOSTER,
    definition: 'The documented household income, for eligibility purposes.',
    reason:
      'Allows for demographic reporting an automated calculation of funding eligibility.',
    format: 'Number',
    example: '20000',
  })
  annualHouseholdIncome?: number;

  @Column({ nullable: true })
  @DataDefinition({
    formattedName: 'Determination date',
    required: REQUIRED_NOT_FOSTER,
    definition:
      "The date the provider received documentation of the family's income.",
    reason:
      'Used to ensure the family income has been determined within the last year.',
    format: DATE_FORMAT,
    example: `10/01/${new Date().getFullYear()}`,
  })
  incomeDeterminationDate?: Date;

  @Column({ nullable: true })
  @DataDefinition({
    formattedName: 'Provider',
    required: REQUIRED,
    definition: 'The provider from which the child is receiving services.',
    reason: 'Used to link child information to provider data.',
    format: 'Text',
    example: "Children's Center of Connecticut",
  })
  provider?: string;

  @Column({ nullable: true })
  @DataDefinition({
    formattedName: 'Site',
    required: REQUIRED,
    definition: 'The location at which the child receives ECE services.',
    reason: 'Used to link with other data like ECIS and PSIS.',
    format: 'Text',
    example: "Children's Center of Connecticut at Hartford",
  })
  site?: string;

  @Column({ nullable: true })
  @DataDefinition({
    formattedName: 'Services model',
    required: REQUIRED,
    definition: 'The type of services received by the child.',
    reason: 'Used to identify children receiving in-person or virtual services',
    format: 'In-person, Virtual, Hybrid',
    example: 'Hybrid',
  })
  model?: string;

  @Column({ nullable: true })
  @DataDefinition({
    formattedName: 'Age group',
    required: REQUIRED,
    definition:
      'The type of service being provided, as described by the age of the participating children.',
    reason: UTILIZATION_REPORTING_REASON,
    format: 'Infant/toddler, Preschool, School age',
    example: 'School age',
  })
  ageGroup?: string;

  @Column({ nullable: true })
  @DataDefinition({
    formattedName: 'Enrollment start date',
    required: REQUIRED,
    definition: 'The first date the child attended the program.',
    reason: REPORTING_REASON,
    format: DATE_FORMAT,
    example: '10/01/2016',
  })
  enrollmentStartDate?: Date;

  @Column({ nullable: true })
  @DataDefinition({
    formattedName: 'Enrollment end date',
    required: 'Required if exited',
    definition: 'The last date the child attended the program.',
    reason: REPORTING_REASON,
    format: DATE_FORMAT,
    example: '08/30/2017',
  })
  enrollmentEndDate?: Date;

  @Column({ nullable: true })
  @DataDefinition({
    formattedName: 'Enrollment exit reason',
    required: 'Required if exited',
    definition: 'The reason for ending an enrollment',
    reason: REPORTING_REASON,
    format: 'Text',
    example: 'Aged out',
  })
  enrollmentExitReason?: string;

  @Column({ nullable: true })
  @DataDefinition({
    formattedName: 'Funding type',
    required: REQUIRED,
    definition:
      'The type of service being provided, as described by the funding source',
    reason: UTILIZATION_REPORTING_REASON,
    format: 'CDC, SR',
    example: 'SR',
  })
  fundingType?: string;

  @Column({ nullable: true })
  @DataDefinition({
    formattedName: 'Space type',
    required: REQUIRED,
    definition: 'The period during the day when services are provided',
    reason: UTILIZATION_REPORTING_REASON,
    format:
      'Part-time, Full-time, Part-time / full-time, School day, Wraparound',
    example: 'Wraparound',
  })
  spaceType?: string;

  @Column({ nullable: true })
  @DataDefinition({
    formattedName: 'First funding reporting period',
    required: REQUIRED,
    definition:
      "The first reporting period (roughly equal to a month) during which the child occupied the funded space. The first funding period is often the same as the child's enrollment start month.",
    reason: UTILIZATION_REPORTING_REASON,
    format: REPORTING_PERIOD_FORMAT,
    example: '10/2016',
  })
  firstFundingPeriod?: string;

  @Column({ nullable: true })
  @DataDefinition({
    formattedName: 'Last funding reporting period',
    required: REQUIRED,
    definition:
      'The last reporting period (roughly equal to a month) during which the child occupied the funded space.',
    reason: 'Used to track children moving between funding groups',
    format: REPORTING_PERIOD_FORMAT,
    example: '08/2017',
  })
  lastFundingPeriod?: string;

  @Column({ nullable: true })
  @DataDefinition({
    formattedName: 'Receiving Care 4 Kids',
    required: REQUIRED,
    definition: "Whether the child's family is receiving a Care 4 Kids subsidy",
    reason:
      'Used to identify overlaps between state funded spaces and Care 4 Kids subsidies',
    format: BOOLEAN_FORMAT,
    example: 'Yes',
  })
  receivingCareForKids?: boolean;
}
