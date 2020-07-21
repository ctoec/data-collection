import { Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

import { Enrollment } from './Enrollment';
import { ReportingPeriod } from './ReportingPeriod';
import { User } from './User';
import { CdcReport } from './Report';
import { FundingSpace } from './FundingSpace';


@Entity()
export class Funding { 

		@PrimaryGeneratedColumn()
		id: number;
		
		@ManyToOne(type => Enrollment)
		enrollment: Enrollment;
		
		@ManyToOne(type => FundingSpace)
		fundingSpace: FundingSpace;
		
		@ManyToOne(type => ReportingPeriod, { nullable: true })
		firstReportingPeriod?: ReportingPeriod;

		@ManyToOne(type => ReportingPeriod, { nullable: true })
    lastReportingPeriod?: ReportingPeriod;
}
