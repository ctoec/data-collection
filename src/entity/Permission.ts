import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Unique,
  Column,
} from 'typeorm';

import { User } from './User';
import { Provider } from './Provider';
import { Site } from './Site';
import { Organization } from './Organization';

abstract class Permission {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, { nullable: false })
  user: User;
}

@Entity()
@Unique('UQ_USER_PROVIDER', ['user', 'provider'])
export class ProviderPermission extends Permission {
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
@Unique('UQ_USER_ORGANIZATION', ['user', 'organization'])
export class OrganizationPermission extends Permission {
  @ManyToOne(() => Organization)
  organization: Organization;

  @Column()
  organizationId: number;
}
