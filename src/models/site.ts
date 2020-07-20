import { Enrollment } from './enrollment';
import { Organization } from './organization';
import { Region } from './region';

export interface Site { 
    id: number;
    name: string;
    titleI: boolean;
    region: Region;
    organizationId: number;
    organization?: Organization;
    facilityCode?: number;
    licenseNumber?: number;
    naeycId?: number;
    registryId?: number;
    enrollments?: Array<Enrollment>;
}