import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
} from 'typeorm';

import {
  Organization as OrganizationInterface,
  UniqueIdType,
} from '../../client/src/shared/models';

import { FundingSpace } from './FundingSpace';
import { Site } from './Site';
import { Community } from './Community';
import { enumTransformer } from './transformers';

@Entity()
export class Organization implements OrganizationInterface {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 10,
    default: UniqueIdType.Other.toString(),
    transformer: enumTransformer(UniqueIdType),
  })
  uniqueIdType: UniqueIdType = UniqueIdType.Other;

  @Column({ unique: true })
  providerName: string;

  @OneToMany(() => Site, (site) => site.organization)
  sites?: Array<Site>;

  @OneToMany(() => FundingSpace, (fundingSpace) => fundingSpace.organization)
  fundingSpaces?: Array<FundingSpace>;

  @ManyToOne(() => Community, { nullable: true })
  community?: Community;

  @Column({ nullable: true })
  communityId?: number;

  @Column({ nullable: true })
  submittedData?: boolean;
}
