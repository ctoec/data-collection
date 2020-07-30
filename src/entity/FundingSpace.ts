import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToOne,
} from 'typeorm';

import { Organization } from './Organization';
import { FundingSource, FundingTime, AgeGroup } from './enums';
import { FundingTimeSplit } from './FundingTimeSplit';

@Entity()
export class FundingSpace {
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
