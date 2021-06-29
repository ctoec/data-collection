import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  DeleteDateColumn,
} from 'typeorm';

import { Funding as FundingInterface } from '../../client/src/shared/models';

import { Enrollment } from './Enrollment';
import { FundingSpace } from './FundingSpace';
import { UpdateMetaData } from './embeddedColumns/UpdateMetaData';
import { ValidateNested, IsNotEmpty, ValidateIf } from 'class-validator';
import { momentTransformer } from './transformers';
import { Moment } from 'moment';
import { EndDateAfterStartDate } from './decorators/Funding/endDateAfterStartDate';
import { FundingBeginsAfterEnrollmentEntry } from './decorators/Funding/fundingBeginsAfterEnrollmentEntry';

@Entity()
export class Funding implements FundingInterface {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne((_) => Enrollment, { nullable: false, onDelete: 'CASCADE' })
  @ValidateNested()
  enrollment: Enrollment;

  @Column()
  enrollmentId: number;

  @ManyToOne(() => FundingSpace, { nullable: true, eager: true })
  @IsNotEmpty()
  fundingSpace?: FundingSpace;

	@Column({ type: 'date', nullable: true, transformer: momentTransformer })
	@IsNotEmpty()
	@FundingBeginsAfterEnrollmentEntry()
	startDate: Moment;

	@Column({ type: 'date', nullable: true, transformer: momentTransformer })
	@ValidateIf(f => !!f.startDate)
	@EndDateAfterStartDate()
	endDate: Moment;

  @Column(() => UpdateMetaData, { prefix: false })
  updateMetaData: UpdateMetaData;

  @DeleteDateColumn()
  deletedDate: Date;
}
