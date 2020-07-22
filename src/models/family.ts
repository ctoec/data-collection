import { Child } from './child';
import { Organization } from './organization';
import { User } from './user';

export interface Family {
  id: number;
  children?: Array<Child>;
  addressLine1?: string;
  addressLine2?: string;
  town?: string;
  state?: string;
  zip?: string;
  homelessness?: boolean;
  determinations?: Array<FamilyDetermination>;
  organizationId: number;
  organization?: Organization;
  readonly authorId?: number;
  author?: User;
  readonly updatedAt?: Date;
}

export interface FamilyDetermination {
  id: number;
  numberOfPeople?: number;
  income?: number;
  determinationDate?: Date;
  familyId: number;
  family?: Family;
  readonly authorId?: number;
  author?: User;
  readonly updatedAt?: Date;
}
