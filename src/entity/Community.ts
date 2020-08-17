import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

import { Organization } from './Organization';

@Entity()
export class Community {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany((type) => Organization, (Organization) => Organization.communityId)
  organizations?: Array<Organization>;
}
