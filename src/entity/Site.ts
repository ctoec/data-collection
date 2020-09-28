import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';

import { Site as SiteInterface, Region } from '../../client/src/shared/models';

import { Enrollment } from './Enrollment';
import { Organization } from './Organization';
import { simpleEnumTransformer } from './transformers/simpleEnumTransformer';

@Entity()
export class Site implements SiteInterface {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  siteName: string;

  @Column()
  titleI: boolean;

  @Column({
    type: 'simple-enum',
    enum: Object.keys(Region),
    transformer: simpleEnumTransformer(Region),
  })
  region: Region;

  @Column({ nullable: true })
  facilityCode?: number;

  @Column({ nullable: true })
  licenseNumber?: number;

  @Column({ nullable: true })
  naeycId?: number;

  @Column({ nullable: true })
  registryId?: number;

  @ManyToOne(() => Organization, { nullable: false })
  organization: Organization;

  @Column()
  organizationId: number;

  @OneToMany(() => Enrollment, (enrollment) => enrollment.site)
  enrollments?: Array<Enrollment>;
}
