import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToOne,
  Unique,
} from 'typeorm';

import {
  FundingSpace as FundingSpaceInterface,
  FundingSource,
  FundingTime,
  AgeGroup,
} from '../../client/src/shared/models';

import { Organization } from './Organization';
import { FundingTimeSplit } from './FundingTimeSplit';

@Entity()
@Unique('UQ_Source_AgeGroup_Time_Organization', [
  'source',
  'ageGroup',
  'time',
  'organization',
])
export class FundingSpace implements FundingSpaceInterface {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  capacity: number;

  @ManyToOne(() => Organization, { nullable: false })
  organization: Organization;

  @Column({ type: 'enum', enum: FundingSource })
  source: FundingSource;

  @Column({ type: 'enum', enum: AgeGroup })
  ageGroup: AgeGroup;

  @Column({ type: 'enum', enum: FundingTime })
  time: FundingTime;

  @OneToOne(() => FundingTimeSplit, (split) => split.fundingSpace, {
    eager: true,
  })
  timeSplit?: FundingTimeSplit;
}
