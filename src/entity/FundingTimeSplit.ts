import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { FundingSpace } from './FundingSpace';

@Entity()
export class FundingTimeSplit {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne((type) => FundingSpace)
  fundingSpace: FundingSpace;

  @Column()
  fullTimeWeeks: number;

  @Column()
  partTimeWeeks: number;
}
