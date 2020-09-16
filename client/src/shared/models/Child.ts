import {
  Enrollment,
  Family,
  Gender,
  Organization,
  SpecialEducationServicesType,
} from '.';
import { Moment } from 'moment';

export interface Child {
  id: string;
  sasid?: string;
  fullName: string;
  firstName: string;
  middleName?: string;
  lastName: string;
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
  family: Family;
  organization?: Organization;
  enrollments?: Array<Enrollment>;
}
