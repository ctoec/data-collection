import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

import { Organization as OrganizationInterface } from 'shared/models';

import { FundingSpace } from './FundingSpace';
import { Site } from './Site';

@Entity()
export class Organization implements OrganizationInterface {
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
}
