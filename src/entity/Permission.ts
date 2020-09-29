import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Unique,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';

import {
  OrganizationPermission as OrganizationPermissionInterface,
  SitePermission as SitePermissionInterface,
} from '../../client/src/shared/models';
import { User } from './User';
import { Organization } from './Organization';
import { Site } from './Site';

@Entity()
@Unique('UQ_USER_ORGANIZATION', ['user', 'organization'])
export class OrganizationPermission implements OrganizationPermissionInterface {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => User, { nullable: false })
  @JoinColumn()
  user: User;

  @ManyToOne(() => Organization)
  organization: Organization;

  @Column()
  organizationId: number;
}

@Entity()
@Unique('UQ_USER_SITE', ['user', 'site'])
export class SitePermission implements SitePermissionInterface {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, { nullable: false })
  user: User;

  @ManyToOne(() => Site)
  site: Site;

  @Column()
  siteId: number;
}
