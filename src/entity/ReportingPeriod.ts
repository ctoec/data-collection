import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

import {
  ReportingPeriod as ReportingPeriodInterface,
  FundingSource,
} from '../../shared/models';

@Entity()
export class ReportingPeriod implements ReportingPeriodInterface {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: FundingSource })
  type: FundingSource;

  @Column({ type: 'date' })
  period: Date;

  @Column({ type: 'date' })
  periodStart: Date;

  @Column({ type: 'date' })
  periodEnd: Date;

  @Column({ type: 'date' })
  dueAt: Date;
}
