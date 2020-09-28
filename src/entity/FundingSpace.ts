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
import { simpleEnumTransformer } from './transformers/simpleEnumTransformer';

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

  @Column({
    type: 'simple-enum',
    enum: Object.keys(FundingSource),
    transformer: simpleEnumTransformer(FundingSource),
  })
  source: FundingSource;

  @Column({
    type: 'simple-enum',
    enum: Object.keys(AgeGroup),
    transformer: simpleEnumTransformer(AgeGroup),
  })
  ageGroup: AgeGroup;

  @Column({
    type: 'simple-enum',
    enum: Object.keys(FundingTime),
    transformer: simpleEnumTransformer(FundingTime),
  })
  time: FundingTime;

  @OneToOne(() => FundingTimeSplit, (split) => split.fundingSpace, {
    eager: true,
  })
  timeSplit?: FundingTimeSplit;
}
