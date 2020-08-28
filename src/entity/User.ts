import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

import { User as UserInterface } from '../../client/src/shared/models';

import {
  OrganizationPermission,
  SitePermission,
  CommunityPermission,
} from './Permission';

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

  // [virtual property] all sites the user has access to
  // via site, org and community perms
  siteIds?: Array<number>;

  // [virtual property] add organizations the user has access to
  // via org and community perms
  organizationIds?: Array<number>;
}
