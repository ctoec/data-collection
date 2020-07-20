import { Organization } from './organization';
import { User } from './user';

export interface OrganizationPermission { 
    organizationId: number;
    organization?: Organization;
    id: number;
    userId: number;
    user?: User;
}