import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

import { User as UserInterface } from 'shared/models';

import { OrganizationPermission, SitePermission } from './Permission';
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

  // not mapped
  // convenience var: all sites the user has access to, via org + site permissions
  sites?: Array<Site>;
}
