import { Child } from './child';

export interface C4KCertificate { 
    id: number;
    childId: string;
    child?: Child;
    startDate?: Date;
    endDate?: Date;
}
