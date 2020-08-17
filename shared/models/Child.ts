import {
  Enrollment,
  Family,
  Gender,
  Organization,
  SpecialEducationServicesType,
} from '.';

export interface Child {
  id: string;
  sasid?: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  suffix?: string;
  birthdate?: Date;
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
  recievesC4K?: boolean;
  recievesSpecialEducationServices?: boolean;
  specialEducationServicesType?: SpecialEducationServicesType;
  family: Family;
  organization?: Organization;
  enrollments?: Array<Enrollment>;
}
