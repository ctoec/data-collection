import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from 'typeorm';

import { Funding as FundingInterface } from '../../client/src/shared/models';

import { Enrollment } from './Enrollment';
import { ReportingPeriod } from './ReportingPeriod';
import { FundingSpace } from './FundingSpace';
import { UpdateMetaData } from './embeddedColumns/UpdateMetaData';
import { ValidateNested, IsNotEmpty } from 'class-validator';
import { LastReportingPeriodAfterFirst } from './decorators/Funding/lastReportingPeriodValidation';

@Entity()
export class Funding implements FundingInterface {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne((type) => Enrollment, { nullable: false, onDelete: 'CASCADE' })
  @ValidateNested()
  enrollment: Enrollment;

  @Column()
  enrollmentId: number;

  @ManyToOne(() => FundingSpace, { nullable: false, eager: true })
  @IsNotEmpty()
  fundingSpace: FundingSpace;

  @ManyToOne(() => ReportingPeriod, { eager: true })
  @IsNotEmpty()
  firstReportingPeriod?: ReportingPeriod;

  @ManyToOne(() => ReportingPeriod, { eager: true })
  @LastReportingPeriodAfterFirst()
  lastReportingPeriod?: ReportingPeriod;

  @Column(() => UpdateMetaData, { prefix: false })
  updateMetaData: UpdateMetaData;
}
