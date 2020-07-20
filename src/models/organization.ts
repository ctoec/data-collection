import { FundingSpace } from './fundingSpace';
import { Site } from './site';

export interface Organization { 
    id: number;
    name: string;
    sites?: Array<Site>;
    fundingSpaces?: Array<FundingSpace>;
}