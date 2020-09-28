import { Entity, Column, PrimaryGeneratedColumn, Unique } from 'typeorm';

import {
  ReportingPeriod as ReportingPeriodInterface,
  FundingSource,
} from '../../client/src/shared/models';
import { Moment } from 'moment';
import { momentTransformer, enumTransformer } from './transformers';

@Entity()
@Unique('UQ_Type_Period', ['type', 'period'])
export class ReportingPeriod implements ReportingPeriodInterface {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'int',
    transformer: enumTransformer(FundingSource),
  })
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
