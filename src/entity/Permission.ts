import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Unique,
  Column,
} from 'typeorm';

import { ProviderPermission as ProviderPermissionInterface } from '../../client/src/shared/models';
import { User } from './User';
import { Provider } from './Provider';
import { Site } from './Site';
import { Community } from './Community';

abstract class Permission {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, { nullable: false })
  user: User;
}

@Entity()
@Unique('UQ_USER_PROVIDER', ['user', 'provider'])
export class ProviderPermission
  extends Permission
  implements ProviderPermission {
  @ManyToOne(() => Provider)
  provider: Provider;

  @Column()
  providerId: number;
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
