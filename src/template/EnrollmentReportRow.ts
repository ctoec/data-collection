import {
  Gender,
  AgeGroup,
  FundingSource,
  CareModel,
  BirthCertificateType,
  ExitReason,
} from '../../client/src/shared/models';
import {
  TEMPLATE_SECTIONS,
  TEMPLATE_REQUIREMENT_LEVELS,
} from '../../client/src/shared/constants';
import { ColumnMetadata } from './decorators/ColumnMetadata';
import {
  BOOLEAN_FORMAT,
  DATE_FORMAT,
  REPORTING_PERIOD_FORMAT,
  REQUIRED_IF_US_BORN,
  REQUIRED_AT_LEAST_ONE,
  REPORTING_REASON,
  DEMOGRAPHIC_REPORTING_REASON,
  GEOGRAPHIC_REPORTING_REASON,
  REQUIRED_NOT_FOSTER,
  UTILIZATION_REPORTING_REASON,
  REQUIRED_IF_CHANGED_ENROLLMENT,
  REQUIRED_IF_CHANGED_ENROLLMENT_FUNDING,
} from './constants';
import moment, { Moment } from 'moment';

export class EnrollmentReportRow {
  @ColumnMetadata({
    formattedName: 'First Name',
    requirementLevel: TEMPLATE_REQUIREMENT_LEVELS.REQUIRED,
    definition: "Legal name as it appears on the child's birth certificate.",
    reason:
      'Used for linking to a variety of datasets, including SASID-backed data.',
    format: 'Text',
    example: 'Firstname',
    section: TEMPLATE_SECTIONS.CHILD_IDENT,
  })
  firstName?: string = undefined;

  @ColumnMetadata({
    formattedName: 'Middle Name',
    requirementLevel: TEMPLATE_REQUIREMENT_LEVELS.OPTIONAL,
    definition: "Legal name as it appears on the child's birth certificate.",
    reason:
      'Used for linking to a variety of datasets, including SASID-backed data.',
    format: 'Text',
    example: 'Middlename',
    section: TEMPLATE_SECTIONS.CHILD_IDENT,
  })
  middleName?: string = undefined;

  @ColumnMetadata({
    formattedName: 'Last Name',
    requirementLevel: TEMPLATE_REQUIREMENT_LEVELS.REQUIRED,
    definition: "Legal name as it appears on the child's birth certificate.",
    reason:
      'Used for linking to a variety of datasets, including SASID-backed data.',
    format: 'Text',
    example: 'Lastname',
    section: TEMPLATE_SECTIONS.CHILD_IDENT,
  })
  lastName?: string = undefined;

  @ColumnMetadata({
    formattedName: 'Suffix',
    requirementLevel: TEMPLATE_REQUIREMENT_LEVELS.OPTIONAL,
    definition: "Legal name as it appears on the child's birth certificate.",
    reason:
      'Used for linking to a variety of datasets, including SASID-backed data.',
    format: 'Text',
    example: 'Sr',
    section: TEMPLATE_SECTIONS.CHILD_IDENT,
  })
  suffix?: string = undefined;

  @ColumnMetadata({
    formattedName: 'SASID / Unique Identifier',
    requirementLevel: TEMPLATE_REQUIREMENT_LEVELS.OPTIONAL,
    definition:
      'A unique number used to identify children.Either an SDE-backed SASID creted from the PSIS system, or another unique identifier from a system of record such as Childplus.',
    reason: "Allows for easy reference with your program's system of record.",
    format: 'Text (if SASID, a valid 10-digit number)',
    example: '0123456789',
    section: TEMPLATE_SECTIONS.CHILD_IDENT,
  })
  sasidUniqueId?: string = undefined;

  @ColumnMetadata({
    formattedName: 'Date of birth',
    requirementLevel: TEMPLATE_REQUIREMENT_LEVELS.REQUIRED,
    definition: "Date of birth as it appears on the child's birth certificate",
    reason:
      'Used for a variety of reporting; allows linking to a variety of data sets, including SASID-backed data.',
    format: DATE_FORMAT,
    example: '10/01/2016',
    section: TEMPLATE_SECTIONS.CHILD_IDENT,
  })
  birthdate?: Moment = moment.invalid();

  @ColumnMetadata({
    formattedName: 'Birth certificate type',
    requirementLevel: TEMPLATE_REQUIREMENT_LEVELS.OPTIONAL,
    definition: 'Type of birth certificate based on country of issue',
    reason:
      'Used for a variety of reporting; allows linking to a variety of data sets, including SASID-backed data.',
    format: Object.values(BirthCertificateType).join(', '),
    example: 'US birth certificate',
    section: TEMPLATE_SECTIONS.CHILD_IDENT,
  })
  birthCertificateType?: BirthCertificateType = undefined;

  @ColumnMetadata({
    formattedName: 'Birth certificate ID #',
    requirementLevel: TEMPLATE_REQUIREMENT_LEVELS.OPTIONAL,
    requirementString: REQUIRED_IF_US_BORN,
    definition: "The identification number on the child's birth certificate.",
    reason: 'Tiebreaker for linking to SASID-backed data.',
    format:
      'Text; Generally an 11-digit number written in XXX-XX-XXXXXX format. Format varies by state.',
    example: '123-20-000000',
    section: TEMPLATE_SECTIONS.CHILD_IDENT,
  })
  birthCertificateId?: string = undefined;

  @ColumnMetadata({
    formattedName: 'Town of birth',
    requirementLevel: TEMPLATE_REQUIREMENT_LEVELS.OPTIONAL,
    requirementString: REQUIRED_IF_US_BORN,
    definition:
      "Place of birth as it appears on the child's birth certificate.",
    reason: 'Tiebreaker for linking to SASID-backed data.',
    format: 'Text',
    example: 'Hartford',
    section: TEMPLATE_SECTIONS.CHILD_IDENT,
  })
  birthTown?: string = undefined;

  @ColumnMetadata({
    formattedName: 'State of birth',
    requirementLevel: TEMPLATE_REQUIREMENT_LEVELS.OPTIONAL,
    requirementString: REQUIRED_IF_US_BORN,
    definition:
      "Place of birth as it appears on the child's birth certificate.",
    reason: 'Tiebreaker for linking to SASID-backed data.',
    format: 'Text; two-letter state abbreviation',
    example: 'CT',
    section: TEMPLATE_SECTIONS.CHILD_IDENT,
  })
  birthState?: string = undefined;

  @ColumnMetadata({
    formattedName: 'Race: American Indian or Alaska Native',
    requirementLevel: TEMPLATE_REQUIREMENT_LEVELS.CONDITIONAL,
    requirementString: REQUIRED_AT_LEAST_ONE,
    definition: "The child's race, as identified by the family.",
    reason: DEMOGRAPHIC_REPORTING_REASON,
    format: BOOLEAN_FORMAT,
    example: 'Yes',
    section: TEMPLATE_SECTIONS.CHILD_INFO,
  })
  americanIndianOrAlaskaNative?: boolean = false;

  @ColumnMetadata({
    formattedName: 'Race: Asian',
    requirementLevel: TEMPLATE_REQUIREMENT_LEVELS.CONDITIONAL,
    requirementString: REQUIRED_AT_LEAST_ONE,
    definition: "The child's race, as identified by the family.",
    reason: DEMOGRAPHIC_REPORTING_REASON,
    format: BOOLEAN_FORMAT,
    example: 'Yes',
    section: TEMPLATE_SECTIONS.CHILD_INFO,
  })
  asian?: boolean = false;

  @ColumnMetadata({
    formattedName: 'Race: Black or African American',
    requirementLevel: TEMPLATE_REQUIREMENT_LEVELS.CONDITIONAL,
    requirementString: REQUIRED_AT_LEAST_ONE,
    definition: "The child's race, as identified by the family.",
    reason: DEMOGRAPHIC_REPORTING_REASON,
    format: BOOLEAN_FORMAT,
    example: 'Yes',
    section: TEMPLATE_SECTIONS.CHILD_INFO,
  })
  blackOrAfricanAmerican?: boolean = false;

  @ColumnMetadata({
    formattedName: 'Race: Native Hawaiian or Pacific Islander',
    requirementLevel: TEMPLATE_REQUIREMENT_LEVELS.CONDITIONAL,
    requirementString: REQUIRED_AT_LEAST_ONE,
    definition: "The child's race, as identified by the family.",
    reason: DEMOGRAPHIC_REPORTING_REASON,
    format: BOOLEAN_FORMAT,
    example: 'Yes',
    section: TEMPLATE_SECTIONS.CHILD_INFO,
  })
  nativeHawaiianOrPacificIslander?: boolean = false;

  @ColumnMetadata({
    formattedName: 'Race: White',
    requirementLevel: TEMPLATE_REQUIREMENT_LEVELS.CONDITIONAL,
    requirementString: REQUIRED_AT_LEAST_ONE,
    definition: "The child's race, as identified by the family.",
    reason: DEMOGRAPHIC_REPORTING_REASON,
    format: BOOLEAN_FORMAT,
    example: 'Yes',
    section: TEMPLATE_SECTIONS.CHILD_INFO,
  })
  white?: boolean = false;

  @ColumnMetadata({
    formattedName: 'Race Not Disclosed',
    requirementLevel: TEMPLATE_REQUIREMENT_LEVELS.CONDITIONAL,
    requirementString: REQUIRED_AT_LEAST_ONE,
    definition: "The child's race, as identified by the family.",
    reason: DEMOGRAPHIC_REPORTING_REASON,
    format: BOOLEAN_FORMAT,
    example: 'Yes',
    section: TEMPLATE_SECTIONS.CHILD_INFO,
  })
  raceNotDisclosed?: boolean = true;

  @ColumnMetadata({
    formattedName: 'Hispanic or Latinx Ethnicity',
    requirementLevel: TEMPLATE_REQUIREMENT_LEVELS.REQUIRED,
    definition: "The child's ethnicity, has identified by the family.",
    reason: DEMOGRAPHIC_REPORTING_REASON,
    format: BOOLEAN_FORMAT,
    example: 'Yes',
    section: TEMPLATE_SECTIONS.CHILD_INFO,
  })
  hispanicOrLatinxEthnicity?: boolean = false;

  @ColumnMetadata({
    formattedName: 'Gender',
    requirementLevel: TEMPLATE_REQUIREMENT_LEVELS.REQUIRED,
    definition:
      "The child's gender, as identified by the family (not as it appears on the birth certificate).",
    reason: 'Allows linking to SASID-backed data',
    format: Object.values(Gender).join(', '),
    example: 'Nonbinary',
    section: TEMPLATE_SECTIONS.CHILD_INFO,
  })
  gender?: string = undefined;

  @ColumnMetadata({
    formattedName: 'Dual language learner',
    requirementLevel: TEMPLATE_REQUIREMENT_LEVELS.OPTIONAL,
    definition:
      'Children who have a home language other than English and are learning to or more languages at the same time, or learning a second language while continuing to develop their first language.',
    reason: DEMOGRAPHIC_REPORTING_REASON,
    format: BOOLEAN_FORMAT,
    example: 'Yes',
    section: TEMPLATE_SECTIONS.CHILD_INFO,
  })
  dualLanguageLearner?: boolean = false;

  @ColumnMetadata({
    formattedName: 'Receiving Disability Services',
    requirementLevel: TEMPLATE_REQUIREMENT_LEVELS.OPTIONAL,
    definition:
      'Children receiving services for Autism, emotional disturbance, intellectual disability, learning disability, speech-language impairment, and other disabilities.',
    reason: DEMOGRAPHIC_REPORTING_REASON,
    format: BOOLEAN_FORMAT,
    example: 'Yes',
    section: TEMPLATE_SECTIONS.CHILD_INFO,
  })
  receivesDisabilityServices?: boolean = false;

  @ColumnMetadata({
    formattedName: 'Street address',
    requirementLevel: TEMPLATE_REQUIREMENT_LEVELS.REQUIRED,
    definition: 'The primary residence of the family.',
    reason: GEOGRAPHIC_REPORTING_REASON,
    format: 'Text',
    example: '123 Green Street',
    section: TEMPLATE_SECTIONS.FAMILY_ADDRESS,
  })
  streetAddress?: string = undefined;

  @ColumnMetadata({
    formattedName: 'Town',
    requirementLevel: TEMPLATE_REQUIREMENT_LEVELS.REQUIRED,
    definition: 'The primary residence of the family.',
    reason: GEOGRAPHIC_REPORTING_REASON,
    format: 'Text',
    example: 'Hartford',
    section: TEMPLATE_SECTIONS.FAMILY_ADDRESS,
  })
  town?: string = undefined;

  @ColumnMetadata({
    formattedName: 'State',
    requirementLevel: TEMPLATE_REQUIREMENT_LEVELS.REQUIRED,
    definition: 'The primary residence of the family.',
    reason: GEOGRAPHIC_REPORTING_REASON,
    format: 'Text; two-letter state abbreviation',
    example: 'CT',
    section: TEMPLATE_SECTIONS.FAMILY_ADDRESS,
  })
  state?: string = undefined;

  @ColumnMetadata({
    formattedName: 'Zipcode',
    requirementLevel: TEMPLATE_REQUIREMENT_LEVELS.REQUIRED,
    definition: 'The primary residence of the family.',
    reason: GEOGRAPHIC_REPORTING_REASON,
    format: 'Valid zipcode (5-digit number)',
    example: '01234',
    section: TEMPLATE_SECTIONS.FAMILY_ADDRESS,
  })
  zipCode?: string = undefined;

  @ColumnMetadata({
    formattedName: 'Lives with foster family',
    requirementLevel: TEMPLATE_REQUIREMENT_LEVELS.OPTIONAL,
    definition: 'Whether the child lives with a foster family.',
    reason:
      'Affects eligibility for state funding, and used for demographic reporting.',
    format: BOOLEAN_FORMAT,
    example: 'Yes',
    section: TEMPLATE_SECTIONS.CHILD_INFO,
  })
  foster?: boolean = false;

  @ColumnMetadata({
    formattedName: 'Experiencing homelessness or housing insecurity',
    requirementLevel: TEMPLATE_REQUIREMENT_LEVELS.OPTIONAL,
    definition:
      "Children and youth who lack a fixed, regular, and adequate nighttime residence. See [Decision-making Tool to Determine a Family's Homeless Situation](https://eclkc.ohs.acf.hhs.gov/sites/default/files/learning-modules/homelessness-v2/module-4/story_content/external_files/HL%20Module%204%20Decision-Tool_Final%204_20_18.pdf) for definitions and guidance.",
    reason:
      'Used for reporting and identification of programs that serve families at risk of homelessness.',
    format: BOOLEAN_FORMAT,
    example: 'Yes',
    section: TEMPLATE_SECTIONS.FAMILY_ADDRESS,
  })
  homelessness?: boolean = false;

  @ColumnMetadata({
    formattedName: 'Household size',
    requirementLevel: TEMPLATE_REQUIREMENT_LEVELS.CONDITIONAL,
    requirementString: REQUIRED_NOT_FOSTER,
    definition:
      'The number of people in the household, for income eligibility purposes.',
    reason:
      'Allows for income group reporting and automated calculation of funding eligibility.',
    format: 'Number',
    example: '4',
    section: TEMPLATE_SECTIONS.FAMILY_INCOME,
  })
  numberOfPeople?: number = undefined;

  @ColumnMetadata({
    formattedName: 'Annual household income',
    requirementLevel: TEMPLATE_REQUIREMENT_LEVELS.CONDITIONAL,
    requirementString: REQUIRED_NOT_FOSTER,
    definition: 'The documented household income, for eligibility purposes.',
    reason:
      'Allows for demographic reporting an automated calculation of funding eligibility.',
    format: 'Number',
    example: '20000',
    section: TEMPLATE_SECTIONS.FAMILY_INCOME,
  })
  income?: number = undefined;

  @ColumnMetadata({
    formattedName: 'Determination date',
    requirementLevel: TEMPLATE_REQUIREMENT_LEVELS.CONDITIONAL,
    requirementString: REQUIRED_NOT_FOSTER,
    definition:
      "The date the provider received documentation of the family's income.",
    reason:
      'Used to ensure the family income has been determined within the last year.',
    format: DATE_FORMAT,
    example: `10/01/${new Date().getFullYear()}`,
    section: TEMPLATE_SECTIONS.FAMILY_INCOME,
  })
  determinationDate?: Moment = moment.invalid();

  @ColumnMetadata({
    formattedName: 'Provider',
    requirementLevel: TEMPLATE_REQUIREMENT_LEVELS.REQUIRED,
    definition: 'The provider from which the child is receiving services.',
    reason: 'Used to link child information to provider data.',
    format: 'Text',
    example: "Children's Center of Connecticut",
    section: TEMPLATE_SECTIONS.ENROLLMENT_FUNDING,
  })
  providerName?: string = undefined;

  @ColumnMetadata({
    formattedName: 'Site',
    requirementLevel: TEMPLATE_REQUIREMENT_LEVELS.REQUIRED,
    definition: 'The location at which the child receives ECE services.',
    reason: 'Used to link with other data like ECIS and PSIS.',
    format: 'Text',
    example: "Children's Center of Connecticut at Hartford",
    section: TEMPLATE_SECTIONS.ENROLLMENT_FUNDING,
  })
  site?: string = undefined;

  @ColumnMetadata({
    formattedName: 'Care Model',
    requirementLevel: TEMPLATE_REQUIREMENT_LEVELS.OPTIONAL,
    definition:
      'The type of services received by the child.  \n__In-Person__: In-school learning for all students on a full-time basis.  \n__Hybrid__: A combination of both in-person and remote learning support resulting in a limited student population on school premises at any given time.  \n__Distance__: Learning opportunities in which students and educators are not physically present in a classroom environment.',
    reason: 'Used to identify children receiving in-person or virtual services',
    format: makeMarkdownOptionsList(Object.values(CareModel)),
    example: 'Hybrid',
    section: TEMPLATE_SECTIONS.ENROLLMENT_FUNDING,
  })
  model?: string = undefined;

  @ColumnMetadata({
    formattedName: 'Age Group',
    requirementLevel: TEMPLATE_REQUIREMENT_LEVELS.REQUIRED,
    definition:
      'The type of service being provided, as described by the age of the participating children.',
    reason: UTILIZATION_REPORTING_REASON,
    format: makeMarkdownOptionsList(Object.values(AgeGroup)),
    example: 'School aged',
    section: TEMPLATE_SECTIONS.ENROLLMENT_FUNDING,
  })
  ageGroup?: string = undefined;

  @ColumnMetadata({
    formattedName: 'Enrollment Start Date',
    requirementLevel: TEMPLATE_REQUIREMENT_LEVELS.REQUIRED,
    definition: 'The first date the child attended the program.',
    reason: REPORTING_REASON,
    format: DATE_FORMAT,
    example: '10/01/2016',
    section: TEMPLATE_SECTIONS.ENROLLMENT_FUNDING,
  })
  entry?: Moment = moment.invalid();

  @ColumnMetadata({
    formattedName: 'Enrollment End Date',
    requirementLevel: TEMPLATE_REQUIREMENT_LEVELS.CONDITIONAL,
    requirementString: REQUIRED_IF_CHANGED_ENROLLMENT,
    definition:
      'The last date the child attended services at a site __or__ the last date the child received services before changing age groups.',
    reason: REPORTING_REASON,
    format: DATE_FORMAT,
    example: '08/30/2017',
    section: TEMPLATE_SECTIONS.ENROLLMENT_FUNDING,
  })
  exit?: Moment = moment.invalid();

  @ColumnMetadata({
    formattedName: 'Enrollment Exit Reason',
    requirementLevel: TEMPLATE_REQUIREMENT_LEVELS.CONDITIONAL,
    requirementString: REQUIRED_IF_CHANGED_ENROLLMENT,
    definition: 'The reason for ending an enrollment.',
    reason: REPORTING_REASON,
    format: makeMarkdownOptionsList(Object.values(ExitReason)),
    example: 'Aged out',
    section: TEMPLATE_SECTIONS.ENROLLMENT_FUNDING,
  })
  exitReason?: string = undefined;

  @ColumnMetadata({
    formattedName: 'Funding Type',
    requirementLevel: TEMPLATE_REQUIREMENT_LEVELS.REQUIRED,
    definition:
      'The type of service being provided, as described by the funding source',
    reason: UTILIZATION_REPORTING_REASON,
    format: makeMarkdownOptionsList(Object.values(FundingSource)),
    example: 'CSR',
    section: TEMPLATE_SECTIONS.ENROLLMENT_FUNDING,
  })
  fundingSpace?: string = undefined;

  @ColumnMetadata({
    formattedName: 'Space type',
    requirementLevel: TEMPLATE_REQUIREMENT_LEVELS.REQUIRED,
    definition: 'The contract space type that funds an enrollment.',
    reason: UTILIZATION_REPORTING_REASON,
    format:
      'See [contract spaces](/funding-space-types) for the full list of accepted space types.',
    example: '',
    section: TEMPLATE_SECTIONS.ENROLLMENT_FUNDING,
  })
  time?: string = undefined;

  @ColumnMetadata({
    formattedName: 'First funding period',
    requirementLevel: TEMPLATE_REQUIREMENT_LEVELS.REQUIRED,
    definition:
      "The first reporting period (roughly equal to a month) during which the child occupied the funded space. The first funding period is often the same as the child's enrollment start month.",
    reason: UTILIZATION_REPORTING_REASON,
    format: REPORTING_PERIOD_FORMAT,
    example: '10/2016',
    section: TEMPLATE_SECTIONS.ENROLLMENT_FUNDING,
  })
  firstReportingPeriod?: Moment = moment.invalid();

  @ColumnMetadata({
    formattedName: 'Last funding period',
    requirementLevel: TEMPLATE_REQUIREMENT_LEVELS.CONDITIONAL,
    requirementString: REQUIRED_IF_CHANGED_ENROLLMENT_FUNDING,
    definition:
      'The last reporting period (roughly equal to a month) during which the child occupied the funded space.',
    reason: 'Used to track children moving between funding groups',
    format: REPORTING_PERIOD_FORMAT,
    example: '08/2017',
    section: TEMPLATE_SECTIONS.ENROLLMENT_FUNDING,
  })
  lastReportingPeriod?: Moment = moment.invalid();
}

function makeMarkdownOptionsList(opts: string[]) {
  return `Options:  \n${opts.map((o) => `- ${o}`).join('  \n')}`;
}
