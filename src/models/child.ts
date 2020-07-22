import { C4KCertificate } from './c4KCertificate';
import { Enrollment } from './enrollment';
import { Family } from './family';
import { Gender } from './gender';
import { Organization } from './organization';
import { User } from './user';

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
  familyId?: number;
  family?: Family;
  enrollments?: Array<Enrollment>;
  organizationId: number;
  organization?: Organization;
  c4KFamilyCaseNumber?: number;
  c4KCertificates?: Array<C4KCertificate>;
  readonly authorId?: number;
  author?: User;
  readonly updatedAt?: Date;
}
