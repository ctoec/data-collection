import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from 'typeorm';

import { Funding as FundingInterface } from '../../client/src/shared/models';

import { Enrollment } from './Enrollment';
import { ReportingPeriod } from './ReportingPeriod';
import { FundingSpace } from './FundingSpace';
import { UpdateMetaData } from './embeddedColumns/UpdateMetaData';

@Entity()
export class Funding implements FundingInterface {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne((type) => Enrollment, { nullable: false })
  enrollment: Enrollment;

  @Column()
  enrollmentId: number;

  @ManyToOne((type) => FundingSpace, { nullable: false, eager: true })
  fundingSpace: FundingSpace;

  @ManyToOne((type) => ReportingPeriod, { eager: true })
  firstReportingPeriod?: ReportingPeriod;

  @ManyToOne((type) => ReportingPeriod, { eager: true })
  lastReportingPeriod?: ReportingPeriod;

  @Column((type) => UpdateMetaData, { prefix: false })
  updateMetaData?: UpdateMetaData;
}
