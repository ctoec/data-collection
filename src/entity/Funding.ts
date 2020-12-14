import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  DeleteDateColumn,
} from 'typeorm';

import { Funding as FundingInterface } from '../../client/src/shared/models';

import { Enrollment } from './Enrollment';
import { ReportingPeriod } from './ReportingPeriod';
import { FundingSpace } from './FundingSpace';
import { UpdateMetaData } from './embeddedColumns/UpdateMetaData';
import { ValidateNested, IsNotEmpty } from 'class-validator';
import { LastReportingPeriodAfterFirst } from './decorators/Funding/lastReportingPeriodValidation';
import { FundingBeginsAfterEnrollmentEntry } from './decorators/Funding/fundingBeginsAfterEnrollmentEntry';
import { FundingDoesNotOverlap } from './decorators/Funding/fundingOverlapValidation';

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

  @ManyToOne(() => ReportingPeriod, { eager: true })
  @IsNotEmpty()
  @FundingBeginsAfterEnrollmentEntry()
  @FundingDoesNotOverlap()
  firstReportingPeriod?: ReportingPeriod;

  @ManyToOne(() => ReportingPeriod, { eager: true })
  @LastReportingPeriodAfterFirst()
  @FundingDoesNotOverlap()
  lastReportingPeriod?: ReportingPeriod;

  @Column(() => UpdateMetaData, { prefix: false })
  updateMetaData: UpdateMetaData;

  @DeleteDateColumn()
  deletedDate: Date;
}
