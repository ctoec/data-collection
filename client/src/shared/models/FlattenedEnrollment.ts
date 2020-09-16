import { EnrollmentReport } from '.';
import { Moment } from 'moment';

export interface FlattenedEnrollment {
  id: number;
  report: EnrollmentReport;
  name?: string;
  sasid?: string;
  birthdate?: Moment;
  birthCertificateId?: string;
  birthTown?: string;
  birthState?: string;
  americanIndianOrAlaskaNative?: boolean;
  asian?: boolean;
  blackOrAfricanAmerican?: boolean;
  nativeHawaiianOrPacificIslander?: boolean;
  white?: boolean;
  hispanicOrLatinxEthnicity?: boolean;
  gender?: string;
  dualLanguageLearner?: boolean;
  receivesSpecialEducationServices?: boolean;
  specialEducationServicesType?: string;
  streetAddress?: string;
  town?: string;
  state?: string;
  zip?: string;
  foster?: boolean;
  homelessness?: boolean;
  numberOfPeople?: number;
  income?: number;
  determinationDate?: Moment;
  providerName?: string;
  siteName?: string;
  model?: string;
  ageGroup?: string;
  entry?: Moment;
  exit?: Moment;
  exitReason?: string;
  source?: string;
  time?: string;
  firstFundingPeriod?: Moment;
  lastFundingPeriod?: Moment;
  receivesC4K?: boolean;
}
