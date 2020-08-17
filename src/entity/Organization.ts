import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

import { FundingSpace } from './FundingSpace';
import { Site } from './Site';

@Entity()
export class Organization {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany((type) => Site, (site) => site.organization)
  sites?: Array<Site>;

  @OneToMany(
    (type) => FundingSpace,
    (fundingSpace) => fundingSpace.organization
  )
  fundingSpaces?: Array<FundingSpace>;

  @Column()
  communityId?: number;
}
