import { Site } from './site';
import { User } from './user';

export interface SitePermission { 
    siteId: number;
    site?: Site;
    id: number;
    userId: number;
    user?: User;
}