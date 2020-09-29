import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
} from 'typeorm';

import {
  Organization as OrganizationInterface,
  ChildUniqueIdType,
} from '../../client/src/shared/models';

import { FundingSpace } from './FundingSpace';
import { Site } from './Site';
import { Community } from './Community';
import { enumTransformer } from './transformers';

@Entity()
export class Organization implements OrganizationInterface {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  providerName: string;

  @ManyToOne(
    () => Organization,
    (organization) => organization.childOrganizations
  )
  parentOrganization?: Organization;

  @OneToMany(
    () => Organization,
    (organization) => organization.parentOrganization
  )
  childOrganizations?: Organization[];

  @OneToMany(() => Site, (site) => site.organization)
  sites?: Site[];

  @OneToMany(() => FundingSpace, (fundingSpace) => fundingSpace.organization)
  fundingSpaces?: FundingSpace[];

  @ManyToOne(() => Community, { nullable: true })
  community?: Community;

  @Column({
    type: 'varchar',
    length: 10,
    transformer: enumTransformer(ChildUniqueIdType),
  })
  childUniqueIdType?: ChildUniqueIdType;

  @Column({ nullable: true })
  c4kProviderId?: string;
}
