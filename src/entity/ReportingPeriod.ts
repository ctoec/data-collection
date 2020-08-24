import { Entity, Column, PrimaryGeneratedColumn, Unique } from 'typeorm';

import {
  ReportingPeriod as ReportingPeriodInterface,
  FundingSource,
} from '../../shared/models';
import { Moment } from 'moment';
import { momentTransformer } from './transformers/momentTransformer';

@Entity()
@Unique('UQ_Type_Period', ['type', 'period'])
export class ReportingPeriod implements ReportingPeriodInterface {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: FundingSource })
  type: FundingSource;

  @Column({ type: 'date', transformer: momentTransformer })
  period: Moment;

  @Column({ type: 'date', transformer: momentTransformer })
  periodStart: Moment;

  @Column({ type: 'date', transformer: momentTransformer })
  periodEnd: Moment;

  @Column({ type: 'date', transformer: momentTransformer })
  dueAt: Moment;
}
