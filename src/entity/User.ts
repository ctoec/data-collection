import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  OneToOne,
  ManyToMany,
} from 'typeorm';

import { User as UserInterface } from '../../client/src/shared/models';

import {
  OrganizationPermission,
  ProviderPermission,
  SitePermission,
  Site,
  Provider,
  Organization,
} from '.';

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

  @OneToMany(() => ProviderPermission, (perm) => perm.user)
  providerPermissions?: Array<ProviderPermission>;

  @OneToMany(() => SitePermission, (perm) => perm.user)
  sitePermissions?: Array<SitePermission>;

  @OneToMany(() => OrganizationPermission, (perm) => perm.user)
  organizationPermissions?: Array<OrganizationPermission>;

  // [virtual property] all sites the user has read/write access to
  // via site, provider and organization perms
  siteIds?: Array<number>;
  sites?: Array<Site>;

  // [virtual property] all providers the user has read/write access to
  // via provider and organization perms
  providerIds?: Array<number>;
  provider?: Array<Provider>;

  // [virtual property] organization the user has read/write access to
  // via organization perm
  organizationIds?: Array<number>;
  organizations?: Array<Organization>;
}
