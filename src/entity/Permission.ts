import {
  Entity,
  TableInheritance,
  PrimaryGeneratedColumn,
  ManyToOne,
  ChildEntity,
} from 'typeorm';
import { User } from './User';
import { Organization } from './Organization';
import { Site } from './Site';

enum PermissionType {
  Organization = 1,
  Site = 2,
}

@Entity()
@TableInheritance({ column: { type: 'enum', enum: PermissionType } })
export abstract class Permission {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne((type) => User, { nullable: false })
  user: User;
}

@ChildEntity(PermissionType.Organization)
export class OrganizationPermission extends Permission {
  @ManyToOne((type) => Organization)
  organization: Organization;
}

@ChildEntity(PermissionType.Site)
export class SitePermission extends Permission {
  @ManyToOne((type) => Site)
  site: Site;
}
