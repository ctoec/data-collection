import { Age } from './age';
import { Child } from './child';
import { Funding } from './funding';
import { Site } from './site';
import { User } from './user';

export interface Enrollment { 
    id: number;
    childId: string;
    child?: Child;
    siteId: number;
    site?: Site;
    ageGroup?: Age;
    entry?: Date;
    exit?: Date;
    exitReason?: string;
    fundings?: Array<Funding>;
    pastEnrollments?: Array<Enrollment>;
    readonly authorId?: number;
    author?: User;
    readonly updatedAt?: Date;
}
