import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';

import { FundingTimeSplit as FundingTimeSplitInterface } from '../../client/shared/models';

import { FundingSpace } from './FundingSpace';

@Entity()
export class FundingTimeSplit implements FundingTimeSplitInterface {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => FundingSpace, { nullable: false })
  @JoinColumn()
  fundingSpace: FundingSpace;

  @Column()
  fullTimeWeeks: number;

  @Column()
  partTimeWeeks: number;
}
