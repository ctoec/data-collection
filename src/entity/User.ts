import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

import { User as UserInterface } from '../../client/src/shared/models';

import {
  OrganizationPermission,
  SitePermission,
  CommunityPermission,
} from './Permission';
import { Site } from './Site';
import { Organization } from './Organization';

@Entity()
export class User implements UserInterface {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
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

  // [virtual property] all sites the user has read/write access to
  // via site, org and community perms
  siteIds?: Array<number>;
  sites?: Array<Site>;

  // [virtual property] all organizations the user has read/write access to
  // via org and community perms
  organizationIds?: Array<number>;
  organizations?: Array<Organization>;
}
