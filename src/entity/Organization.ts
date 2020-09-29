import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
  Unique,
} from 'typeorm';

import {
  Organization as OrganizationInterface,
  ChildUniqueIdType,
} from '../../client/src/shared/models';

import { FundingSpace } from './FundingSpace';
import { Site } from './Site';
import { enumTransformer } from './transformers';

@Entity()
@Unique('UQ_providerName_parentOrganizationId', [
  'providerName',
  'parentOrganization',
])
export class Organization implements OrganizationInterface {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
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

  @Column({
    type: 'varchar',
    length: 10,
    transformer: enumTransformer(ChildUniqueIdType),
  })
  childUniqueIdType: ChildUniqueIdType;
}
