import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

import { FundingTimeSplit as FundingTimeSplitInterface } from 'shared/models';

import { FundingSpace } from './FundingSpace';

@Entity()
export class FundingTimeSplit implements FundingTimeSplitInterface {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne((type) => FundingSpace, { nullable: false })
  fundingSpace: FundingSpace;

  @Column()
  fullTimeWeeks: number;

  @Column()
  partTimeWeeks: number;
}
