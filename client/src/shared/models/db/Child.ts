import { Enrollment, Family, Organization } from '.';
import { Gender } from '../';

import { Moment } from 'moment';
import { ObjectWithValidationErrors } from '../ObjectWithValidationErrors';

export interface Child extends ObjectWithValidationErrors {
  id: string;
  sasid?: string;
  firstName?: string;
  middleName?: string;
  lastName?: string;
  suffix?: string;
  birthdate?: Moment;
  birthCertificateType: string;
  birthTown?: string;
  birthState?: string;
  birthCertificateId?: string;
  americanIndianOrAlaskaNative?: boolean;
  asian?: boolean;
  blackOrAfricanAmerican?: boolean;
  nativeHawaiianOrPacificIslander?: boolean;
  white?: boolean;
  raceNotDisclosed?: boolean;
  hispanicOrLatinxEthnicity?: boolean;
  gender?: Gender;
  dualLanguageLearner?: boolean;
  foster?: boolean;
  receivesDisabilityServices?: boolean;
  family?: Family;
  organization: Organization;
  enrollments?: Array<Enrollment>;
}
