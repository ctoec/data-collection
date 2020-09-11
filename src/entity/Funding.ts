import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
} from 'typeorm';

import { Funding as FundingInterface } from '../../client/src/shared/models';

import { Enrollment } from './Enrollment';
import { ReportingPeriod } from './ReportingPeriod';
import { FundingSpace } from './FundingSpace';
import { UpdateMetaData } from './embeddedColumns/UpdateMetaData';
import { ValidateNested, IsNotEmpty } from 'class-validator';
import { LastReportingPeriodAfterFirst } from './decorators/lastReportingPeriodValidation';

@Entity()
export class Funding implements FundingInterface {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne((type) => Enrollment, { nullable: false, onDelete: 'CASCADE' })
  @ValidateNested()
  enrollment: Enrollment;

  @Column()
  enrollmentId: number;

  @ManyToOne((type) => FundingSpace, { nullable: false, eager: true })
  @IsNotEmpty()
  fundingSpace: FundingSpace;

  @ManyToOne((type) => ReportingPeriod, { nullable: false, eager: true })
  @IsNotEmpty()
  firstReportingPeriod: ReportingPeriod;

  @ManyToOne((type) => ReportingPeriod, { eager: true })
  @LastReportingPeriodAfterFirst()
  lastReportingPeriod?: ReportingPeriod;

  @Column((type) => UpdateMetaData, { prefix: false })
  updateMetaData?: UpdateMetaData;
}
