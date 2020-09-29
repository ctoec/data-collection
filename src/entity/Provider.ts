import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
} from 'typeorm';

import { Provider as ProviderInterface } from '../../client/src/shared/models';

import { FundingSpace } from './FundingSpace';
import { Site } from './Site';
import { Organization } from './Organization';

@Entity()
export class Provider implements ProviderInterface {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  providerName: string;

  @OneToMany(() => Site, (site) => site.provider)
  sites?: Array<Site>;

  @OneToMany(() => FundingSpace, (fundingSpace) => fundingSpace.provider)
  fundingSpaces?: Array<FundingSpace>;

  @ManyToOne(() => Organization, { nullable: true })
  organization?: Organization;

  @Column({ nullable: true })
  organizationId?: number;
}
