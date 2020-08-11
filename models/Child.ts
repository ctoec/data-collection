import { Enrollment, Family, Gender, Organization } from './';

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
  family: Family;
  organization?: Organization;
  enrollments?: Array<Enrollment>;
}
