import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

import { User as UserInterface } from '../../client/src/shared/models';

import {
  OrganizationPermission,
  SitePermission,
  CommunityPermission,
} from './Permission';
import { Site } from './Site';

@Entity()
export class User implements UserInterface {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  wingedKeysId: string;
  @Column()
  firstName: string;
  @Column()
  lastName: string;
  @Column({ nullable: true })
  middleName?: string;
  @Column({ nullable: true })
  suffix?: string;

  @OneToMany((type) => OrganizationPermission, (perm) => perm.user)
  orgPermissions?: Array<OrganizationPermission>;

  @OneToMany((type) => SitePermission, (perm) => perm.user)
  sitePermissions?: Array<SitePermission>;

  @OneToMany(() => CommunityPermission, (perm) => perm.user)
  communityPermissions?: Array<CommunityPermission>;

  // not mapped
  // convenience var: all sites the user has access to, via org + site permissions
  sites?: Array<Site>;
}
