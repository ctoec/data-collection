import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  OneToOne,
} from 'typeorm';

import { User as UserInterface } from '../../client/src/shared/models';

import { OrganizationPermission, SitePermission } from './Permission';
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

  @OneToOne(() => OrganizationPermission, (perm) => perm.user)
  orgPermission?: OrganizationPermission;

  @OneToMany(() => SitePermission, (perm) => perm.user)
  sitePermissions?: SitePermission[];

  // [virtual property] the highest-level organization this user belongs to
  topLevelOrganizationId?: number;
  topLevelOrganization?: Organization;

  // [virtual property] all sites the user has read/write access to
  // via site, org and community perms
  siteIds?: number[];
  sites?: Site[];

  // [virtual property] all organizations the user has read/write access to
  // via org and community perms
  organizationIds?: number[];
  organizations?: Organization[];
}
