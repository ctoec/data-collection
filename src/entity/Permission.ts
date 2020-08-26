import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Unique,
  Column,
} from 'typeorm';

import { User } from './User';
import { Organization } from './Organization';
import { Site } from './Site';
import { Community } from './Community';

abstract class Permission {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, { nullable: false })
  user: User;
}

@Entity()
@Unique('UQ_USER_ORGANIZATION', ['user', 'organization'])
export class OrganizationPermission extends Permission {
  @ManyToOne(() => Organization)
  organization: Organization;

  @Column()
  organizationId: number;
}

@Entity()
@Unique('UQ_USER_SITE', ['user', 'site'])
export class SitePermission extends Permission {
  @ManyToOne(() => Site)
  site: Site;

  @Column()
  siteId: number;
}

@Entity()
@Unique('UQ_USER_COMMUNITY', ['user', 'community'])
export class CommunityPermission extends Permission {
  @ManyToOne(() => Community)
  community: Community;

  @Column()
  communityId: number;
}
