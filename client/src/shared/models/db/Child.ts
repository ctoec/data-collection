import { Enrollment, Family, Provider } from '.';
import { Gender, SpecialEducationServicesType } from '../';

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
  birthTown?: string;
  birthState?: string;
  birthCertificateId?: string;
  americanIndianOrAlaskaNative?: boolean;
  asian?: boolean;
  blackOrAfricanAmerican?: boolean;
  nativeHawaiianOrPacificIslander?: boolean;
  white?: boolean;
  hispanicOrLatinxEthnicity?: boolean;
  gender?: Gender;
  foster?: boolean;
  receivesC4K?: boolean;
  receivesSpecialEducationServices?: boolean;
  specialEducationServicesType?: SpecialEducationServicesType;
  family?: Family;
  provider?: Provider;
  enrollments?: Array<Enrollment>;
}
