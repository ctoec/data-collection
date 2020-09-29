import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

import { Provider } from './Provider';
import { Community as CommunityInterface } from '../../client/src/shared/models';

@Entity()
export class Community implements CommunityInterface {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany((type) => Provider, (organization) => organization.community)
  organizations?: Array<Provider>;
}
