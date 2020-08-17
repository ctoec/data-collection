import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToOne,
} from 'typeorm';

import {
  FundingSpace as FundingSpaceInterface,
  FundingSource,
  FundingTime,
  AgeGroup,
} from '../../shared/models';

import { Organization } from './Organization';
import { FundingTimeSplit } from './FundingTimeSplit';

@Entity()
export class FundingSpace implements FundingSpaceInterface {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  capacity: number;

  @ManyToOne((type) => Organization)
  organization: Organization;

  @Column({ type: 'enum', enum: FundingSource })
  source: FundingSource;

  @Column({ type: 'enum', enum: AgeGroup })
  ageGroup: AgeGroup;

  @Column({ type: 'enum', enum: FundingTime })
  time: FundingTime;

  @OneToOne((type) => FundingTimeSplit, { eager: true })
  timeSplit?: FundingTimeSplit;
}
