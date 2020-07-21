import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, TableInheritance, ChildEntity } from 'typeorm';

import { Enrollment } from './Enrollment';
import { Organization } from './Organization';
import { ReportingPeriod } from './ReportingPeriod';
import { FundingSource } from './enums';

@Entity()
@TableInheritance({ column: {type: 'enum', enum: FundingSource, name: "type" }})
export abstract class Report {
		@PrimaryGeneratedColumn()
		id: number;

		@ManyToOne(type => ReportingPeriod)
		reportingPeriod: ReportingPeriod;
		
		@Column({ type: 'date', nullable: true })
		submittedAt?: Date;
		
		@Column({ type: 'enum', enum: FundingSource })
		type: FundingSource;

		// not mapped
		// convenience var: all enrollments with funding of type `type`
		// that is active during `reportingPeriod`
   	enrollments?: Array<Enrollment>;
}

@ChildEntity(FundingSource.CDC)
export class CdcReport extends Report { 
		@Column()
		accredited: boolean;
		
		@Column()
		c4KRevenue: number;
		
		@Column({ default: false })
		retroactiveC4KRevenue: boolean = false;
		
		@Column()
		familyFeesRevenue: number;

		@Column({ nullable: true })
		comment?: string;
		
		@ManyToOne(type => Organization)
		organization?: Organization;
}
