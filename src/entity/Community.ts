import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

import { Organization } from './Organization';
import { Community as CommunityInterface } from '../../client/src/shared/modelss';

@Entity()
export class Community implements CommunityInterface {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany((type) => Organization, (Organization) => Organization.communityId)
  organizations?: Array<Organization>;
}
