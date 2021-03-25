import { Enrollment, Family, Organization } from '.';
import { Gender } from '../';

import { Moment } from 'moment';
import { ObjectWithValidationErrors } from '../ObjectWithValidationErrors';
import { BirthCertificateType } from '../BirthCertificateType';
import { UndefinableBoolean } from '../UndefinableBoolean';

export const RACE_FIELDS = [
  'americanIndianOrAlaskaNative',
  'asian',
  'blackOrAfricanAmerican',
  'nativeHawaiianOrPacificIslander',
  'white',
];

export interface Child extends ObjectWithValidationErrors {
  id: string;
  sasid?: string;
  uniqueId?: string;
  firstName?: string;
  middleName?: string;
  lastName?: string;
  suffix?: string;
  birthdate?: Moment;
  birthCertificateType?: BirthCertificateType;
  birthTown?: string;
  birthState?: string;
  birthCertificateId?: string;
  americanIndianOrAlaskaNative?: boolean;
  asian?: boolean;
  blackOrAfricanAmerican?: boolean;
  nativeHawaiianOrPacificIslander?: boolean;
  white?: boolean;
  raceNotDisclosed?: boolean;
  hispanicOrLatinxEthnicity?: UndefinableBoolean;
  gender?: Gender;
  dualLanguageLearner?: UndefinableBoolean;
  foster?: UndefinableBoolean;
  receivesDisabilityServices?: UndefinableBoolean;
  family?: Family;
  organization: Organization;
  enrollments?: Array<Enrollment>;
  updateBirthCertificate?: () => void;
}
