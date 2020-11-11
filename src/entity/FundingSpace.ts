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
import { enumTransformer } from './transformers';

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

  @Column()
  organizationId: number;

  @Column({
    type: 'varchar',
    length: 20,
    transformer: enumTransformer(FundingSource),
  })
  source: FundingSource;

  @Column({
    type: 'varchar',
    length: 20,
    transformer: enumTransformer(AgeGroup),
  })
  ageGroup: AgeGroup;

  @Column({
    type: 'varchar',
    length: 50,
    transformer: enumTransformer(FundingTime),
  })
  time: FundingTime;

  @OneToOne(() => FundingTimeSplit, (split) => split.fundingSpace, {
    eager: true,
  })
  timeSplit?: FundingTimeSplit;
}
