import { Child } from './child';
import { FamilyDetermination } from './familyDetermination';
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